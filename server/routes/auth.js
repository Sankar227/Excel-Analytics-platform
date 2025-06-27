const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const User = require("../model/User");

const router = express.Router();

const axios = require("axios");

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

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account has been blocked" });
    }

    // ✅ Prevent Google-only users from logging in via password
    if (!user.password || typeof user.password !== "string") {
      return res.status(400).json({
        error:
          "This account was created using Google. Please login with Google or set a password.",
      });
    }

    // ✅ Password comparison only if password exists
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/set-password", authenticate, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters." });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      password: hashed,
      isGoogleUser: false, // update to false because user now has a password
    },
    // { new: true, select: "-password" } // Exclude password
    { new: true } // ✅ return updated user
  );

  res.status(200).json({
    message: "Password set successfully",
    user: updatedUser,
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

router.get("/profile/users/:id", authenticate, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .select("name email isAdmin isGoogleUser password") // include only what you need
    .then((user) => {
      if (!user) return res.status(404).json({ error: "User not found" });

      // Optional: expose whether password is set
      res.json({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isGoogleUser: user.isGoogleUser,
        hasPassword: !!user.password, // boolean flag for frontend
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
});

router.put("/profile/users/:id", authenticate, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) return res.status(404).json({ error: "User not found" });

  if (currentPassword && newPassword) {
    // Prevent password update if user has no password (Google account)
    if (!user.password) {
      return res.status(400).json({
        error:
          "Password change not available for Google-authenticated accounts",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
  }

  user.name = name || user.name;
  user.email = email || user.email;

  try {
    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to update profile" });
  }
});

router.post("/google", async (req, res) => {
  const { code } = req.body;

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      // redirect_uri: "http://localhost:3000", // Match frontend
      redirect_uri: "https://incomparable-babka-ac3971.netlify.app/", // Match frontend

      grant_type: "authorization_code",
    });

    const { access_token } = tokenRes.data;

    // 2. Get user info from Google
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const { email, name, picture, sub: googleId } = userInfo.data;

    // 3. Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // ➕ New user from Google
      user = await User.create({
        email,
        name,
        googleId,
        avatar: picture,
        isGoogleUser: true,
        password: null, // Ensure no password
      });
    } else {
      // 🔄 Update user to support Google login if not already
      let updated = false;

      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        updated = true;
      }
      if (picture && user.avatar !== picture) {
        user.avatar = picture;
        updated = true;
      }

      if (updated) {
        await user.save();
      }
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Google Login Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Google login failed" });
  }
});

module.exports = router;
