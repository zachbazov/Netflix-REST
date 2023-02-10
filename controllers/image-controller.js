const Image = require("../models/image-model");
const handlerFactory = require("../utils/handler-factory");
const catchAsync = require("../utils/catch-async");

// MARK: - CRUD Operations

exports.getAllImages = handlerFactory.get(Image);
exports.createImage = handlerFactory.create(Image);
exports.updateImage = handlerFactory.update(Image);
exports.deleteImage = handlerFactory.deleteOne(Image);
exports.deleteAllImages = handlerFactory.deleteAll(Image);
