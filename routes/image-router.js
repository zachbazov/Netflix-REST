const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(
        authController.isSignedIn,
        authController.protect,
        imageController.getAllImages
    )
    .post(
        authController.isSignedIn,
        authController.protect,
        authController.restrictTo("admin"),
        imageController.createImage
    )
    .patch(
        authController.isSignedIn,
        authController.protect,
        authController.restrictTo("admin"),
        imageController.updateImage
    )
    .delete(
        authController.isSignedIn,
        authController.protect,
        authController.restrictTo("admin"),
        imageController.deleteImage
    );

module.exports = router;
