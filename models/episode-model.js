const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
    mediaId: String,
    title: String,
    slug: String,
    season: Number,
    episode: Number,
    url: String,
});

// Improving performance

episodeSchema.index({ episode: 1 });
episodeSchema.index({ season: 1 });
episodeSchema.index({ slug: 1 });

const Episode = mongoose.model("Episode", episodeSchema);

module.exports = Episode;
