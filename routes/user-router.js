// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/services/APIRestrictor");
const usersController = require("../controllers/user-controller");
const userProfilesRouter = require("../routes/user-profile-router");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(APIRestrictor.restrictTo("admin"), usersController.getAllUsers)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);
router.patch("/update-data", usersController.updateData);
router.delete("/delete-data", usersController.deleteData);
// ------------------------------
// USER PROFILES ROUTE MOUNTING
// ------------------------------
router.use("/profiles", userProfilesRouter);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
