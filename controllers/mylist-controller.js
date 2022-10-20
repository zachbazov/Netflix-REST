const MyList = require("../models/mylist-model");
const handlerFactory = require("../utils/handler-factory");

exports.getAllLists = handlerFactory.getAll(MyList);
exports.getOneList = handlerFactory.getOne(MyList);
exports.createList = handlerFactory.createOne(MyList);
exports.updateList = handlerFactory.updateOne(MyList);
exports.deleteList = handlerFactory.deleteOne(MyList);
