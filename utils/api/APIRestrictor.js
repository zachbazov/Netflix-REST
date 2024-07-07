const jwt = require("jsonwebtoken");
const AppError = require("../app/AppError");

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

    static verifyToken(req, res, next) {
        const authHeader = req.headers["authorization"];

        if (!authHeader) return res.sendStatus(401);

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);

            req.verifiedEmail = decoded.email;
            req.verifiedRole = decoded.role;

            next();
        });
    }
}

module.exports = APIRestrictor;