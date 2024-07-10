// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
const sectionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    slug: String,
    media: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Media",
        },
    ],
});
// ------------------------------------------------------------
// MARK: - PERFORMANCE KEYS
// ------------------------------------------------------------
sectionSchema.index({ id: 1 });
sectionSchema.index({ title: 1 });
// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
module.exports = mongoose.model("Section", sectionSchema);
