const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// @desc    Add a new admin/superadmin user
// @route   POST /api/users
// @access  Private (superadmin only)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("A user with this email already exists");
  }

  // Only a superadmin can directly create another superadmin;
  // default role is "admin" if not specified.
  const newUser = await User.create({
    name,
    email,
    password,
    role: role === "superadmin" ? "superadmin" : "admin",
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: newUser.isActive,
    },
  });
});

// @desc    Get all admin/superadmin users
// @route   GET /api/users
// @access  Private (superadmin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Get single user by id
// @route   GET /api/users/:id
// @access  Private (superadmin only)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, user });
});

// @desc    Update a user's basic details (name, email, isActive)
// @route   PUT /api/users/:id
// @access  Private (superadmin only)
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, isActive } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (typeof isActive === "boolean") user.isActive = isActive;

  await user.save();

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// @desc    Promote an admin to superadmin (or demote back to admin)
// @route   PATCH /api/users/:id/role
// @access  Private (superadmin only)
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["admin", "superadmin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be either 'admin' or 'superadmin'");
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent a superadmin from accidentally demoting themselves
  // and locking everyone out of superadmin access.
  if (user._id.equals(req.user._id) && role === "admin") {
    res.status(400);
    throw new Error("You cannot demote your own account");
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name} is now ${role}`,
    user: { id: user._id, name: user.name, role: user.role },
  });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (superadmin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.equals(req.user._id)) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted successfully" });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserRole,
  deleteUser,
};
