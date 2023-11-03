const express = require("express");
const router = express.Router({ mergeParams: true });

const episodeController = require("../controllers/episode-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.restrictToToken, episodeController.getAllEpisodes)
    .post(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        episodeController.createEpisode
    )
    .patch(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        episodeController.updateEpisode
    )
    .delete(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        episodeController.deleteEpisode
    );

module.exports = router;
