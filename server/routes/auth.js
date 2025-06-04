const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

module.exports = router;
