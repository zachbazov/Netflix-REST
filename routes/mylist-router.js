const express = require("express");
const router = express.Router();

const authController = require("./../controllers/auth-controller");
const myListController = require("./../controllers/mylist-controller");

router
    .route("/")
    .get(
        authController.protect,
        authController.isSignedIn,
        myListController.getAllLists
    )
    .post(
        authController.protect,
        authController.isSignedIn,
        myListController.createList
    )
    .patch(
        authController.protect,
        authController.isSignedIn,
        myListController.updateList
    )
    .delete(
        authController.protect,
        authController.isSignedIn,
        myListController.deleteList
    );

module.exports = router;
