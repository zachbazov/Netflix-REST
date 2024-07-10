// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
const slugify = require("slugify");
// ------------------------------------------------------------
// MARK: - SCHEMA DECLARATION
// ------------------------------------------------------------
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
// ------------------------------------------------------------
// MARK: - PERFORMANCE KEYS
// ------------------------------------------------------------
mediaSchema.index({ slug: 1 });
mediaSchema.index({ title: 1 });
mediaSchema.index({ rating: 1 });
// ------------------------------------------------------------
// MARK: - DOCUMENT MWS
// ------------------------------------------------------------
// ADD A SLUG TO THE MEDIA OBJECT AND USE MONGODB SUPPLIED ID VALUE
// ------------------------------
mediaSchema.pre("save", function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, "-"), {
        lower: true,
    });
    this.id = this._id;
    next();
});
// ------------------------------------------------------------
// MARK: - AGGREGATE MWS
// ------------------------------------------------------------
// OPERATING PARAMETER(S) WON'T BE INCLUDED IN THE RESPONSE
// ------------------------------
mediaSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isSecret: { $ne: true } },
    });
    next();
});
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = mongoose.model("Media", mediaSchema);
