// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const AppError = require("../utils/services/AppError");
const Media = require("./../models/media-model");
const catchAsync = require("../utils/helpers/catch-async");
// ------------------------------------------------------------
// MARK: - MEDIA HANDLER
// ------------------------------------------------------------
// OVERVIEW PAGE
// ------------------------------
const getOverview = catchAsync(async (req, res, next) => {
    const allMedia = await Media.find();
    const { page, limit } = req.query;
    const totalPages = Math.round(allMedia.length / limit + 1);
    const media = await Media.find()
        .skip((page - 1) * limit)
        .limit(limit);
    res.status(200).render("overview", {
        title: "All Media",
        user: req.user,
        media,
        totalPages,
        page,
        limit,
    });
});
// ------------------------------
// MEDIA PAGE (SPECIFIC)
// ------------------------------
const getMedia = catchAsync(async (req, res, next) => {
    const media = await Media.findOne({
        slug: req.params.id,
    });
    if (!media) {
        const message = "No media found.";
        const appError = new AppError(message, 404);
        return next(appError);
    }
    res.status(200).render("media", {
        title: media.title,
        media,
    });
});
// ------------------------------
// CREATE MEDIA PAGE
// ------------------------------
const createMedia = catchAsync(async (req, res, next) => {
    res.status(200).render("create-media", {
        title: "Create a new Media",
    });
});
// ------------------------------------------------------------
// MARK: - AUTH HANDLER
// ------------------------------------------------------------
// SIGN IN PAGE
// ------------------------------
const getSignin = catchAsync(async (req, res, next) => {
    res.status(200).render("sign-in", {
        title: "Sign In",
    });
});
// ------------------------------
// USER SETTINGS PAGE
// ------------------------------
const getSettings = catchAsync(async (req, res, next) => {
    res.status(200).render("settings", {
        title: "Settings",
    });
});
// ------------------------------
// INVALID TOKEN ERROR PAGE
// ------------------------------
const getInvalidToken = catchAsync(async (req, res, next) => {
    res.status(200).render("invalid-token", {
        title: "Authorization",
    });
});
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = {
    getOverview,
    getMedia,
    getSignin,
    getSettings,
    createMedia,
    getInvalidToken,
};
