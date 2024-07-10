// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/services/APIRestrictor");
const seasonController = require("../controllers/season-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(seasonController.getAllSeasons)
    .post(APIRestrictor.restrictTo("admin"), seasonController.createSeason)
    .patch(APIRestrictor.restrictTo("admin"), seasonController.updateSeason)
    .delete(APIRestrictor.restrictTo("admin"), seasonController.deleteSeason);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
