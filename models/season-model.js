const mongoose = require("mongoose");

// MARK: - Season Schema

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

// MARK: - Improve Performance

seasonSchema.index({ slug: 1 });
seasonSchema.index({ season: 1 });
seasonSchema.index({ slug: 1, season: 1 });

// MARK: - Season Model

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
