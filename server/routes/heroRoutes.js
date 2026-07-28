const express = require("express");
const router = express.Router();
const {
  createHeroSlide,
  getHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/hero");

// Public - homepage fetches active slides for the banner carousel
router.get("/", getHeroSlides);
router.get("/:id", getHeroSlideById);

// Private - both admin and superadmin can manage hero slides
router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createHeroSlide);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateHeroSlide);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteHeroSlide);

module.exports = router;
