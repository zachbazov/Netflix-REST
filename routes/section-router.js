// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/services/APIRestrictor");
const sectionController = require("../controllers/section-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(sectionController.getAllSections)
    .post(APIRestrictor.restrictTo("admin"), sectionController.createSection)
    .patch(APIRestrictor.restrictTo("admin"), sectionController.updateSection)
    .delete(APIRestrictor.restrictTo("admin"), sectionController.deleteSection);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
