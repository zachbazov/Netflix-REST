const express = require("express");
const router = express.Router();
const APIRestrictor = require("../utils/api/APIRestrictor");
const userProfilesController = require("../controllers/user-profile-controller");

router
    .route("/")
    .get(userProfilesController.get)
    .post(userProfilesController.create)
    .patch(userProfilesController.update)
    .delete(userProfilesController.delete);

module.exports = router;
