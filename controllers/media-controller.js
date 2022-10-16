const Media = require('../models/media-model');
const handlerFactory = require('../utils/handler-factory');

exports.getAllMedia = handlerFactory.getAll(Media);
exports.getMedia = handlerFactory.getOne(Media);
exports.createMedia = handlerFactory.createOne(Media);
exports.updateMedia = handlerFactory.updateOne(Media);
exports.deleteMedia = handlerFactory.deleteOne(Media);

exports.aliasTopRated = (req, res, next) => {
    req.query.limit = '10';
    req.query.sort = '-rating';
    req.query.fields = 'title,duration,seasonCount,rating';

    next();
};
