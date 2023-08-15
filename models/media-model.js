const mongoose = require("mongoose");
const slugify = require("slugify");

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

//

// mediaSchema.post('find', async function (docs, next) {
//     const promises = docs.map(async (doc) => {
//         let str = removeString(doc.resources.displayPoster);
//         doc.resources.displayPoster = str;
  
//       await doc.save();
//     });
  
//     await Promise.all(promises);
//     next();
//   });
// mediaSchema.post('find', function (docs, next) {
//     docs.forEach(async (doc) => {
//         doc.resources.posters.forEach((poster) => {
//             let str = removeString(poster);
//             doc.resources.posters[poster] = str;
//             console.log(doc.resources.posters[poster]);
//         })

//         await doc.save();
//     });

//     next();
// })

function removeString(input) {
    const stringToRemove = "https://netflix-rest-api.onrender.com";
    const removedString = input.replace(stringToRemove, "");
    return removedString;
  }

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
