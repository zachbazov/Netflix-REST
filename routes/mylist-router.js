const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const myListController = require("./../controllers/mylist-controller");

router
    .route("/")
    .get(myListController.getAllLists)
    .post(myListController.createList)
    .patch(myListController.updateList)
    .delete(myListController.deleteList);

module.exports = router;
