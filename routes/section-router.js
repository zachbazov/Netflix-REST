const express = require("express");
const router = express.Router();

const sectionController = require("../controllers/section-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        sectionController.getAllSections
    )
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.createManySections
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.deleteAllSections
    );

router
    .route("/:id")
    .get(
        authController.protect,
        authController.restrictTo("user", "admin"),
        sectionController.getSection
    )
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        sectionController.createManySections
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
