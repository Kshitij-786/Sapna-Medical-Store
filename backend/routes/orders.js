const express = require("express");
const Order   = require("../models/Order");
const Cart    = require("../models/Cart");
const User    = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");
const router  = express.Router();

// POST /api/orders  – place a new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, subtotal, prescriptionId } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    const deliveryCharge = 40;
    const total = subtotal + deliveryCharge;

    const order = await Order.create({
      user:     req.user.id,
      items,
      subtotal,
      deliveryCharge,
      total,
      prescription: prescriptionId || null,
    });

    // Clear the user's cart after placing order
    await Cart.findOneAndDelete({ user: req.user.id });

    // Increment user's order count
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalOrders: 1 } });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/orders/my  – get current user's orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name img");
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ── ADMIN ROUTES ─────────────────────────────────────────────

// GET /api/orders  – all orders (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone")
      .populate("items.product", "name");
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// PUT /api/orders/:id/status  – update order status (admin)
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;