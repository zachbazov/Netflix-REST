// ------------------------------------------------------------
// MARK: - CSP ALLOWED LIST
// ------------------------------------------------------------
const list = {
    policy: {
        directives: {
            "default-src": ["'self'"],
            "style-src": ["'self'", "'unsafe-inline'", "https:"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "script-src": [
                "'self'",
                "'unsafe-inline'",
                "data:",
                "blob:",
                "https://js.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:8828",
                "ws://localhost:56558/",
                "ws://127.0.0.1:50143/",
                "https://cdn.jsdelivr.net/npm/cropperjs@1.5.9/dist/cropper.min.js",
            ],
            "worker-src": [
                "'self'",
                "'unsafe-inline'",
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
                "'self'",
                "'unsafe-inline'",
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
                "'self'",
                "'unsafe-inline'",
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
                "'self'",
                "'unsafe-inline'",
                "data:",
                "blob:",
                "https://*.stripe.com",
                "https://*.mapbox.com",
                "https://*.cloudflare.com/",
                "https://bundle.js:*",
                "ws://localhost:*/",
                "ws://127.0.0.1:*/",
                "http://localhost:3001",
            ],
        },
    },
};
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = list;
