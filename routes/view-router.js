const express = require('express');
const router = express.Router();
const path = require('path');

const viewController = require('./../controllers/view-controller');
const authController = require('./../controllers/auth-controller');

router.get(
    '/',
    authController.isSignedIn,
    viewController.getOverview
);

router.get(
    '/tv-shows/:id',
    authController.isSignedIn,
    viewController.getTvShow
);

router.get(
    '/signin',
    authController.isSignedIn,
    viewController.getSignin
);

router.get(
    '/settings',
    authController.protect,
    viewController.getSettings
);

router.get('/stream', function (req, res) {
    res.sendFile(
        path.join(__dirname, '/../views/index.html')
    );
});

router.get('/stream/play', require('./video'));

module.exports = router;
