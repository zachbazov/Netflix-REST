const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(authController.protect, sectionController.getAllSections)
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.deleteAllSections
    );

router
    .route("/:id")
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.createSection
    )
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.updateSection
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.deleteSection
    );

module.exports = router;
