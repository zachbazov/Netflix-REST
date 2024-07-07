const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const AppSecurity = require("./utils/app/AppSecurity");
const AppError = require("./utils/app/AppError");
const globalErrorHandler = require("./controllers/error-controller");

const app = express();

// MARK: - PUG View Engine

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MARK: - Serving Static Files

app.use(express.static(path.join(__dirname, "public")));

// MARK: - Trust Proxies
// Works with `req.headers('x-forwarded-proto')`
// for secure HTTPS Connections
app.enable("trust proxy");

// MARK: - App Security

AppSecurity.configure(app);

// MARK: - Development Logging

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// MARK: - Body Parser
// reads data into 'req.body'
app.use(express.json({ limit: "100000kb" }));

// MARK: - Cookie Parser

app.use(cookieParser());

// MARK: - Route Mounting

app.use("/", require("./routes/view-router"));
app.use("/api/v1/media", require("./routes/media-router"));
app.use("/api/v1/users", require("./routes/user-router"));
app.use("/api/v1/seasons", require("./routes/season-router"));
app.use("/api/v1/episodes", require("./routes/episode-router"));
app.use("/api/v1/sections", require("./routes/section-router"));
app.use("/api/v1/mylists", require("./routes/mylist-router"));

// MARK: - Error Handling Routes

app.all("*", (req, res, next) => {
    const message = `Can't find ${req.originalUrl} on this server.`;
    const err = new AppError(message, 404);

    next(err);
});

// MARK: - Error Handling Middleware

app.use(globalErrorHandler);

// MARK: - Module Export

module.exports = app;
