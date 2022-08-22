const Season = require('../models/season-model');
const handlerFactory = require('../utils/handler-factory');

exports.getAllSeasons = handlerFactory.getAll(Season);

exports.getSeason = handlerFactory.getOne(Season);

exports.getSeasons = handlerFactory.getMany(Season);

exports.updateSeason = handlerFactory.updateOne(Season);

exports.createSeasonWithEpisodes =
    handlerFactory.createOne(Season);

exports.deleteSeasonWithEpisodes =
    handlerFactory.deleteOne(Season);
