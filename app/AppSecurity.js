// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const cors = require("cors");
const csp = require("express-csp");
const cspOptions = require("../config/csp-list");
const hppOptions = require("../config/hpp-list");
const corsOptions = require("../config/cors-options");
const credentials = require("../middleware/credentials");
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class AppSecurity {
    static configure(app) {
        // ------------------------------
        // CREDENTIALS
        // ------------------------------
        // ALLOWING CREDENTIALS HEADER
        // ------------------------------
        app.use(credentials);
        // ------------------------------
        // CROSS-ORIGIN RESOURCE SHARING
        // ------------------------------
        app.use(cors(corsOptions));
        // ------------------------------
        // HELMET
        // ------------------------------
        // SECURE HTTP HEADERS
        // ------------------------------
        app.use(helmet());
        // ------------------------------
        // CONTENT SECURITY POLICY
        // ------------------------------
        csp.extend(app, cspOptions);
        // ------------------------------
        // DATA SANITIZATION
        // ------------------------------
        // AGAINST NOSQL QUERY INJECTION
        // ------------------------------
        app.use(mongoSanitize());
        // ------------------------------
        // XSS PROTECTION
        // ------------------------------
        // CLEANS USER INPUT FROM MALICIOUS HTML CODE
        // ------------------------------
        app.use(xss());
        // ------------------------------
        // HPP
        // ------------------------------
        // PARAMETER POLUTION PREVENTION
        // ------------------------------
        app.use(hpp(hppOptions));
        // ------------------------------
        // COMPRESSION
        // ------------------------------
        // COMPRESSING TEXT SENT TO THE CLIENT
        // ------------------------------
        app.use(compression());
        // ------------------------------
        // SECURITY HEADER
        // ------------------------------
        // MIME TYPE SNIFFING PREVENTION
        // ------------------------------
        app.use((req, res, next) => {
            res.set("X-Content-Type-Options", "nosniff");
            next();
        });
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = AppSecurity;
