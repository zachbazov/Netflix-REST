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
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    mylist: { type: mongoose.Schema.ObjectId, ref: "MyList" },
    profiles: [{ type: mongoose.Schema.ObjectId, ref: "UserProfile" }],
    selectedProfile: {
        type: mongoose.Schema.ObjectId,
        ref: "UserProfile",
    },
});

// MARK: - Document Middleware

// Create an associated list for the user once saved
userSchema.pre("save", async function (next) {
    const list = await MyList.create({
        user: this._id,
        media: [],
    });

    this.mylist = list._id;
    this.selectedProfile = null;

    next();
});

// Remove user's associated list once the user is deleted
userSchema.post("remove", async function (doc) {
    await MyList.findOneAndDelete({ user: doc._id });

    const UserProfile = require("./user-profile-model");
    await UserProfile.deleteMany({ user: doc._id });
});

// `$ne` operator - operating parameter won't be included
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

// MARK: - Instance Method

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

module.exports = User;
