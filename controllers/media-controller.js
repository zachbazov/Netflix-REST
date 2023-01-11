const Media = require("../models/media-model");
const catchAsync = require("./../utils/catch-async");
const handlerFactory = require("../utils/handler-factory");

// MARK: - CRUD Operations

exports.getAllMedia = handlerFactory.get(Media);
exports.createMedia = handlerFactory.create(Media);
exports.updateMedia = handlerFactory.update(Media);
exports.deleteMedia = handlerFactory.deleteOne(Media);
exports.deleteAllMedia = handlerFactory.deleteAll(Media);

// MARK: - Search

exports.search = catchAsync(async (req, res, next) => {
    const docs = await Media.find({
        slug: {
            $regex: `${req.params.searchText.toLowerCase().replace(" ", "-")}`,
        },
    });

    res.status(200).json({
        status: "success",
        results: docs.length,
        data: docs,
    });
});

// MARK: - Query Middleware

exports.aliasTopRated = (req, res, next) => {
    req.query.limit = "10";
    req.query.sort = "-rating";
    req.query.fields = "title,duration,seasonCount,rating";

    next();
};

// MARK: - Aggregate Pipeline

exports.getTvShowsStats = catchAsync(async (req, res, next) => {
    const stats = await Media.aggregate([
        {
            $match: { rating: { $gte: 7.5 } },
        },
        {
            $group: {
                _id: { $toUpper: "$rating" },
                objectCount: { $sum: 1 },
                averageRating: { $avg: "$rating" },
                minimumRating: { $min: "$rating" },
                maximumRating: { $max: "$rating" },
                averageSeasonCount: {
                    $avg: "$seasonCount",
                },
            },
        },
        {
            $sort: {
                averageRating: 1,
            },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: stats,
    });
});

exports.getTrailersCount = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Media.aggregate([
        {
            $unwind: "$trailers",
        },
        {
            $group: {
                _id: "$_id",
                trailersCount: { $sum: 1 },
            },
        },
        {
            $addFields: { id: "$_id" },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { trailersCount: -1 },
        },
    ]);

    res.status(200).json({
        status: "success",
        data: plan,
    });
});
