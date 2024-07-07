const express = require("express");
const router = express.Router({ mergeParams: true });
const APIRestrictor = require("../utils/api/APIRestrictor");
const episodeController = require("../controllers/episode-controller");

router
    .route("/")
    .get(episodeController.getAllEpisodes)
    .post(APIRestrictor.restrictTo("admin"), episodeController.createEpisode)
    .patch(APIRestrictor.restrictTo("admin"), episodeController.updateEpisode)
    .delete(APIRestrictor.restrictTo("admin"), episodeController.deleteEpisode);

module.exports = router;
