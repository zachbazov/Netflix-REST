// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
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
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = mongoose.model("MyList", myListSchema);
