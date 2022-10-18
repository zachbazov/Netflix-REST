const express = require("express");
const router = express.Router({ mergeParams: true });

const seasonController = require("../controllers/season-controller");
const authController = require("../controllers/auth-controller");
const episodeRouter = require("../routes/episode-router");

router
    .route("/")
    .get(seasonController.getSeasons)
    .get(seasonController.getAllSeasons);

router
    .route("/:numberOfSeason")
    .get(seasonController.getSeason)
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.updateSeason
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.deleteSeasonWithEpisodes
    );

router
    .route("/:numberOfSeason/:episodes")
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        seasonController.createSeasonWithEpisodes
    );

router.use("/:numberOfSeason", episodeRouter);

module.exports = router;
