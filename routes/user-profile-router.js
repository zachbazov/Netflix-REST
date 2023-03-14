const express = require("express");
const router = express.Router({ mergeParams: true });

const userProfilesController = require("../controllers/user-profile-controller");
const authController = require("../controllers/auth-controller");

router.use(authController.protect, authController.restrictTo("admin", "user"));

router
    .route("/")
    .get(userProfilesController.get)
    .post(userProfilesController.create)
    .patch(userProfilesController.update)
    .delete(userProfilesController.delete);

module.exports = router;
