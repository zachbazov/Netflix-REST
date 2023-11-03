const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/media-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.restrictToToken, mediaController.getAllMedia)
    .post(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        mediaController.createMedia
    )
    .patch(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        mediaController.updateMedia
    )
    .delete(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        mediaController.deleteMedia
    );

router
    .route("/top-rated")
    .get(
        authController.restrictToToken,
        mediaController.aliasTopRated,
        mediaController.getAllMedia
    );

router
    .route("/stats")
    .get(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        mediaController.getTvShowsStats
    );

router
    .route("/trailer-count")
    .get(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        mediaController.getTrailersCount
    );

router.route("/search").get(mediaController.search);

module.exports = router;
