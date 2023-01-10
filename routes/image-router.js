const express = require("express");
const router = express.Router();

const imageController = require("../controllers/image-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, imageController.getAllImages)
    .post(authController.protect, imageController.createImage);

router
    .route("/:imageName")
    .patch(authController.protect, imageController.updateImage)
    .delete(authController.protect, imageController.deleteImage);

module.exports = router;
