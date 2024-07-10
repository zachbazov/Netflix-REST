// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const AppSecurity = require("./app/AppSecurity");
const AppError = require("./utils/services/AppError");
const JWTService = require("./utils/services/JWTService");
const globalErrorHandler = require("./controllers/error-controller");
// ------------------------------------------------------------
// MARK: - EXPRESS APPLICATION
// ------------------------------------------------------------
const app = express();
// ------------------------------------------------------------
// MARK: - PUG VIEW ENGINE
// ------------------------------------------------------------
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
// ------------------------------------------------------------
// MARK: - STATIC FILES
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));
// ------------------------------------------------------------
// MARK: - TRUST PROXY
// ------------------------------------------------------------
// WORKS WITH `req.headers('x-forwarded-proto')` HEADER
// FOR SECURE CONNECTIONS
// ------------------------------
app.enable("trust proxy");
// ------------------------------------------------------------
// MARK: - APP SECURITY
// ------------------------------------------------------------
AppSecurity.configure(app);
// ------------------------------------------------------------
// MARK: - MORGAN DEVELOPMENT LOGGER
// ------------------------------------------------------------
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// ------------------------------------------------------------
// MARK: - BODY PARSER
// ------------------------------------------------------------
app.use(express.json({ limit: "100000kb" }));
// ------------------------------------------------------------
// MARK: - COOKIE PARSER
// ------------------------------------------------------------
app.use(cookieParser());
// ------------------------------------------------------------
// MARK: - RATE LIMIT
// ------------------------------------------------------------
const limiter = rateLimit({
    max: 5000,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Reached max requests limit.",
});
app.use("/api/", limiter);
// ------------------------------------------------------------
// MARK: - ROUTE MOUNTING + COOKIE & TOKEN VERIFICATION
// ------------------------------------------------------------
app.use(JWTService.parseCookie);
app.use("/", require("./routes/view-router"));
app.use(JWTService.verifyToken);
app.use("/api/v1/media", require("./routes/media-router"));
app.use("/api/v1/users", require("./routes/user-router"));
app.use("/api/v1/seasons", require("./routes/season-router"));
app.use("/api/v1/episodes", require("./routes/episode-router"));
app.use("/api/v1/sections", require("./routes/section-router"));
app.use("/api/v1/mylists", require("./routes/mylist-router"));
// ------------------------------------------------------------
// MARK: - UNEXPECTED ROUTE HANDLER
// ------------------------------------------------------------
app.all("*", (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server.`;
    const err = new AppError(message, 404);
    next(err);
});
// ------------------------------------------------------------
// MARK: - OVERALL APPLICATION ERROR HANDLER
// ------------------------------------------------------------
app.use(globalErrorHandler);
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = app;
