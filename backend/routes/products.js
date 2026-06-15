const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");
const router  = express.Router();

// ─── GET ALL PRODUCTS (public) ───────────────────────────────
// GET /api/products
// GET /api/products?category=Tablets
// GET /api/products?search=paracetamol
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { isActive: true };

    if (category && category !== "All") filter.category = category;
    if (search) {
      filter.$or = [
        { name:     { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── ADD PRODUCT (admin only) ────────────────────────────────
// POST /api/products
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, category, mrp, discountedPrice, img, stock } = req.body;
    if (!name || !category || !mrp || !discountedPrice) {
      return res.status(400).json({ success: false, message: "Name, category, MRP and price required." });
    }
    const product = await Product.create({ name, category, mrp, discountedPrice, img, stock });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── EDIT PRODUCT (admin only) ───────────────────────────────
// PUT /api/products/:id
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ─── DELETE PRODUCT (admin only) ─────────────────────────────
// DELETE /api/products/:id
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Product removed." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;