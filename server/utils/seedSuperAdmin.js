// Run once: node utils/seedSuperAdmin.js
// Creates the very first SuperAdmin account using credentials from .env
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const seed = async () => {
  await connectDB();

  const { SEED_SUPERADMIN_NAME, SEED_SUPERADMIN_EMAIL, SEED_SUPERADMIN_PASSWORD } = process.env;

  if (!SEED_SUPERADMIN_EMAIL || !SEED_SUPERADMIN_PASSWORD) {
    console.error("Missing SEED_SUPERADMIN_EMAIL or SEED_SUPERADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existing = await User.findOne({ email: SEED_SUPERADMIN_EMAIL });
  if (existing) {
    console.log("SuperAdmin already exists:", existing.email);
    process.exit(0);
  }

  const superAdmin = await User.create({
    name: SEED_SUPERADMIN_NAME || "Super Admin",
    email: SEED_SUPERADMIN_EMAIL,
    password: SEED_SUPERADMIN_PASSWORD,
    role: "superadmin",
  });

  console.log("SuperAdmin created successfully:", superAdmin.email);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
