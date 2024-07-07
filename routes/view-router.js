const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const viewController = require("../controllers/view-controller");

router.get("/", viewController.getOverview);

router.get("/media/:id", viewController.getMedia);

router.get("/sign-in", viewController.getSignin);

router.get("/settings", viewController.getSettings);

router.get(
    "/create-media",
    APIRestrictor.restrictTo("admin"),
    viewController.createMedia
);

module.exports = router;
