const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
// const jwt = require("jsonwebtoken");
const Upload = require("../model/Upload");

const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
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
  } catch (er) {
    console.error("Upload error:", er);
    res.status(500).json({ error: "Upload failed. Try again." });
  }
});

router.get("/history", authenticate, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({
      timestamp: -1,
    });
    res.json(uploads);
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

router.get(
  "/admin/all-uploads",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    try {
      const uploads = await Upload.find({})
        .populate("userId", "email")
        .sort({ timestamp: -1 });

      res.json(uploads);
    } catch (err) {
      console.error("Admin fetch all error:", err);
      res.status(500).json({ error: "Failed to fetch uploads." });
    }
  }
);

router.delete("/admin/:id", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const deleted = await Upload.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "File not found" });

    res.json({ success: true, message: "File deleted by admin." });
  } catch (err) {
    console.error("Admin delete error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

// router.delete("/:id", authenticate, async (req, res) => {
//   const deleted = await Upload.findOneAndDelete({
//     _id: req.params.id,
//     userId: req.user.id,
//   });
//   if (!deleted) return res.status(404).json({ error: "File not found" });
//   res.json({ success: true, message: "File deleted successfully." });
// });

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const deleted = await Upload.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "File not found" });

    res.json({ success: true, message: "File deleted." });
  } catch (err) {
    console.error("User delete error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
});

module.exports = router;
