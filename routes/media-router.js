const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const mediaController = require("../controllers/media-controller");

router
    .route("/")
    .get(mediaController.getAllMedia)
    .post(APIRestrictor.restrictTo("admin"), mediaController.createMedia)
    .patch(APIRestrictor.restrictTo("admin"), mediaController.updateMedia)
    .delete(APIRestrictor.restrictTo("admin"), mediaController.deleteMedia);

router
    .route("/top-rated")
    .get(mediaController.aliasTopRated, mediaController.getAllMedia);

router
    .route("/stats")
    .get(APIRestrictor.restrictTo("admin"), mediaController.getTvShowsStats);

router
    .route("/trailer-count")
    .get(APIRestrictor.restrictTo("admin"), mediaController.getTrailersCount);

router.route("/search").get(mediaController.search);

module.exports = router;
