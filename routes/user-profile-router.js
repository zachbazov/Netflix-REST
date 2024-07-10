// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const userProfilesController = require("../controllers/user-profile-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router
    .route("/")
    .get(userProfilesController.get)
    .post(userProfilesController.create)
    .patch(userProfilesController.update)
    .delete(userProfilesController.delete);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
