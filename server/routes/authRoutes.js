const express = require("express");
const router = express.Router();
const { loginUser, logoutUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Same login route/page serves both admin and superadmin;
// role is returned in the response so the frontend dashboard
// can conditionally show/hide the "Manage Admins" section.
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/me", protect, getMe);

module.exports = router;
