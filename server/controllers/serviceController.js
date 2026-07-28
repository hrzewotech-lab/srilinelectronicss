const asyncHandler = require("express-async-handler");
const Service = require("../models/Service");
const cloudinary = require("../config/cloudinary");

const createService = asyncHandler(async (req, res) => {
  const { title, description, bullets, isActive, order } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Service image is required");
  }

  const parsedBullets = bullets
    ? bullets.split("\n").map((item) => item.trim()).filter(Boolean)
    : [];

  const service = await Service.create({
    title,
    description,
    bullets: parsedBullets,
    isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
    order: Number(order) || 0,
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, service });
});

const getServices = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: services.length, services });
});

const getServiceById = asyncHandler(async (req, res) => {
  let service;
  const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
  
  if (isValidObjectId) {
    service = await Service.findById(req.params.id);
  }

  if (!service) {
    const slugify = (text) => text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    const services = await Service.find({});
    service = services.find(s => {
      const slug = slugify(s.title);
      if (slug === req.params.id) return true;

      // Legacy slug aliases compatibility:
      if (req.params.id === 'x-ray-inspection' && slug === 'x-ray-inspection-services') return true;
      if (req.params.id === 'box-build-integration' && slug === 'turn-key-box-build-integration') return true;
      if (req.params.id === 'embedded-design' && slug === 'embedded-design-services') return true;
      if (req.params.id === 'ecad-layout' && slug === 'ecad-layout-services') return true;

      return false;
    });
  }

  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }
  res.status(200).json({ success: true, service });
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  const { title, description, bullets, isActive, order } = req.body;

  if (title) service.title = title;
  if (description !== undefined) service.description = description;
  if (bullets !== undefined) {
    service.bullets = bullets
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (isActive !== undefined) service.isActive = isActive === "true" || isActive === true;
  if (order !== undefined) service.order = Number(order) || 0;

  if (req.file) {
    await cloudinary.uploader.destroy(service.image.public_id);
    service.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await service.save();

  res.status(200).json({ success: true, service });
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  await cloudinary.uploader.destroy(service.image.public_id);
  await service.deleteOne();

  res.status(200).json({ success: true, message: "Service deleted successfully" });
});

module.exports = { createService, getServices, getServiceById, updateService, deleteService };
