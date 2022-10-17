const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema({
    tvShow: mongoose.Schema.ObjectId,
    slug: String,
    season: Number,
    title: String,
    media: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Episode",
        },
    ],
});

// Improving performance

seasonSchema.index({ slug: 1 });
seasonSchema.index({ season: 1 });
seasonSchema.index({ slug: 1, season: 1 });

const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
