const AppError = require("../utils/AppError");
const Media = require("./../models/media-model");
const Image = require("../models/image-model");
const catchAsync = require("./../utils/catch-async");

const getOverview = catchAsync(async (req, res, next) => {
    const media = await Media.find();

    res.status(200).render("overview", {
        title: "All Media",
        media,
    });
});

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

const getSignin = catchAsync(async (req, res, next) => {
    res.status(200).render("sign-in", {
        title: "Sign In",
    });
});

const getSettings = catchAsync(async (req, res, next) => {
    res.status(200).render("settings", {
        title: "Settings",
    });
});

const createMedia = catchAsync(async (req, res, next) => {
    res.status(200).render("create-media", {
        title: "Create a new Media",
    });
});

const getImages = catchAsync(async (req, res, next) => {
    const images = await Image.find();
    res.status(200).render("image", {
        title: "Images",
        images,
    });
});

const uploadImage = catchAsync(async (req, res, next) => {
    res.status(200).render("image-upload", {
        title: "Image Upload",
    });
});

module.exports = {
    getOverview,
    getMedia,
    getSignin,
    getSettings,
    createMedia,
    getImages,
    uploadImage,
};
