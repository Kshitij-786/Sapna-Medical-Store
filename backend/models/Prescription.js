const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },  // saved file name on disk
  original: { type: String },                   // original file name
  mimetype: { type: String },
  reviewed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Prescription", prescriptionSchema);