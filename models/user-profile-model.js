const mongoose = require("mongoose");

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
    active: Boolean,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;
