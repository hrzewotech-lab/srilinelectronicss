const asyncHandler = require("express-async-handler");
const HeroSlide = require("../models/HeroSlide");
const cloudinary = require("../config/cloudinary");

// @desc    Create a new hero slide (image upload required)
// @route   POST /api/hero
// @access  Private (admin, superadmin)
const createHeroSlide = asyncHandler(async (req, res) => {
  const { title, description, order } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Hero image is required");
  }

  const slide = await HeroSlide.create({
    title,
    description,
    order: order || 0,
    image: {
      url: req.file.path, // secure_url returned by multer-storage-cloudinary
      public_id: req.file.filename, // public_id returned by multer-storage-cloudinary
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, slide });
});

// @desc    Get all hero slides (public - only active ones shown on site)
// @route   GET /api/hero
// @access  Public
const getHeroSlides = asyncHandler(async (req, res) => {
  // Admin dashboard can pass ?all=true to see inactive slides too
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const slides = await HeroSlide.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: slides.length, slides });
});

// @desc    Get single hero slide
// @route   GET /api/hero/:id
// @access  Public
const getHeroSlideById = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) {
    res.status(404);
    throw new Error("Hero slide not found");
  }
  res.status(200).json({ success: true, slide });
});

// @desc    Update a hero slide (optionally replace image)
// @route   PUT /api/hero/:id
// @access  Private (admin, superadmin)
const updateHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) {
    res.status(404);
    throw new Error("Hero slide not found");
  }

  const { title, description, order, isActive } = req.body;

  if (title) slide.title = title;
  if (description) slide.description = description;
  if (order !== undefined) slide.order = order;
  if (isActive !== undefined) slide.isActive = isActive;

  // If a new image was uploaded, delete the old one from Cloudinary first
  if (req.file) {
    await cloudinary.uploader.destroy(slide.image.public_id);
    slide.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await slide.save();

  res.status(200).json({ success: true, slide });
});

// @desc    Delete a hero slide (and its Cloudinary image)
// @route   DELETE /api/hero/:id
// @access  Private (admin, superadmin)
const deleteHeroSlide = asyncHandler(async (req, res) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) {
    res.status(404);
    throw new Error("Hero slide not found");
  }

  await cloudinary.uploader.destroy(slide.image.public_id);
  await slide.deleteOne();

  res.status(200).json({ success: true, message: "Hero slide deleted successfully" });
});

module.exports = {
  createHeroSlide,
  getHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide,
};
