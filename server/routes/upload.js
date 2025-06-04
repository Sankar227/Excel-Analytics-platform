const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const jwt = require("jsonwebtoken");
const Upload = require("../model/Upload");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).json({ error: "Admin access only" });
  next();
}

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  const ext = req.file.originalname.split(".").pop().toLowerCase();
  if (!["xlsx", "xls", "csv"].includes(ext)) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Please upload Excel or CSV." });
  }

  const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const existing = await Upload.findOne({
    userId: req.user.id,
    fileName: req.file.originalname,
  });
  if (existing) {
    existing.preview = sheet;
    existing.timestamp = new Date();
    await existing.save();
    return res.json({ data: sheet, message: "Existing file updated." });
  }

  const newUpload = await Upload.create({
    userId: req.user.id,
    fileName: req.file.originalname,
    preview: sheet,
  });

  res.json({ data: sheet, message: "New file uploaded." });
});

router.get("/history", authenticate, async (req, res) => {
  const uploads = await Upload.find({ userId: req.user.id }).sort({
    timestamp: -1,
  });
  res.json(uploads);
});

router.get(
  "/admin/all-uploads",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const uploads = await Upload.find({})
      .populate("userId", "email")
      .sort({ timestamp: -1 });
    res.json(uploads);
  }
);

router.delete("/admin/:id", authenticate, authorizeAdmin, async (req, res) => {
  const deleted = await Upload.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "File not found" });
  res.json({ success: true, message: "Admin deleted the file successfully." });
});

router.delete("/:id", authenticate, async (req, res) => {
  const deleted = await Upload.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!deleted) return res.status(404).json({ error: "File not found" });
  res.json({ success: true, message: "File deleted successfully." });
});

module.exports = router;
