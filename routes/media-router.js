const express = require("express");
const router = express.Router();

const mediaController = require("../controllers/media-controller");
const authController = require("../controllers/auth-controller");

const seasonRouter = require("./../routes/season-router");

router.use("/:id/seasons", seasonRouter);

router
    .route("/top-rated")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        mediaController.aliasTopRated,
        mediaController.getAllMedia
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
    .route("/:id")
    .get(
        // authController.protect,
        // authController.restrictTo("user", "admin"),
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

// const express = require('express');
// const router = express.Router();

// const tvShowsController = require('../controllers/tv-show-controller');
// const authController = require('../controllers/auth-controller');

// const seasonRouter = require('./../routes/season-router');

// router.use('/:id/seasons', seasonRouter);

// router
//     .route('/top-rated')
//     .get(
//         authController.protect,
//         authController.restrictTo('user', 'admin'),
//         tvShowsController.aliasTopRated,
//         tvShowsController.getAllTvShows
//     );

// router
//     .route('/stats')
//     .get(
//         authController.protect,
//         authController.restrictTo('user', 'admin'),
//         tvShowsController.getTvShowsStats
//     );

// router
//     .route('/trailer-count')
//     .get(
//         authController.protect,
//         authController.restrictTo('user', 'admin'),
//         tvShowsController.getTrailersCount
//     );

// router
//     .route('/')
//     .get(tvShowsController.getAllTvShows)
//     .post(
//         authController.protect,
//         authController.restrictTo('admin'),
//         tvShowsController.createTvShow
//     );

// router
//     .route('/:id')
//     .get(
//         authController.protect,
//         authController.restrictTo('user', 'admin'),
//         tvShowsController.getTvShow
//     )
//     .patch(
//         authController.protect,
//         authController.restrictTo('admin'),
//         tvShowsController.updateTvShow
//     )
//     .delete(
//         authController.protect,
//         authController.restrictTo('admin'),
//         tvShowsController.deleteTvShow
//     );

// module.exports = router;
