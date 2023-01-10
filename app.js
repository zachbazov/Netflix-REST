const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const path = require("path");
const csp = require("express-csp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/error-controller");

const usersRouter = require("./routes/user-router");
const sectionRouter = require("./routes/section-router");
const mediaRouter = require("./routes/media-router");
const seasonRouter = require("./routes/season-router");
const episodeRouter = require("./routes/episode-router");
const viewRouter = require("./routes/view-router");
const myListRouter = require("./routes/mylist-router");
const imageRouter = require("./routes/image-router");

const app = express();

// View Engine - PUG
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// app.use('/video', require('./routes/video'));

// Trust Proxies
// Works with `req.headers('x-forwarded-proto')`
// for secure HTTPS Connections
app.enable("trust proxy");

// CORS
app.use(cors());

// options - An HTTP method that we can respond to.
app.options("*", cors());

// Security HTTP Headers
app.use(helmet());

// Content Security Policy
csp.extend(app, {
    policy: {
        directives: {
            "default-src": ["self"],
            "style-src": ["self", "unsafe-inline", "https:"],
            "font-src": ["self", "https://fonts.gstatic.com"],
            "script-src": [
                "self",
                "unsafe-inline",
                "data",
                "blob",
                "https://js.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:8828",
                "ws://localhost:56558/",
                "ws://127.0.0.1:50143/",
            ],
            "worker-src": [
                "self",
                "unsafe-inline",
                "data:",
                "blob:",
                "https://*.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:*",
                "ws://localhost:*/",
                "ws://127.0.0.1:*/",
            ],
            "frame-src": [
                "self",
                "unsafe-inline",
                "data:",
                "blob:",
                "https://*.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:*",
                "ws://localhost:*/",
                "ws://127.0.0.1:*/",
            ],
            "img-src": [
                "self",
                "unsafe-inline",
                "data:",
                "blob:",
                "https://*.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:*",
                "ws://localhost:*/",
                "ws://127.0.0.1:*/",
            ],
            "connect-src": [
                "self",
                "unsafe-inline",
                "data:",
                "blob:",
                //'wss://<HEROKU-SUBDOMAIN>.herokuapp.com:<PORT>/',
                "https://*.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:*",
                "ws://localhost:*/",
                "ws://127.0.0.1:*/",
            ],
        },
    },
});

// Development Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Request limitation per IP
const limiter = rateLimit({
    max: 5000,
    windowMs: 60 * 60 * 1000, // 60m * 60s * 1ms === 1hour
    message: "Reached max requests limit.",
});

app.use("/api/", limiter);

// Body Parser
// reads data into 'req.body'
app.use(express.json({ limit: "100000kb" }));

// Cookie Parser
// req.cookies
app.use(cookieParser());

// Data Sanitization
// against NoSQL query injection
app.use(mongoSanitize());

// against XSS
// cleans any user input from malicious HTML code
app.use(xss());

// Prevent Parameter Pollution
// clears the query string
app.use(
    hpp({
        whitelist: [
            "duration",
            "rating",
            "seasonCount",
            "episodeCount",
            "isHD",
            "hasWatched",
            "newRelease",
            "slug",
        ],
    })
);

// Compression
// Compresses the text that sent to the clients
app.use(compression());

// Route Mounting
app.use("/", viewRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/seasons", seasonRouter);
app.use("/api/v1/episodes", episodeRouter);
app.use("/api/v1/sections", sectionRouter);
app.use("/api/v1/mylists", myListRouter);
app.use("/api/v1/images", imageRouter);

// Error Handling Routes
app.all("*", (req, res, next) => {
    // res.status(404).json({
    //     status: 'failure',
    //     message: `Can't find ${req.originalUrl} on this server.`
    // });

    const message = `Can't find ${req.originalUrl} on this server.`;
    const err = new AppError(message, 404);

    next(err);
});

// Error Handling MW
app.use(globalErrorHandler);

module.exports = app;
