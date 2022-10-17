const Media = require('../models/media-model');
const catchAsync = require('./../utils/catch-async');
const handlerFactory = require('../utils/handler-factory');

exports.getAllMedia = handlerFactory.getAll(Media);
exports.getMedia = handlerFactory.getOne(Media);
exports.createMedia = handlerFactory.createOne(Media);
exports.updateMedia = handlerFactory.updateOne(Media);
exports.deleteMedia = handlerFactory.deleteOne(Media);

exports.aliasTopRated = (req, res, next) => {
    req.query.limit = '10';
    req.query.sort = '-rating';
    req.query.fields = 'title,duration,seasonCount,rating';

    next();
};

exports.getTvShowsStats = catchAsync(
    async (req, res, next) => {
        const stats = await Media.aggregate([
            {
                $match: { rating: { $gte: 7.5 } }
            },
            {
                $group: {
                    // group by
                    // _id: '$rating',
                    _id: { $toUpper: '$rating' },
                    // _id: null,
                    objectCount: { $sum: 1 },
                    // ratingsCount: { $sum: '$rating' },
                    averageRating: { $avg: '$rating' },
                    minimumRating: { $min: '$rating' },
                    maximumRating: { $max: '$rating' },
                    averageSeasonCount: {
                        $avg: '$seasonCount'
                    }
                }
            },
            {
                // use the variables use at $group stage.
                $sort: {
                    averageRating: 1
                }
            }
            // {
            //     $match: {
            //         // excluding objects.
            //         _id: { $ne: '7.5' }
            //     }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: stats
        });
    }
);

exports.getTrailersCount = catchAsync(
    async (req, res, next) => {
        const year = req.params.year * 1;

        const plan = await Media.aggregate([
            {
                $unwind: '$trailers'
            },
            {
                $group: {
                    _id: '$_id',
                    trailersCount: { $sum: 1 }
                    // tvShows: { $push: '$genres' }
                }
            },
            {
                $addFields: { id: '$_id' }
            },
            {
                $project: {
                    _id: 0
                }
            },
            {
                $sort: { trailersCount: -1 }
            }
            // {
            //     $limit: 3
            // }
            // {
            //     $match: {
            //         createdAt: {
            //             $gte: new Date(`${year}-01-01`),
            //             $lte: new Date(`${year}-12-31`)
            //         }
            //     }
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: plan
        });
    }
);
