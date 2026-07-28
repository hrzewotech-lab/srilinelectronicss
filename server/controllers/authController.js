const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const setTokenCookie = (res, token) => {
  const days = parseInt(process.env.JWT_COOKIE_EXPIRES_DAYS || "7", 10);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: days * 24 * 60 * 60 * 1000,
  });
};

// @desc    Login (shared login page for admin & superadmin)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Contact the super admin.");
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    token, // also returned in body for clients using Authorization header instead of cookies
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // frontend uses this to hide/show "Manage Admins" section
    },
  });
});

// @desc    Logout - clears auth cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      lastLogin: req.user.lastLogin,
    },
  });
});

module.exports = { loginUser, logoutUser, getMe };
