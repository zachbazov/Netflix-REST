const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const seasonController = require("../controllers/season-controller");

router
    .route("/")
    .get(seasonController.getAllSeasons)
    .post(APIRestrictor.restrictTo("admin"), seasonController.createSeason)
    .patch(APIRestrictor.restrictTo("admin"), seasonController.updateSeason)
    .delete(APIRestrictor.restrictTo("admin"), seasonController.deleteSeason);

module.exports = router;
