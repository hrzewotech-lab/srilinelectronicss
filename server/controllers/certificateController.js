const asyncHandler = require("express-async-handler");
const Certificate = require("../models/Certificate");
const cloudinary = require("../config/cloudinary");

const parseBoolean = (value, fallback = true) => {
  if (value === undefined) return fallback;
  return value === true || value === "true";
};

const createCertificate = asyncHandler(async (req, res) => {
  const { name, order, isActive } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Certificate name is required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Certificate image is required");
  }

  const certificate = await Certificate.create({
    name,
    order: Number(order) || 0,
    isActive: parseBoolean(isActive),
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, certificate });
});

const getCertificates = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const certificates = await Certificate.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: certificates.length, certificates });
});

const updateCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  const { name, order, isActive } = req.body;

  if (name !== undefined) certificate.name = name;
  if (order !== undefined) certificate.order = Number(order) || 0;
  if (isActive !== undefined) certificate.isActive = parseBoolean(isActive);

  if (req.file) {
    await cloudinary.uploader.destroy(certificate.image.public_id);
    certificate.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await certificate.save();
  res.status(200).json({ success: true, certificate });
});

const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error("Certificate not found");
  }

  await cloudinary.uploader.destroy(certificate.image.public_id);
  await certificate.deleteOne();

  res.status(200).json({ success: true, message: "Certificate deleted successfully" });
});

module.exports = {
  createCertificate,
  getCertificates,
  updateCertificate,
  deleteCertificate,
};
