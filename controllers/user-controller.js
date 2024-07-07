const AppError = require("../utils/app/AppError");
const User = require("../models/user-model");
const catchAsync = require("../utils/helpers/catch-async");
const handlerFactory = require("../utils/factory/handler-factory");

// MARK: - CRUD Operations

exports.getAllUsers = handlerFactory.get(User);
exports.createUser = handlerFactory.create(User);
exports.updateUser = handlerFactory.update(User);
exports.deleteUser = handlerFactory.deleteOne(User);
exports.deleteAllUsers = handlerFactory.deleteAll(User);

// MARK: - User Settings Operations

exports.updateData = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        const message = `Use '/update-password' in order to update your password.`;
        const appError = new AppError(message, 400);

        return next(appError);
    }

    function filterObject(object, ...allowedFields) {
        const newObject = {};

        Object.keys(object).forEach((el) => {
            if (allowedFields.includes(el)) {
                newObject[el] = object[el];
            }
        });

        return newObject;
    }

    const filteredBody = filterObject(
        req.body,
        "name",
        "email",
        "selectedProfile"
    );

    const data = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    if (!data) {
        const message = "No documents found.";
        const appError = new AppError(message, 404);

        return next(appError);
    }

    res.status(200).json({
        status: "success",
        data,
    });
});

exports.deleteData = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(204).json({
        status: "success",
        data: null,
    });
});
