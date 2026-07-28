const express = require("express");
const {
  createCertificate,
  getCertificates,
  updateCertificate,
  deleteCertificate,
} = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const router = express.Router();
const upload = createUploader("srilin/certificates");

router.get("/", getCertificates);
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  createCertificate
);
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  upload.single("image"),
  updateCertificate
);
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  deleteCertificate
);

module.exports = router;
