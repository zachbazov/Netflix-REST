const express = require("express");
const router = express.Router();

const usersController = require("../controllers/user-controller");
const authController = require("../controllers/auth-controller");

router
    .route("/")
    .get(
        authController.protect,
        authController.restrictTo("admin"),
        usersController.getAllUsers
    )
    .post(
        authController.protect,
        authController.restrictTo("admin"),
        usersController.createUser
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        usersController.deleteAllUsers
    );

router
    .route("/:userId")
    .patch(
        authController.protect,
        authController.restrictTo("admin"),
        usersController.updateUser
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin"),
        usersController.deleteUser
    );

router.post("/signin", authController.signIn);
router.post("/signup", authController.signUp);
router.get("/signout", authController.signOut);

router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);

router.patch(
    "/update-password",
    authController.protect,
    authController.updatePassword
);

router.patch(
    "/update-data",
    authController.protect,
    usersController.updateData
);

router.delete(
    "/delete-data",
    authController.protect,
    usersController.deleteData
);

module.exports = router;
