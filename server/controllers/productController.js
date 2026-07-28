const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
  const { name, description, specifications, isActive } = req.body;

  if (!name || !description) {
    res.status(400);
    throw new Error("Product name and description are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Product image is required");
  }

  const parsedSpecifications = specifications
    ? specifications.split("\n").map((item) => item.trim()).filter(Boolean)
    : [];

  const product = await Product.create({
    name,
    description,
    specifications: parsedSpecifications,
    isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, product });
});

const getProducts = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: products.length, products });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.status(200).json({ success: true, product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, description, specifications, isActive } = req.body;

  if (name) product.name = name;
  if (description !== undefined) product.description = description;
  if (specifications !== undefined) {
    product.specifications = specifications
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (isActive !== undefined) product.isActive = isActive === "true" || isActive === true;

  if (req.file) {
    await cloudinary.uploader.destroy(product.image.public_id);
    product.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await product.save();

  res.status(200).json({ success: true, product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await cloudinary.uploader.destroy(product.image.public_id);
  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
