const express = require("express");
const router = express.Router({ mergeParams: true });

const episodeController = require("../controllers/episode-controller");
const authController = require("../controllers/auth-controller");

router.route("/").get(episodeController.getAllEpisodes);

router
    .route("/:episode")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        episodeController.getEpisode
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

router
    .route("/")
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        episodeController.createEpisode
    );

module.exports = router;
