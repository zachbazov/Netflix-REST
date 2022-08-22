const Episode = require('../models/episode-model');
const handlerFactory = require('../utils/handler-factory');

exports.getAllEpisodes = handlerFactory.getAll(Episode);

exports.getEpisode = handlerFactory.getOne(Episode);

exports.createEpisode = handlerFactory.createOne(Episode);

exports.updateEpisode = handlerFactory.updateOne(Episode);

exports.deleteEpisode = handlerFactory.deleteOne(Episode);
