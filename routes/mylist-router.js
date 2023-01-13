const express = require("express");
const router = express.Router();

const authController = require("./../controllers/auth-controller");
const myListController = require("./../controllers/mylist-controller");

router
    .route("/")
    .get(authController.protect, myListController.getAllLists)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        myListController.deleteAllLists
    );

router
    .route("/:listUserId")
    .post(authController.protect, myListController.createList)
    .patch(authController.protect, myListController.updateList)
    .delete(authController.protect, myListController.deleteList);

module.exports = router;
