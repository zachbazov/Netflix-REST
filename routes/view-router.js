const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view-controller");
const authController = require("../controllers/auth-controller");

router.get("/", authController.isSignedIn, viewController.getOverview);

router.get(
    "/media/:id",
    authController.isSignedIn,
    authController.protect,
    viewController.getMedia
);

router.get("/sign-in", authController.isSignedIn, viewController.getSignin);

router.get(
    "/settings",
    authController.isSignedIn,
    authController.protect,
    viewController.getSettings
);

router.get(
    "/create-media",
    authController.isSignedIn,
    authController.protect,
    authController.restrictTo("admin"),
    viewController.createMedia
);

router.get("/images", authController.isSignedIn, viewController.getImages);

router.get("/image", authController.isSignedIn, viewController.getImage);

router.get(
    "/image-preview",
    authController.isSignedIn,
    viewController.getImagePreview
);

router.get(
    "/upload",
    authController.isSignedIn,
    authController.protect,
    authController.restrictTo("admin"),
    viewController.uploadImage
);

router.get(
    "/crop",
    authController.isSignedIn,
    authController.protect,
    authController.restrictTo("admin"),
    viewController.cropImage
);

module.exports = router;
