const express = require("express");
const router = express.Router();
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/blog");

router.get("/", getBlogs);
router.get("/:id", getBlogById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createBlog);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateBlog);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteBlog);

module.exports = router;
