const mongoose = require("mongoose");

// User ka "blueprint" – database mein User kaisi dikhegi
const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone:         { type: String, trim: true, default: "" },
  password:      { type: String, required: true },
  role:          { type: String, enum: ["user", "admin"], default: "user" },
  lastLogin:     { type: Date, default: null },
  totalOrders:   { type: Number, default: 0 },
}, { timestamps: true }); // createdAt aur updatedAt automatic add hoga

module.exports = mongoose.model("User", userSchema);