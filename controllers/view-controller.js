const AppError = require('../utils/AppError');
const Media = require('./../models/media-model');
const catchAsync = require('./../utils/catch-async');

const getOverview = catchAsync(async (req, res, next) => {
    const tvShows = await Media.find();

    res.status(200).render('overview', {
        title: 'All TV Shows',
        tvShows
    });
});

const getTvShow = catchAsync(async (req, res, next) => {
    const tvShow = await Media.findOne({
        slug: req.params.id
    });

    if (!tvShow) {
        const message = 'No TV Show found.';
        const appError = new AppError(message, 404);

        return next(appError);
    }

    res.status(200).render('tv-show', {
        title: `${tvShow.title} TV Show`,
        tvShow
    });
});

const getSignin = catchAsync(async (req, res, next) => {
    res.status(200).render('signin', {
        title: 'Signin'
    });
});

const getSettings = catchAsync(async (req, res, next) => {
    res.status(200).render('settings', {
        title: 'Settings'
    });
});

// const getStream = catchAsync(async (req, res, next) => {
//     res.status(200).render('video', {
//         title: 'Stream'
//     });
// });

module.exports = {
    getOverview,
    getTvShow,
    getSignin,
    getSettings
    // getStream
};
