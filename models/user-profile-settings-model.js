const mongoose = require("mongoose");

const maturityRatingValues = ["none", "pg13", "r5"];
const displayLanguageValues = ["en"];
const audioAndSubtitleValues = ["en"];

const userProfileSettingsSchema = new mongoose.Schema({
    maturityRating: {
        type: String,
        enum: maturityRatingValues,
        default: "none",
    },
    displayLanguage: {
        type: String,
        enum: displayLanguageValues,
        default: "en",
    },
    audioAndSubtitles: {
        type: String,
        enum: audioAndSubtitleValues,
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
    profile: {
        type: mongoose.Schema.ObjectId,
        ref: "UserProfile",
    },
});

// userProfileSettingsSchema.pre("save", async function (next) {
//     const user = await User.findOne({ _id: this.user._id });
//     user.profiles.push(this);
//     user.save({ validateBeforeSave: false });

//     next();
// });

// userProfileSettingsSchema.post("remove", async function (doc) {
//     const user = await User.findOne({ _id: doc.user._id });
//     user.profiles.pull(doc);
//     await user.save({ validateBeforeSave: false });
// });

const UserProfileSettings = mongoose.model(
    "UserProfileSettings",
    userProfileSettingsSchema
);

module.exports = UserProfileSettings;
