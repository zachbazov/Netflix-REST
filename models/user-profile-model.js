// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    active: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    settings: {
        maturityRating: {
            type: String,
            enum: ["none", "pg13", "r5"],
            default: "none",
        },
        displayLanguage: {
            type: String,
            enum: ["en"],
            default: "en",
        },
        audioAndSubtitles: {
            type: String,
            enum: ["en"],
            default: "en",
        },
        autoplayNextEpisode: {
            type: Boolean,
            default: true,
        },
        autoplayPreviews: {
            type: Boolean,
            default: true,
        },
    },
});
// ------------------------------------------------------------
// MARK: - DOCUMENT MWS
// ------------------------------------------------------------
// PUSH A NEWLY CREATED PROFILE FOR THE USER'S ASSOCIATED PROFILE LIST
// ------------------------------
userProfileSchema.pre("save", async function (next) {
    const User = require("./user-model");
    const user = await User.findOne({ _id: this.user._id });
    if (user.profiles.includes(this._id)) return next();
    user.profiles.push(this);
    user.save({ validateBeforeSave: false });
    next();
});
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
// REMOVE A PROFILE FROM THE ARRAY AFTER PROFILE HAS BEEN DELETE
// ------------------------------
userProfileSchema.post("remove", async function (doc) {
    const User = require("./user-model");
    const user = await User.findOne({ _id: doc.user._id });
    if (!user) return;
    user.profiles.pull(doc);
    await user.save({ validateBeforeSave: false });
});
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
module.exports = mongoose.model("UserProfile", userProfileSchema);
