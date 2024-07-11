// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class JWTService {
    // ------------------------------
    // PARSE COOKIE HANDLER
    // ------------------------------
    static parseCookie = (req, res, next) => {
        const token = req.cookies.refreshToken;
        if (token) req.headers["authorization"] = `Bearer ${token}`;
        next();
    };
    // ------------------------------
    // VERIFY TOKEN HANDLER
    // ------------------------------
    static verifyToken(req, res, next) {
        const token = req.cookies.jwt;

        if (!token) {
            const error = new AppError("Unauthorized", 401);
            return next(error);
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                const error = new AppError("Forbidden", 403);
                return next(error);
            }
            req.user = decoded.name;
            next();
        });
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = JWTService;
