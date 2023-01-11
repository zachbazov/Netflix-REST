const Episode = require("../models/episode-model");
const handlerFactory = require("../utils/handler-factory");

// MARK: - CRUD Operations

exports.getAllEpisodes = handlerFactory.get(Episode);
exports.createEpisode = handlerFactory.create(Episode);
exports.updateEpisode = handlerFactory.update(Episode);
exports.deleteEpisode = handlerFactory.deleteOne(Episode);
exports.deleteAllEpisodes = handlerFactory.deleteAll(Episode);
