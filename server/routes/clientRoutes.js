const express = require("express");
const router = express.Router();
const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/clients");

router.get("/", getClients);
router.get("/:id", getClientById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createClient);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateClient);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteClient);

module.exports = router;
