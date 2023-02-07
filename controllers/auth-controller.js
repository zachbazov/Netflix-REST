const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("./../models/user-model");
const catchAsync = require("../utils/catch-async");
const AppError = require("./../utils/AppError");
const dispatch = require("./../utils/mailer");

// MARK: - Restrict Feature Access for Roles

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const message =
                "Permissions are required in order to perform this action.";
            const appError = new AppError(message, 403);

            return next(appError);
        }

        next();
    };
};

// MARK: - Feature Protection Layer
// Request from the user to sign-in to gain access
const protect = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        const message = "You are not signed in. Please sign-in to get access.";
        const appError = new AppError(message, 401);

        return next(appError);
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const decodedUser = await User.findById(decoded.id);

    if (!decodedUser) {
        const message = "No match for a user matching this token.";
        const appError = new AppError(message, 401);

        return next(appError);
    }

    if (decodedUser.changedPasswordAfter(decoded.iat)) {
        const message =
            "User credentials has been changed. Please sign-in again in order to gain access.";
        const appError = new AppError(message, 401);

        return next(appError);
    }

    // Grant access
    req.user = decodedUser;

    res.locals.user = decodedUser;

    next();
});

// MARK: - Feature Protection Layer
// Validate if the user is signed in
const isSignedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            const decodedUser = await User.findById(decoded.id);

            if (!decodedUser) {
                return next();
            }

            if (decodedUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // Creates a variable inside a template
            res.locals.user = decodedUser;

            return next();
        } catch (err) {
            return next();
        }
    }

    next();
};

// MARK: - Sign a JWT Token
// Initiate a JWT token signing request
const signToken = (id) => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRATION_PERIOD,
        }
    );
};

// MARK: - Dispatch a Signed JWT Token
// Register the token as a cookie
const dispatchSignToken = async (user, statusCode, req, res) => {
    const token = signToken(user._id);

    res.cookie("jwt", token, {
        expires: new Date(
            Date.now() +
                process.env.JWT_COOKIE_EXPIRATION_PERIOD * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        // secure: req.secure || req.headers("x-forwarded-proto") === "https",
    });

    user.password = undefined;

    const data = user;

    res.status(statusCode).json({
        status: "success",
        token,
        data,
    });
};

// MARK: - Authentication Features
// Sign up a User
const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    dispatchSignToken(newUser, 201, req, res);
});

// Sign in a User
const signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const message =
            "A valid email and password is required in order to sign-in.";
        const appError = new AppError(message, 400);

        return next(appError);
    }

    const user = await User.findOne({
        email: email,
    }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
        const message = "Incorrect email or password";
        const appError = new AppError(message, 401); // 401: Unauthorized/

        return next(appError);
    }

    dispatchSignToken(user, 200, req, res);
});

// Sign out a User
const signOut = (req, res) => {
    res.cookie("jwt", "signedOut", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    res.status(200).json({
        status: "success",
    });
};

// Dispatch an Email for a forgotten password
const forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        const message = "No match.";
        const appError = new AppError(message, 404);

        return next(appError);
    }

    const resetToken = user.generatePasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/users/reset-password?token=${resetToken}`;

    const message = `Forgot your password?\nin order to reset your password please visit:\n${resetURL}\nIf you didn't forget your password, ignore this message.`;

    try {
        await dispatch({
            email: user.email,
            subject: "Your password reset token. will be valid for 10min.",
            message,
        });

        res.status(200).json({
            status: "success",
            message: "Password reset token has been to the provided email.",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpirationPeriod = undefined;

        await user.save({ validateBeforeSave: false });

        const message = "There was an error dispatching the email.";
        const appError = new AppError(message, 500);

        return next(appError);
    }
});

// Request a new User password and reset it's token
const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.query.token)
        .digest("hex");

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpirationPeriod: { $gt: Date.now() },
    });

    if (!user) {
        const message = "Token is invalid or has expired.";
        const appError = new AppError(message, 400);

        return next(appError);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpirationPeriod = undefined;

    await user.save();

    dispatchSignToken(user, 200, req, res);
});

// Update User Password
const updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        const message = "Current password incorrect";
        const appError = new AppError(message, 401);

        return next(appError);
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    await user.save();

    dispatchSignToken(user, 200, req, res);
});

module.exports = {
    isSignedIn,
    forgotPassword,
    resetPassword,
    restrictTo,
    protect,
    signUp,
    signIn,
    signOut,
    updatePassword,
};
