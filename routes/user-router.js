const express = require("express");
const router = express.Router();

const usersController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");

const userProfilesRouter = require("../routes/user-profile-router");

router
    .route("/")
    .get(
        authController.restrictToToken,
        authController.restrictTo("admin"),
        usersController.getAllUsers
    )
    .patch(
        authController.restrictToToken,
        authController.restrictToSelf,
        usersController.updateUser
    )
    .delete(
        authController.restrictToToken,
        authController.restrictToSelf,
        usersController.deleteUser
    );

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);
router.get("/signout", authController.signOut);

router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password", authController.resetPassword);

router.patch(
    "/update-password",
    authController.restrictToToken,
    authController.updatePassword
);

router.patch(
    "/update-data",
    authController.restrictToToken,
    usersController.updateData
);

router.delete(
    "/delete-data",
    authController.restrictToToken,
    usersController.deleteData
);

router.use("/profiles", userProfilesRouter);

module.exports = router;
