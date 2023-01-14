const express = require("express");
const router = express.Router({ mergeParams: true });

const episodeController = require("../controllers/episode-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, episodeController.getAllEpisodes)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        episodeController.createEpisode
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        episodeController.updateEpisode
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        episodeController.deleteEpisode
    );

module.exports = router;
