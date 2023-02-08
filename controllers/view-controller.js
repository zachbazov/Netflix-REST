const AppError = require("../utils/AppError");
const Media = require("./../models/media-model");
const Image = require("../models/image-model");
const catchAsync = require("./../utils/catch-async");

// MARK: - Media

const getOverview = catchAsync(async (req, res, next) => {
    const allMedia = await Media.find();
    const { page, limit } = req.query;
    const totalPages = Math.round(allMedia.length / limit + 1);

    const media = await Media.find()
        .skip((page - 1) * limit)
        .limit(limit);

    res.status(200).render("overview", {
        title: "All Media",
        media,
        totalPages,
        page,
        limit,
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

const createMedia = catchAsync(async (req, res, next) => {
    res.status(200).render("create-media", {
        title: "Create a new Media",
    });
});

// MARK: - Auth & User

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

// MARK: - Images

const getImages = catchAsync(async (req, res, next) => {
    const images = await Image.find();

    res.status(200).render("image", {
        title: "Images",
        images,
    });
});

const path = require("path");
const getImage = catchAsync(async (req, res, next) => {
    const image = await Image.findOne({ name: req.query.name });
    // res.myImage = image;
    // res.status(200).sendFile(image);
    // var b64 = image.output.dataUri.replace(/^data:.+;base64,/, "");
    // next();

    // const imageData = image.output.dataUri.split(",")[1];
    // const buffer = Buffer.from(imageData, "base64");

    // res.writeHead(200, {
    //     "Content-Type": "image/jpeg",
    //     "Content-Length": buffer.length,
    // });
    // res.end(buffer);

    res.setHeader("Content-Type", "image/jpeg");
    const x = path.join(
        __dirname,
        "../public/img/poster/",
        `${image.name}${image.type}`
    );
    console.log(x);
    res.sendFile(x);
});

const getImagePreview = catchAsync(async (req, res, next) => {
    const image = await Image.findOne({ name: req.query.name });

    res.status(200).render("image-preview", {
        title: `${image.name}`,
        image,
    });
});

const uploadImage = catchAsync(async (req, res, next) => {
    res.status(200).render("image-upload", {
        title: "Image Upload",
    });
});

const cropImage = catchAsync(async (req, res, next) => {
    res.status(200).render("image-crop", {
        title: "Image Cropping",
    });
});

module.exports = {
    getOverview,
    getMedia,
    getSignin,
    getSettings,
    createMedia,
    getImages,
    getImage,
    uploadImage,
    cropImage,
    getImagePreview,
};
