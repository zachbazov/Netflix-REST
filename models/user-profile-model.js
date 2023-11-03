const mongoose = require("mongoose");
const User = require("./user-model");

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

userProfileSchema.pre("save", async function (next) {
    const user = await User.findOne({ _id: this.user._id });

    if (user.profiles.includes(this._id)) {
        return next();
    }

    user.profiles.push(this);
    user.save({ validateBeforeSave: false });

    next();
});

userProfileSchema.post("remove", async function (doc) {
    const user = await User.findOne({ _id: doc.user._id });

    user.profiles.pull(doc);

    await user.save({ validateBeforeSave: false });
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
