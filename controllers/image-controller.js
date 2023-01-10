const Image = require("../models/image-model");
const handlerFactory = require("../utils/handler-factory");

exports.getAllImages = handlerFactory.getAll(Image);
exports.getImage = handlerFactory.getOne(Image);
exports.createImage = handlerFactory.createOne(Image);
exports.updateImage = handlerFactory.updateOne(Image);
exports.deleteImage = handlerFactory.deleteOne(Image);
