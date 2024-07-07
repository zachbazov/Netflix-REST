const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const AppSecurity = require("./utils/app/AppSecurity");
const AppError = require("./utils/app/AppError");

const APIRestrictor = require("./utils/api/APIRestrictor");

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

// MARK: - Route Mounting + User Token Verification

app.use("/", require("./routes/view-router"));
app.use(
    "/api/v1/media",
    APIRestrictor.verifyToken,
    require("./routes/media-router")
);
app.use(
    "/api/v1/users",
    APIRestrictor.verifyToken,
    require("./routes/user-router")
);
app.use(
    "/api/v1/seasons",
    APIRestrictor.verifyToken,
    require("./routes/season-router")
);
app.use(
    "/api/v1/episodes",
    APIRestrictor.verifyToken,
    require("./routes/episode-router")
);
app.use(
    "/api/v1/sections",
    APIRestrictor.verifyToken,
    require("./routes/section-router")
);
app.use(
    "/api/v1/mylists",
    APIRestrictor.verifyToken,
    require("./routes/mylist-router")
);

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
