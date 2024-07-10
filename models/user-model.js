// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const MyList = require("./mylist-model");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
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
// ------------------------------------------------------------
// MARK: - PERFORMANCE KEYS
// ------------------------------------------------------------
userSchema.index({ name: 1 });
// ------------------------------------------------------------
// MARK: - DOCUMENT MWS
// ------------------------------------------------------------
// CREATE AN ASSOCIATED MY LIST OBJECT TO ANY NEW CREATED USER
// ------------------------------
userSchema.pre("save", async function (next) {
    const list = await MyList.create({
        user: this._id,
        media: [],
    });
    this.mylist = list._id;
    this.selectedProfile = null;
    next();
});
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
// DELETE AN ASSOCIATED MY LIST OBJECT TO ANY REMOVED USER
// ------------------------------
userSchema.post("remove", async function (doc) {
    await MyList.findOneAndDelete({ user: doc._id });
    const UserProfile = require("./user-profile-model");
    await UserProfile.deleteMany({ user: doc._id });
});
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
// OPERATING PARAMETER WON'T BE INCLUDED IN THE RESPONSE
// ------------------------------
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
// ------------------------------------------------------------
// MARK: - INSTANCE METHODS
// ------------------------------------------------------------
// VALUE JWT TIMESTAMP FOR PASSWORD CHANGES
// ------------------------------
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
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
// GENERATE PASSWORD RESET TOKEN
// ------------------------------
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpirationPeriod = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
module.exports = mongoose.model("User", userSchema);
