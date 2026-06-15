// backend/createAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const hash = await bcrypt.hash("Admin@1234", 12);
  await User.create({ name: "Sapna Admin", email: "admin@sapnamedical.com", password: hash, role: "admin" });
  console.log("✅ Admin created! Email: admin@sapnamedical.com | Password: Admin@1234");
  process.exit(0);
}
createAdmin().catch(err => { console.error(err); process.exit(1); });