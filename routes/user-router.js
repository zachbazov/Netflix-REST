const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const usersController = require("../controllers/user-controller");
const userProfilesRouter = require("../routes/user-profile-router");

router
    .route("/")
    .get(APIRestrictor.restrictTo("admin"), usersController.getAllUsers)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser);

router.patch(
    "/update-data",
    APIRestrictor.verifyToken,
    usersController.updateData
);
router.delete(
    "/delete-data",
    APIRestrictor.verifyToken,
    usersController.deleteData
);

router.use("/profiles", userProfilesRouter);

module.exports = router;
