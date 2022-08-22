const express = require('express');
const router = express.Router({ mergeParams: true });

const seasonController = require('../controllers/season-controller');
const authController = require('../controllers/auth-controller');
const episodeRouter = require('../routes/episode-router');

router
    .route('/')
    .get(seasonController.getSeasons)
    .get(seasonController.getAllSeasons);

router
    .route('/:season')
    .get(seasonController.getSeason)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        seasonController.updateSeason
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        seasonController.deleteSeasonWithEpisodes
    );

router
    .route('/:season/:episodes')
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        seasonController.createSeasonWithEpisodes
    );

router.use('/:season', episodeRouter);

module.exports = router;
