const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const User = require("../model/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (user.isBlocked) {
    return res.status(403).json({ error: "Your account has been blocked" });
  }

  const isValid = bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET
  );
  res.json({
    token,
    user: { id: user._id, name: user.name, isAdmin: user.isAdmin },
  });
});

router.get("/admin/users", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email isAdmin isBlocked");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.patch(
  "/admin/users/:id/block",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { isBlocked } = req.body;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { isBlocked },
        { new: true }
      );
      if (!user) return res.status(404).json({ error: "User not found" });

      res.json({
        message: `User has been ${isBlocked ? "blocked" : "unblocked"}`,
        user,
      });
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.delete(
  "/admin/users/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
