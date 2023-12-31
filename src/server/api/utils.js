const jwt = require("jsonwebtoken")
function authenticateToken(req, res, next) {
  console.log("into auth")
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }
  // console.log("Details : ",token,process.env.JWT_SECRET)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.log("err ",err)
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }

    req.user = user;
    console.log("to next")
    next();
  });
}
function requireUser(req, res, next) {
  if (!req.user) {
    res.status(401);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action"
    });
  }
  next()
};
function requireAdmin(req, res, next) {
  if (req.user && !req.user.isAdmin) {
    res.status(403);
    next({
      name: "Unathorized",
      message: "Must be an administrator to perform this action"
    });
  }
  else if (req.user && req.user.isAdmin) {
    next();
  }
};

module.exports = { authenticateToken, requireUser, requireAdmin }