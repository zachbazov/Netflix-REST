// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const jwt = require("jsonwebtoken");
const AppError = require("./AppError");
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class APIRestrictor {
    static restrictTo(...roles) {
        return (req, res, next) => {
            const token = req.cookies.jwt;
            const decoded = jwt.decode(token);
            if (!roles.includes(decoded.role)) {
                const message =
                    "Permissions are required in order to gain access.";
                const error = new AppError(message, 403);
                return next(error);
            }
            next();
        };
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = APIRestrictor;
