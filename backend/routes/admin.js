const express      = require("express");
const User         = require("../models/User");
const Order        = require("../models/Order");
const Product      = require("../models/Product");
const Prescription = require("../models/Prescription");
const { protect, adminOnly } = require("../middleware/auth");
const router       = express.Router();

// GET /api/admin/dashboard  – all stats in one call
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
      recentOrders,
      recentUsers,
      totalPrescriptions,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.find().sort({ createdAt: -1 }).limit(10)
        .populate("user", "name email"),
      User.find({ role: "user" }).sort({ createdAt: -1 }).limit(10)
        .select("name email createdAt totalOrders lastLogin"),
      Prescription.countDocuments(),
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalSold: { $sum: "$items.qty" }, revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        totalPrescriptions,
      },
      recentOrders,
      recentUsers,
      topProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/admin/users  – all users with order count
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;