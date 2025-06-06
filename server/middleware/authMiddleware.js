const jwt = require("jsonwebtoken");

const User = require("../model/User");

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.sendStatus(404);

    if (user.isBlocked) {
      return res.status(403).json({ error: "Access denied. You are blocked." });
    }

    req.user = {
      id: user._id,
      isAdmin: user.isAdmin,
      name: user.name,
      email: user.email,
    };
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user?.isAdmin)
    return res.status(403).json({ error: "Admin access only" });
  next();
}

module.exports = { authenticate, authorizeAdmin };
