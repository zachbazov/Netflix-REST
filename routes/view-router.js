const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view-controller");
const authController = require("../controllers/auth-controller");

router.get("/", authController.restrictToToken, viewController.getOverview);

router.get(
    "/media/:id",
    authController.restrictToToken,
    viewController.getMedia
);

router.get("/sign-in", viewController.getSignin);

router.get(
    "/settings",
    authController.restrictToToken,
    viewController.getSettings
);

router.get(
    "/create-media",
    authController.restrictToToken,
    authController.restrictTo("admin"),
    viewController.createMedia
);

module.exports = router;
