const mongoose = require("mongoose");

// MARK: - Episode Schema

const episodeSchema = new mongoose.Schema({
    mediaId: String,
    title: String,
    slug: String,
    season: Number,
    episode: Number,
    url: String,
});

// MARK: - Improve Performance

episodeSchema.index({ episode: 1 });
episodeSchema.index({ season: 1 });
episodeSchema.index({ slug: 1 });

// MARK: - Episode Model

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode;
