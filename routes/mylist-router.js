const express = require("express");
const router = express.Router();

const authController = require("./../controllers/auth-controller");
const myListController = require("./../controllers/mylist-controller");

router
    .route("/")
    .get(
        authController.restrictToToken,
        authController.restrictToSelf,
        myListController.getAllLists
    )
    .post(
        authController.restrictToToken,
        authController.restrictToSelf,
        myListController.createList
    )
    .patch(
        authController.restrictToToken,
        authController.restrictToSelf,
        myListController.updateList
    )
    .delete(
        authController.restrictToToken,
        authController.restrictToSelf,
        myListController.deleteList
    );

module.exports = router;
