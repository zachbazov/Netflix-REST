const mongoose = require("mongoose");
const User = require("./user-model");

const imageValues = [
    "av-dark-red",
    "av-dark-purple",
    "av-dark-green",
    "av-dark-blue",
    "av-light-yellow",
    "av-light-green",
    "av-light-blue",
];

const userProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        enum: imageValues,
        default: function () {
            const index = Math.floor(Math.random() * imageValues.length);
            return imageValues[index];
        },
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
        type: mongoose.Schema.ObjectId,
        ref: "UserProfileSettings",
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

// userProfileSchema.post("find", async function (docs) {
//     // const promises = docs.map(async (doc) => {
//     //     let str = removeString(doc.resources.displayPoster);
//     //     doc.resources.displayPoster = str;

//     //     await doc.save();
//     // });
//     // console.log(docs);
//     const promises = docs.map(async (doc, i) => {
//         let maturityRating = "none";
//         let displayLanguage = "en";
//         let audioAndSubtitles = "en";
//         let settings = new UserProfileSettings({
//             maturityRating,
//             displayLanguage,
//             audioAndSubtitles,
//         });
//         doc.settings = settings;

//         const user = await User.findOne({ _id: doc.user._id });
//         user.profiles[i].settings = settings;

//         await doc.save();
//     });

//     await Promise.all(promises);
// });

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
