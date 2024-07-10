// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
const seasonSchema = new mongoose.Schema({
    mediaId: mongoose.Schema.ObjectId,
    slug: String,
    season: Number,
    title: String,
    episodes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Episode",
        },
    ],
});
// ------------------------------------------------------------
// MARK: - PERFORMANCE KEYS
// ------------------------------------------------------------
seasonSchema.index({ slug: 1 });
seasonSchema.index({ season: 1 });
seasonSchema.index({ slug: 1, season: 1 });
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = mongoose.model("Season", seasonSchema);
