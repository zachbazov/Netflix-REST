const express = require("express");
const router = express.Router();

const userProfilesSettingsController = require("../controllers/user-profile-settings-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(
        authController.protect,
        authController.isCurrentUser,
        userProfilesSettingsController.get
    )
    .post(
        authController.protect,
        authController.isCurrentUser,
        userProfilesSettingsController.create
    )
    .patch(
        authController.protect,
        authController.isCurrentUser,
        userProfilesSettingsController.update
    )
    .delete(
        authController.protect,
        authController.isCurrentUser,
        userProfilesSettingsController.delete
    );

module.exports = router;
