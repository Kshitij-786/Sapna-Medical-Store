require("dotenv").config();

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const path       = require("path");

const app = express();

// ── SECURITY MIDDLEWARE ───────────────────────────────────────
app.use(helmet());   // Security headers

// Rate limiting – max 100 requests per 15 minutes per IP
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/", limiter);

// ── CORS (allow frontend to talk to backend) ─────────────────
app.use(cors({
  origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000"],
  credentials: true,
}));

// ── PARSE JSON ───────────────────────────────────────────────
app.use(express.json());

// ── SERVE UPLOADED FILES ─────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── ROUTES ───────────────────────────────────────────────────
app.use("/api",          require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cart",     require("./routes/cart"));
app.use("/api/orders",   require("./routes/orders"));
app.use("/api/prescriptions", require("./routes/prescriptions"));
app.use("/api/admin",    require("./routes/admin"));

// ── HEALTH CHECK ─────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "Sapna Medical Store API is running 🏥" }));

// ── CONNECT DATABASE & START SERVER ─────────────────────────
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });