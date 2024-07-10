// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router({ mergeParams: true });
const APIRestrictor = require("../utils/services/APIRestrictor");
const episodeController = require("../controllers/episode-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(episodeController.getAllEpisodes)
    .post(APIRestrictor.restrictTo("admin"), episodeController.createEpisode)
    .patch(APIRestrictor.restrictTo("admin"), episodeController.updateEpisode)
    .delete(APIRestrictor.restrictTo("admin"), episodeController.deleteEpisode);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
