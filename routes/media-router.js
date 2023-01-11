const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/media-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, mediaController.getAllMedia)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.createMedia
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.deleteAllMedia
    );

router
    .route("/:mediaId")
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

router
    .route("/top-rated")
    .get(
        authController.protect,
        mediaController.aliasTopRated,
        mediaController.getAllMedia
    );

router
    .route("/stats")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.getTvShowsStats
    );

router
    .route("/trailer-count")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        mediaController.getTrailersCount
    );

router.route("/search/:searchText").get(mediaController.search);

module.exports = router;
