// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const Media = require("../models/media-model");
const catchAsync = require("../utils/helpers/catch-async");
const handlerFactory = require("../utils/factory/handler-factory");
// ------------------------------------------------------------
// MARK: - CRUD METHODS
// ------------------------------------------------------------
exports.getAllMedia = handlerFactory.get(Media);
exports.createMedia = handlerFactory.create(Media);
exports.updateMedia = handlerFactory.update(Media);
exports.deleteMedia = handlerFactory.deleteOne(Media);
exports.deleteAllMedia = handlerFactory.deleteAll(Media);
// ------------------------------------------------------------
// MARK: - MEDIA SEARCH HANDLER
// ------------------------------------------------------------
exports.search = catchAsync(async (req, res, next) => {
    const docs = await Media.find(
        req.query.slug !== undefined
            ? {
                  slug: {
                      $regex: `${req.query.slug
                          .toLowerCase()
                          .replace(" ", "-")}`,
                  },
              }
            : req.query.title !== undefined
            ? {
                  title: {
                      $regex: `${req.query.title}`,
                  },
              }
            : {
                  type: {
                      $regex: `${req.query.type.toLowerCase()}`,
                  },
              }
    );
    res.status(200).json({
        status: "success",
        results: docs.length,
        data: docs,
    });
});
// ------------------------------------------------------------
// MARK: - QUERY MWS
// ------------------------------------------------------------
// TOP RATED MEDIA
// ------------------------------
exports.aliasTopRated = (req, res, next) => {
    req.query.limit = "10";
    req.query.sort = "-rating";
    req.query.fields = "title,duration,seasonCount,rating";
    next();
};
// ------------------------------------------------------------
// MARK: - AGGREGATE MWS
// ------------------------------------------------------------
// A MEDIA STATS DESCRIPTION
// ------------------------------
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
// ------------------------------------------------------------
// MARK: - MEDIA TRAILER COUNT (TOTAL)
// ------------------------------------------------------------
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
