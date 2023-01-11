const mongoose = require("mongoose");

// MARK: - MyList Schema

const myListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    media: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Media",
        },
    ],
});

// MARK: - MyList Model

const myList = mongoose.model("MyList", myListSchema);

module.exports = myList;
