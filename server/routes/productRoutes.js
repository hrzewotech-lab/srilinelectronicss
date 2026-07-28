const express = require("express");
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/product");

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateProduct);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteProduct);

module.exports = router;
