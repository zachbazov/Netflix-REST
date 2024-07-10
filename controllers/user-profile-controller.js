// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const UserProfile = require("./../models/user-profile-model");
const handlerFactory = require("../utils/factory/handler-factory");
// ------------------------------------------------------------
// MARK: - CRUD METHODS
// ------------------------------------------------------------
exports.get = handlerFactory.get(UserProfile);
exports.create = handlerFactory.create(UserProfile);
exports.update = handlerFactory.update(UserProfile);
exports.delete = handlerFactory.deleteOne(UserProfile);
exports.deleteAll = handlerFactory.deleteAll(UserProfile);
