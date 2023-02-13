const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view-controller");
const authController = require("../controllers/auth-controller");

router.get(
    "/",
    authController.isSignedIn,
    authController.protect,
    viewController.getOverview
);

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

module.exports = router;
