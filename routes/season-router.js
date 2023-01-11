const express = require("express");
const router = express.Router({ mergeParams: true });

const seasonController = require("../controllers/season-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, seasonController.getAllSeasons)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.deleteAllSeasons
    );

router
    .route("/:mediaId/:numberOfSeason")
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.updateSeason
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.deleteSeason
    );

router
    .route("/:mediaId/:numberOfSeason/:episodes")
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.createSeason
    );

module.exports = router;
