const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserRole,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// Every route below is restricted to superadmin only.
// This is the backend enforcement behind the "hide Add Admin page from admins" requirement -
// even if an admin somehow calls the API directly, they get a 403.
router.use(protect, authorize("superadmin"));

router.route("/").post(createUser).get(getUsers);

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

router.patch("/:id/role", changeUserRole);

module.exports = router;
