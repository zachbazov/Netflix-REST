const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view-controller");
const authController = require("../controllers/auth-controller");

router.get("/", authController.isSignedIn, viewController.getOverview);

router.get("/media/:id", authController.protect, viewController.getMedia);

router.get("/sign-in", authController.isSignedIn, viewController.getSignin);

router.get("/settings", authController.protect, viewController.getSettings);

router.get(
    "/create-media",
    authController.protect,
    authController.restrictTo("admin"),
    viewController.createMedia
);

router.get(
    "/images",
    authController.protect,
    authController.restrictTo("admin"),
    viewController.getImages
);

router.get(
    "/upload",
    authController.protect,
    authController.restrictTo("admin"),
    viewController.uploadImage
);

module.exports = router;
