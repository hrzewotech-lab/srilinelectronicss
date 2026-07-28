const express = require("express");
const router = express.Router();
const { createTeamMember, getTeamMembers, getTeamMemberById, updateTeamMember, deleteTeamMember } = require("../controllers/teamController");
const { protect, authorize } = require("../middleware/auth");
const createUploader = require("../middleware/upload");

const upload = createUploader("srilin/team");

router.get("/", getTeamMembers);
router.get("/:id", getTeamMemberById);

router.post("/", protect, authorize("admin", "superadmin"), upload.single("image"), createTeamMember);
router.put("/:id", protect, authorize("admin", "superadmin"), upload.single("image"), updateTeamMember);
router.delete("/:id", protect, authorize("admin", "superadmin"), deleteTeamMember);

module.exports = router;
