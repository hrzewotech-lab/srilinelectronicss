const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

/**
 * Creates a multer upload middleware that streams files directly to a
 * given Cloudinary folder (e.g. "srilin/hero", "srilin/clients").
 * Usage: upload("srilin/hero").single("image")
 */
const createUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "svg"],
      // Cloudinary auto-generates a public_id if not provided
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp|svg/;
      const isValid = allowed.test(file.mimetype);
      if (isValid) {
        cb(null, true);
      } else {
        cb(new Error("Only image files (jpg, jpeg, png, webp, svg) are allowed"));
      }
    },
  });
};

module.exports = createUploader;
