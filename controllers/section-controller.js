const Section = require("../models/section-model");
const handlerFactory = require("../utils/handler-factory");

exports.getAllSections = handlerFactory.getAll(Section);
exports.getSection = handlerFactory.getOne(Section);
exports.createManySections = handlerFactory.createMany(Section);
exports.updateSection = handlerFactory.updateOne(Section);
exports.deleteSection = handlerFactory.deleteOne(Section);
exports.deleteAllSections = handlerFactory.deleteAll(Section);
