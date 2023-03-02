const mongoose = require("mongoose");
const slugify = require("slugify");
const path = require("path");

// MARK: - Media Schema

const mediaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
        },
        type: String,
        title: {
            type: String,
            unique: true,
        },
        slug: String,

        createdAt: {
            type: Date,
            default: Date.now(),
        },

        rating: {
            type: Number,
            default: 0.0,
        },
        description: String,
        cast: String,
        writers: String,
        duration: String,
        length: String,
        genres: [String],

        hasWatched: Boolean,
        isHD: Boolean,
        isExclusive: Boolean,
        isNewRelease: {
            type: Boolean,
            default: false,
        },
        isSecret: {
            type: Boolean,
            default: false,
        },

        resources: {
            posters: [String],
            logos: [String],
            trailers: [String],
            displayPoster: String,
            previewPoster: String,
            previewUrl: String,
            presentedPoster: String,
            presentedLogo: String,
            presentedDisplayLogo: String,
            presentedLogoAlignment: String,
        },

        seasons: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Season",
            },
        ],
        numberOfEpisodes: Number,

        timesSearched: Number,
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// MARK: - Improve Performance

mediaSchema.index({ slug: 1 });
mediaSchema.index({ title: 1 });
mediaSchema.index({ rating: 1 });

// MARK: - Document Middleware

mediaSchema.pre("save", function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, "-"), {
        lower: true,
    });

    this.id = this._id;

    next();
});

// MARK: - Aggregate Middleware

mediaSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isSecret: { $ne: true } },
    });

    next();
});

// MARK: - Media Model

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
