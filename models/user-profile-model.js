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
        unique: true,
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
});

userProfileSchema.pre("save", async function (next) {
    const user = await User.findOne({ _id: this.user._id });
    user.profiles.push(this);
    user.save({ validateBeforeSave: false });

    next();
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
