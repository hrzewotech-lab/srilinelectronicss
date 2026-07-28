const asyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, isActive, order } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Title and description are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Blog image is required");
  }

  const blog = await Blog.create({
    title,
    description,
    isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
    order: Number(order) || 0,
    image: {
      url: req.file.path,
      public_id: req.file.filename,
    },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, blog });
});

const getBlogs = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { isActive: true };
  const blogs = await Blog.find(filter).sort({ order: 1, createdAt: -1 });
  res.status(200).json({ success: true, count: blogs.length, blogs });
});

const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }
  res.status(200).json({ success: true, blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  const { title, description, isActive, order } = req.body;

  if (title) blog.title = title;
  if (description !== undefined) blog.description = description;
  if (isActive !== undefined) blog.isActive = isActive === "true" || isActive === true;
  if (order !== undefined) blog.order = Number(order) || 0;

  if (req.file) {
    await cloudinary.uploader.destroy(blog.image.public_id);
    blog.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  await blog.save();

  res.status(200).json({ success: true, blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error("Blog not found");
  }

  await cloudinary.uploader.destroy(blog.image.public_id);
  await blog.deleteOne();

  res.status(200).json({ success: true, message: "Blog deleted successfully" });
});

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog };
