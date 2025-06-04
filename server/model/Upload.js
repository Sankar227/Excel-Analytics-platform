const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "usertestjs" },
  timestamp: { type: Date, default: Date.now },
  fileName: { type: String },
  preview: { type: Array },
});

module.exports = mongoose.model("Uploadjs", uploadSchema);
