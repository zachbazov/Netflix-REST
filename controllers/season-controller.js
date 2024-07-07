const Season = require("../models/season-model");
const handlerFactory = require("../utils/factory/handler-factory");

// MARK: - CRUD Operations

exports.getAllSeasons = handlerFactory.get(Season);
exports.updateSeason = handlerFactory.update(Season);
exports.createSeason = handlerFactory.create(Season);
exports.deleteSeason = handlerFactory.deleteOne(Season);
exports.deleteAllSeasons = handlerFactory.deleteAll(Season);
