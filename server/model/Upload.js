const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "usertestjs" },
  fileName: { type: String },
  preview: { type: Array },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Uploadjs", uploadSchema);
