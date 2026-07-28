const express = require("express");
const router = express.Router();
const { createService, getServices, getServiceById, updateService, deleteService } = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/service");

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createService);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateService);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteService);

module.exports = router;
