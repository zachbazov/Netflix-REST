const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(imageController.getAllImages)
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        imageController.createImage
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        imageController.updateImage
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        imageController.deleteImage
    );

module.exports = router;
