const express = require("express");
const router = express.Router();

const seasonController = require("../controllers/season-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.restrictToToken, seasonController.getAllSeasons)
    .post(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        seasonController.createSeason
    )
    .patch(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        seasonController.updateSeason
    )
    .delete(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        seasonController.deleteSeason
    );

module.exports = router;
