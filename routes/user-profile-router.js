const express = require("express");
const router = express.Router();

const userProfilesController = require("../controllers/user-profile-controller");
const authController = require("../controllers/auth-controller");
const userProfileSettingsRouter = require("../routes/user-profile-settings-router");

router
    .route("/")
    .get(userProfilesController.get)
    .post(
        authController.protect,
        authController.isCurrentUser,
        userProfilesController.create
    )
    .patch(
        authController.protect,
        authController.isCurrentUser,
        userProfilesController.update
    )
    .delete(
        authController.protect,
        authController.isCurrentUser,
        userProfilesController.delete
    );

router.use("/settings", userProfileSettingsRouter);

module.exports = router;
