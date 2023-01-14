const express = require("express");
const router = express.Router({ mergeParams: true });

const seasonController = require("../controllers/season-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, seasonController.getAllSeasons)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.createSeason
    )
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

module.exports = router;
