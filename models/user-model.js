const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const MyList = require("./mylist-model");

// MARK: - User Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A name value is required."],
    },
    email: {
        type: String,
        required: [true, "An email value is required."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "A valid email value is required."],
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "A password value is required."],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "A password confirmation value is required."],
        validate: {
            // validator - function works only on 'save/create' queries.
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords should match.",
        },
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpirationPeriod: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    mylist: [{ type: mongoose.Schema.ObjectId, ref: "MyList" }],
    profiles: [{ type: mongoose.Schema.ObjectId, ref: "UserProfile" }],
    selectedProfile: {
        type: mongoose.Schema.ObjectId,
        ref: "UserProfile",
    },
});

// MARK: - Document Middleware

// Password Encryption
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

// Create an associated list for the user once saved
userSchema.pre("save", async function (next) {
    const list = await MyList.create({
        user: this._id,
        media: [],
    });

    this.mylist = list;
    this.selectedlist = null;

    next();
});

// Remove user's associated list once the user is deleted
userSchema.post("remove", async function (doc) {
    await MyList.findOneAndDelete({ user: doc._id });
});

// Update Password Change Time
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

// `$ne` operator - operating parameter won't be included
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

// MARK: - Instance Method

// Password Compare
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Value JWT Timestamp for Password Changes
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return jwtTimestamp < changedTimestamp;
    }

    return false;
};

// Generate Password Reset Token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpirationPeriod = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

// MARK: - User Model

const User = mongoose.model("User", userSchema);

// MARK: - Improve Performance

userSchema.index({ name: 1 });
userSchema.index({ role: 1 });

module.exports = User;
