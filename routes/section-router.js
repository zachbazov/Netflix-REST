const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.restrictToToken, sectionController.getAllSections)
    .post(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        sectionController.createSection
    )
    .patch(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        sectionController.updateSection
    )
    .delete(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        sectionController.deleteSection
    );

module.exports = router;
