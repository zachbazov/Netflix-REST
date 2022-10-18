const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/media-controller");
const authController = require("../controllers/auth-controller");

const seasonRouter = require("./../routes/season-router");

router.use("/:mediaId/seasons", seasonRouter);

router
    .route("/top-rated")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        mediaController.aliasTopRated,
        mediaController.getAllMedia
    );

router
    .route("/stats")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        mediaController.getTvShowsStats
    );

router
    .route("/trailer-count")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        mediaController.getTrailersCount
    );

router
    .route("/")
    .get(mediaController.getAllMedia)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.createMedia
    );

router
    .route("/:mediaId")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        mediaController.getMedia
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.updateMedia
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.deleteMedia
    );

module.exports = router;
