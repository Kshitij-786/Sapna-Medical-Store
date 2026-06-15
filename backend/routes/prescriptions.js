const express      = require("express");
const multer       = require("multer");
const path         = require("path");
const Prescription = require("../models/Prescription");
const { protect, adminOnly } = require("../middleware/auth");
const router       = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, and PDF files are allowed."));
  },
});

// POST /api/prescriptions  – upload
router.post("/", protect, upload.single("prescription"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded." });

    const prescription = await Prescription.create({
      user:     req.user.id,
      filename: req.file.filename,
      original: req.file.originalname,
      mimetype: req.file.mimetype,
    });

    res.status(201).json({ success: true, prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error." });
  }
});

// GET /api/prescriptions  – admin sees all
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");
    res.json({ success: true, prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;