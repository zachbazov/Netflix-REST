const Section = require("../models/section-model");
const handlerFactory = require("../utils/handler-factory");

// MARK: - CRUD Operations

exports.getAllSections = handlerFactory.get(Section);
exports.createSection = handlerFactory.create(Section);
exports.updateSection = handlerFactory.update(Section);
exports.deleteSection = handlerFactory.deleteOne(Section);
exports.deleteAllSections = handlerFactory.deleteAll(Section);
