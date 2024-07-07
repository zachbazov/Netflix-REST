const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const sectionController = require("../controllers/section-controller");

router
    .route("/")
    .get(sectionController.getAllSections)
    .post(APIRestrictor.restrictTo("admin"), sectionController.createSection)
    .patch(APIRestrictor.restrictTo("admin"), sectionController.updateSection)
    .delete(APIRestrictor.restrictTo("admin"), sectionController.deleteSection);

module.exports = router;
