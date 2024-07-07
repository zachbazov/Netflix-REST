const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const csp = require("express-csp");

const APIRestrictor = require("../api/APIRestrictor");

const cspConfiguration = require("../../config/csp-list");
const hppConfiguration = require("../../config/hpp-list");

class AppSecurity {
    static configure(app) {
        // CORS
        app.use(cors());
        app.options("*", cors());

        // Secure HTTP Headers
        app.use(helmet());

        // Content Security Policy
        csp.extend(app, cspConfiguration);

        // Request Limitation Per IP
        const limiter = rateLimit({
            max: 5000,
            windowMs: 60 * 60 * 1000, // 1 hour
            message: "Reached max requests limit.",
        });
        app.use("/api/", limiter);

        // Data Sanitization against NoSQL query injection
        app.use(mongoSanitize());

        // XSS Protection
        // Cleans any user input from malicious HTML code
        app.use(xss());

        // Prevent Parameter Pollution
        app.use(hpp(hppConfiguration));

        // Compression
        // Compresses the text that sent to the clients
        app.use(compression());

        // Security Header to prevent MIME type sniffing
        app.use((req, res, next) => {
            res.set("X-Content-Type-Options", "nosniff");
            next();
        });

        // User Token Verification
        app.use(APIRestrictor.verifyToken);
    }
}

module.exports = AppSecurity;
