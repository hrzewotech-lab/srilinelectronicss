const asyncHandler = require("express-async-handler");
const CareerApplication = require("../models/CareerApplication");

const createCareerApplication = asyncHandler(async (req, res) => {
  const { name, email, phone, qualification } = req.body;

  if (!name || !email || !phone || !qualification) {
    res.status(400);
    throw new Error("Name, email, phone, and qualification are required");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Resume is required");
  }

  const application = await CareerApplication.create({
    name,
    email,
    phone,
    qualification,
    resume: {
      url: req.file.path,
      public_id: req.file.filename,
      originalName: req.file.originalname,
    },
  });

  res.status(201).json({
    success: true,
    message: "Your application has been submitted successfully",
    applicationId: application._id,
  });
});

module.exports = { createCareerApplication };
