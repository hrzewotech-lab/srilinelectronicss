const express = require("express");
const router = express.Router();
const { createFaq, getFaqs, getFaqById, updateFaq, deleteFaq, getCategories } = require("../controllers/faqController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getFaqs);
router.get("/categories", getCategories);
router.get("/:id", getFaqById);

router.post("/", protect, authorize("admin", "superadmin"), createFaq);
router.put("/:id", protect, authorize("admin", "superadmin"), updateFaq);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteFaq);

module.exports = router;

