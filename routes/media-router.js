// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/services/APIRestrictor");
const mediaController = require("../controllers/media-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(mediaController.getAllMedia)
    .post(APIRestrictor.restrictTo("admin"), mediaController.createMedia)
    .patch(APIRestrictor.restrictTo("admin"), mediaController.updateMedia)
    .delete(APIRestrictor.restrictTo("admin"), mediaController.deleteMedia);
// ------------------------------
// TOP RATED MOUNTING
// ------------------------------
router
    .route("/top-rated")
    .get(mediaController.aliasTopRated, mediaController.getAllMedia);
// ------------------------------
// STATS MOUNTING
// ------------------------------
router
    .route("/stats")
    .get(APIRestrictor.restrictTo("admin"), mediaController.getTvShowsStats);
// ------------------------------
// TRAILER COUNT MOUNTING
// ------------------------------
router
    .route("/trailer-count")
    .get(APIRestrictor.restrictTo("admin"), mediaController.getTrailersCount);
// ------------------------------
// SEARCH MOUNTING
// ------------------------------
router.route("/search").get(mediaController.search);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
