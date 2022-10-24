const express = require("express");
const router = express.Router();

const authController = require("./../controllers/auth-controller");
const myListController = require("./../controllers/mylist-controller");

router
    .route("/")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        myListController.getAllLists
    );

router
    .route("/:listUserId")
    .get(
        authController.protect,
        authController.restrictTo("admin", "user"),
        myListController.getOneList
    )
    .post(
        authController.protect,
        authController.restrictTo("admin", "user"),
        myListController.createList
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin", "user"),
        myListController.updateList
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "user"),
        myListController.deleteList
    );

module.exports = router;
