const express = require("express");
const Cart    = require("../models/Cart");
const { protect } = require("../middleware/auth");
const router  = express.Router();

// GET /api/cart  – load cart for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// POST /api/cart  – save/replace entire cart
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;  // [{ product: id, qty: 2 }, ...]
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user.id, items });
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// DELETE /api/cart  – clear cart
router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    res.json({ success: true, message: "Cart cleared." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;