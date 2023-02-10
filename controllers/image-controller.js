const Image = require("../models/image-model");
const handlerFactory = require("../utils/handler-factory");
const catchAsync = require("../utils/catch-async");

// MARK: - CRUD Operations

exports.getAllImages = handlerFactory.get(Image);
exports.createImage = handlerFactory.create(Image);
exports.updateImage = handlerFactory.update(Image);
exports.deleteImage = handlerFactory.deleteOne(Image);
exports.deleteAllImages = handlerFactory.deleteAll(Image);

exports.getImageData = catchAsync(async (req, res, next) => {
    const image = await Image.findOne({ name: req.query.name });
    res.status(200).json({
        status: "success",
        results: 1,
        data: [image],
    });
});
