const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name:         String,   // snapshot at time of order
  price:        Number,
  qty:          Number,
});

const orderSchema = new mongoose.Schema({
  orderId:      { type: String, unique: true },   // like "ORD-20240601-0001"
  user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:        [orderItemSchema],
  subtotal:     Number,
  deliveryCharge: { type: Number, default: 40 },
  total:        Number,
  status:       { type: String, enum: ["pending", "confirmed", "delivered", "cancelled"], default: "pending" },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription", default: null },
}, { timestamps: true });

// Auto-generate orderId before saving
orderSchema.pre("save", async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    const date  = new Date().toISOString().slice(0,10).replace(/-/g,"");
    this.orderId = `ORD-${date}-${String(count + 1).padStart(4,"0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);