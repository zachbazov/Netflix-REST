// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const MyList = require("../models/mylist-model");
const handlerFactory = require("../utils/factory/handler-factory");
// ------------------------------------------------------------
// MARK: - CRUD METHODS
// ------------------------------------------------------------
exports.getAllLists = handlerFactory.get(MyList);
exports.createList = handlerFactory.create(MyList);
exports.updateList = handlerFactory.update(MyList);
exports.deleteList = handlerFactory.deleteOne(MyList);
exports.deleteAllLists = handlerFactory.deleteAll(MyList);
