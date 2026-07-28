const asyncHandler = require("express-async-handler");
const TeamMember = require("../models/TeamMember");
const cloudinary = require("../config/cloudinary");

const createTeamMember = asyncHandler(async (req, res) => {
  const { name, designation, message, honors, contact, order, isFeatured, isActive } = req.body;

  if (!name || !designation) {
    res.status(400);
    throw new Error("Name and designation are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Team member image is required");
  }

  const parsedHonors = honors
    ? honors.split("\n").map((item) => item.trim()).filter(Boolean)
    : [];

  const member = await TeamMember.create({
    name,
    designation,
    message,
    honors: parsedHonors,
    contact,
    order: Number(order) || 0,
    isFeatured: isFeatured === "true" || isFeatured === true,
    isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, member });
});

const getTeamMembers = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const members = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });
  res.status(200).json({ success: true, count: members.length, members });
});

const getTeamMemberById = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }
  res.status(200).json({ success: true, member });
});

const updateTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }

  const { name, designation, message, honors, contact, order, isFeatured, isActive } = req.body;

  if (name) member.name = name;
  if (designation) member.designation = designation;
  if (message !== undefined) member.message = message;
  if (contact !== undefined) member.contact = contact;
  if (order !== undefined) member.order = Number(order) || 0;
  if (isFeatured !== undefined) {
    member.isFeatured = isFeatured === "true" || isFeatured === true;
  }
  if (honors !== undefined) {
    member.honors = honors
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (isActive !== undefined) member.isActive = isActive === "true" || isActive === true;

  if (req.file) {
    await cloudinary.uploader.destroy(member.image.public_id);
    member.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await member.save();

  res.status(200).json({ success: true, member });
});

const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error("Team member not found");
  }

  await cloudinary.uploader.destroy(member.image.public_id);
  await member.deleteOne();

  res.status(200).json({ success: true, message: "Team member deleted successfully" });
});

module.exports = { createTeamMember, getTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember };
