const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  category:       { type: String, required: true },
  mrp:            { type: Number, required: true },
  discountedPrice:{ type: Number, required: true },
  img:            { type: String, default: "" },  // image URL
  stock:          { type: Number, default: 100 },
  isActive:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);