const Movie = require('./../models/movie-model');
const handlerFactory = require('./../utils/handler-factory');

exports.getAllMovies = handlerFactory.getAll(Movie);

exports.getMovie = handlerFactory.getOne(Movie);

exports.createMovie = handlerFactory.createOne(Movie);

exports.updateMovie = handlerFactory.updateOne(Movie);

exports.deleteMovie = handlerFactory.deleteOne(Movie);
