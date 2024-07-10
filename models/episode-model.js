// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
const episodeSchema = new mongoose.Schema({
    mediaId: String,
    title: String,
    slug: String,
    season: Number,
    episode: Number,
    url: String,
});
// ------------------------------------------------------------
// MARK: - PERFORMANCE KEYS
// ------------------------------------------------------------
episodeSchema.index({ episode: 1 });
episodeSchema.index({ season: 1 });
episodeSchema.index({ slug: 1 });
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = mongoose.model("Episode", episodeSchema);
