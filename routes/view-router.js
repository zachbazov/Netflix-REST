// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const router = express.Router();
const JWTService = require("../utils/services/JWTService");
const viewController = require("../controllers/view-controller");
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING
// ------------------------------------------------------------
router.get("/", JWTService.verifyToken, viewController.getOverview);
router.get("/sign-in", viewController.getSignin);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = router;
