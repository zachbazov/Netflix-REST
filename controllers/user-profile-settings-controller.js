const UserProfileSettings = require("./../models/user-profile-settings-model");
const handlerFactory = require("../utils/handler-factory");

// MARK: - CRUD Operations

exports.get = handlerFactory.get(UserProfileSettings);
exports.create = handlerFactory.create(UserProfileSettings);
exports.update = handlerFactory.update(UserProfileSettings);
exports.delete = handlerFactory.deleteOne(UserProfileSettings);
exports.deleteAll = handlerFactory.deleteAll(UserProfileSettings);
