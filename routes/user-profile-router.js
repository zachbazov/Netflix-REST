const express = require("express");
const router = express.Router();

const userProfilesController = require("../controllers/user-profile-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(
        authController.restrictToToken,
        authController.restrictToSelf,
        userProfilesController.get
    )
    .post(
        authController.restrictToToken,
        authController.restrictToSelf,
        userProfilesController.create
    )
    .patch(
        authController.restrictToToken,
        authController.restrictToSelf,
        userProfilesController.update
    )
    .delete(
        authController.restrictToToken,
        authController.restrictToSelf,
        userProfilesController.delete
    );

module.exports = router;
