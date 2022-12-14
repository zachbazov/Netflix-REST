const mongoose = require("mongoose");
const slugify = require("slugify");

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
            displayLogos: [String],
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
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Improving performance

mediaSchema.index({ slug: 1 });
mediaSchema.index({ title: 1 });
mediaSchema.index({ rating: 1 });
mediaSchema.index({ year: 1 });

// Document Middleware

mediaSchema.pre("save", function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, "-"), {
        lower: true,
    });

    this.id = this._id;

    next();
});

// Aggregate Middleware

mediaSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({
        $match: { isSecret: { $ne: true } },
    });

    console.log(this);

    next();
});

// mediaSchema.post("find", async function (docs, next) {
//     docs.forEach((el) => {
//         if (el.type === "series") {
//             el.resources.posters.forEach((poster) => {
//                 if (poster != null) {
//                     const newPoster = poster.replace(
//                         /netflix-swift-api.herokuapp/gi,
//                         "netflix-rest-api.onrender"
//                     );
//                     el.resources.posters = [];
//                     el.resources.posters.push(newPoster);
//                 }
//             });
//             // if (el.resources.previewPoster != null) {
//             //     const previewPoster = el.resources.previewPoster.replace(
//             //         /netflix-swift-api.herokuapp/gi,
//             //         "netflix-rest-api.onrender"
//             //     );
//             //     el.resources.previewPoster = previewPoster;
//             // }
//             // if (el.resources.displayPoster != null) {
//             //     const displayPoster = el.resources.displayPoster.replace(
//             //         /netflix-swift-api.herokuapp/gi,
//             //         "netflix-rest-api.onrender"
//             //     );
//             //     el.resources.displayPoster = displayPoster;
//             // }
//             el.save({ validateBeforeSave: false });
//         }

//         if (el.type === "film") {
//         }
//     });

//     next();
// });

// mediaSchema.post("find", async function (docs, next) {
//     var fs = require("fs");
//     // const TVShow = require('./tv-show-model');
//     // const Movie = require("./movie-model");
//     // const Media = require("./media-model");
//     var posters = fs.readdirSync("./public/img/poster");
//     var logos = fs.readdirSync("./public/img/logo");
//     var displayPosters = fs.readdirSync("./public/img/display-poster");
//     var displayLogos = fs.readdirSync("./public/img/display-logo");
//     var previewPosters = fs.readdirSync("./public/img/preview-poster");

//     // const tvShows = await TVShow.find();
//     // const media = await Media.find();

//     for (let i = 0; i < docs.length; i++) {
//         const el = docs[i];
//         if (el.type === "film") {
//             // const tvShow = tvShows[i];
//             // el.id = tvShow._id;
//             // el.type = 'series';
//             // el.title = tvShow.title;
//             // el.slug = tvShow.slug;
//             // el.createdAt = tvShow.createdAt;
//             // el.rating = tvShow.rating;
//             // el.description = tvShow.description;
//             // el.cast = tvShow.cast;
//             // el.writers = tvShow.writers;
//             // el.duration = tvShow.duration;
//             // // el.length = tvShow.length;
//             // el.genres = tvShow.genres;
//             // el.hasWatched = tvShow.hasWatched;
//             // el.isHD = tvShow.isHD;
//             // el.isExclusive = tvShow.isNetflixExclusive;
//             // el.isNewRelease = tvShow.newRelease;
//             // el.isSecret = tvShow.isSecret;

//             el.resources.posters = [];
//             el.resources.posters = posters.filter((file) =>
//                 file.match(el.slug)
//             );
//             let orderedPosters = el.resources.posters.map(
//                 (el) => `https://netflix-rest-api.onrender.com/img/poster/${el}`
//             );
//             orderedPosters.unshift(orderedPosters.pop());
//             el.resources.posters = orderedPosters;

//             el.resources.logos = [];
//             el.resources.logos = logos.filter((file) => file.match(el.slug));
//             let orderedLogos = el.resources.logos.map(
//                 (el) => `https://netflix-rest-api.onrender.com/img/logo/${el}`
//             );
//             orderedLogos.unshift(orderedLogos.pop());
//             el.resources.logos = orderedLogos;

//             el.resources.trailers = el.trailers;

//             el.resources.displayPoster = "";
//             let displayPoster = displayPosters.filter((file) =>
//                 file.match(el.slug)
//             );
//             el.resources.displayPoster = `https://netflix-rest-api.onrender.com/img/display-poster/${displayPoster}`;
//             el.resources.displayPoster =
//                 el.resources.displayPoster.split(",")[0];
//             console.log(el.resources.displayPoster);
//             // console.log(displayPoster);

//             el.resources.displayLogos = [];
//             el.resources.displayLogos = displayLogos.filter((file) =>
//                 file.match(el.slug)
//             );
//             let orderedDisplayLogos = el.resources.displayLogos.map(
//                 (el) =>
//                     `https://netflix-rest-api.onrender.com/img/display-logo/${el}`
//             );
//             orderedDisplayLogos.unshift(orderedDisplayLogos.pop());
//             el.resources.displayLogos = orderedDisplayLogos;

//             el.resources.previewPoster = "";
//             let previewPoster = previewPosters.filter((file) =>
//                 file.match(el.slug)
//             );
//             el.resources.previewPoster = `https://netflix-rest-api.onrender.com/img/preview-poster/${previewPoster}`;

//             // el.resources.previewUrl = tvShow.previewUrl;
//             // el.resources.presentedPoster = tvShow.presentedCover;
//             // el.resources.presentedLogo = tvShow.presentedLogo;
//             // el.resources.presentedDisplayLogo = tvShow.presentedDisplayLogo;
//             // el.resources.presentedLogoAlignment = tvShow.logoPosition;

//             // el.seasons = tvShow.seasons;
//             // el.numberOfEpisodes = tvShow.episodeCount;

//             el.save({ validateBeforeSave: false });
//         }
//     }

//     // if (el.type === 'film') {
//     //     for (let i = 0; i < movies.length; i++) {
//     //         const movie = movies[i];
//     //         const el = docs[i];
//     //         el.id = movie._id;
//     //         el.type = 'film';
//     //         el.title = movie.title;
//     //         el.slug = movie.slug;
//     //         el.createdAt = movie.createdAt;
//     //         el.rating = movie.rating;
//     //         el.description = movie.description;
//     //         el.cast = movie.cast;
//     //         el.writers = movie.writers;
//     //         el.duration = movie.year;
//     //         el.length = movie.length;
//     //         el.genres = movie.genres;
//     //         el.hasWatched = movie.hasWatched;
//     //         el.isHD = movie.isHD;
//     //         el.isExclusive = movie.isNetflixExclusive;
//     //         el.isNewRelease = movie.newRelease;
//     //         el.isSecret = movie.isSecret;

//     //         el.resources.posters = [];
//     //         el.resources.posters = posters.filter(file => file.match(el.slug));
//     //         let orderedPosters = el.resources.posters.map(el => `https://netflix-swift-api.herokuapp.com/img/poster/${el}`);
//     //         orderedPosters.unshift(orderedPosters.pop());
//     //         el.resources.posters = orderedPosters

//     //         el.resources.logos = [];
//     //         el.resources.logos = logos.filter(file => file.match(el.slug));
//     //         let orderedLogos = el.resources.logos.map(el => `https://netflix-swift-api.herokuapp.com/img/logo/${el}`);
//     //         orderedLogos.unshift(orderedLogos.pop());
//     //         el.resources.logos = orderedLogos

//     //         el.resources.trailers = el.trailers;

//     //         el.resources.displayPoster = '';
//     //         let displayPoster = displayPosters.filter(file => file.match(el.slug));
//     //         el.resources.displayPoster = `https://netflix-swift-api.herokuapp.com/img/display-poster/${displayPoster}`;

//     //         el.resources.displayLogos = [];
//     //         el.resources.displayLogos = displayLogos.filter(file => file.match(el.slug));
//     //         let orderedDisplayLogos = el.resources.displayLogos.map(el => `https://netflix-swift-api.herokuapp.com/img/display-logo/${el}`);
//     //         orderedDisplayLogos.unshift(orderedDisplayLogos.pop());
//     //         el.resources.displayLogos = orderedDisplayLogos

//     //         el.resources.previewPoster = '';
//     //         let previewPoster = previewPosters.filter(file => file.match(el.slug));
//     //         el.resources.previewPoster = `https://netflix-swift-api.herokuapp.com/img/preview-poster/${previewPoster}`;

//     //         el.resources.previewUrl = movie.previewURL;
//     //         el.resources.presentedPoster = movie.presentedCover;
//     //         el.resources.presentedLogo = movie.presentedLogo;
//     //         el.resources.presentedDisplayLogo = movie.presentedDisplayLogo;
//     //         el.resources.presentedLogoAlignment = movie.logoPosition;

//     //         // el.seasons = movie.seasons;
//     //         // el.numberOfEpisodes = movie.episodeCount;

//     //         el.save({ validateBeforeSave: false });
//     //     }
//     // };

//     next();
// });

// const { readFile, writeFile, promises: fsPromises } = require("fs");

// readFile("./dev-data/media.json", "utf-8", function (err, contents) {
//     if (err) {
//         console.log(err);
//         return;
//     }

//     const replaced = contents.replace(
//         /netflix-swift-api.herokuapp/g,
//         "netflix-rest-api.onrender"
//     );

//     writeFile("./example.txt", replaced, "utf-8", function (err) {
//         console.log(err);
//     });
// });

// tvShowSchema.post('find', function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/cover/tvshows');
//     docs.forEach((el) => {
//         el.covers = [];
//         el.covers = files.filter(file => file.match(el.slug));
//         let newLogos = el.covers.map(el => `https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el}`);
//         newLogos.unshift(newLogos.pop());
//         el.covers = newLogos;
//         el.save({ validateBeforeSave: false });
//     });

//     next();
// })

// tvShowSchema.post('find', function (docs, next) {
//     // var fs = require('fs');
//     // var files = fs.readdirSync('./public/img/logo/tvshows');
//     docs.forEach((el) => {
//         // el.logos = files.filter(file => file.match(el.slug));
//         // let newLogos = el.logos.map(el => `https://netflix-swift-api.herokuapp.com/img/logo/tvshows/${el}`);
//         // newLogos.unshift(newLogos.pop());
//         // el.logos = newLogos;

//         // el.presentedCover = "0";
//         // el.presentedDisplayLogo = "0"

//         // el.save({ validateBeforeSave: false });
//     });
//     next();
// })

// tvShowSchema.post('find', function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/cover/tvshows');
//     docs.forEach((el) => {
//         el.covers = files.filter(file => file.match(el.slug));
//         let newCovers = el.covers.map(el => `https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el}`);
//         newCovers.unshift(newCovers.pop());
//         el.covers = newCovers;

//         // el.presentedCover = "0";

//         el.save({ validateBeforeSave: false });
//     });
//     next();
// })

// function containsNumber(str) {
//     return /\d/.test(str);
//   }

//   function digitsBeGone(str){
//     let string = str.match(/\D/g).join('')
//     if (string.charAt(str.length - 1) === '-') {
//         string  = string.substr('', str.length - 1)
//     }
//     return string
//   }

// tvShowSchema.post('find', async function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/logo/tvshows');
//     let element;
//     let arr = [];
//     // console.log(files);

//         if (element.length === 1) {
//             //element[length].split(/^[0-9]+$/)
//             element = element[0].split('.');

//             // console.log(element);

//             if (containsNumber(element)) {
//                 // element = element[0].split(/\d$/);
//                 // countArray.push(0);

//                 // await docs.forEach(async (el) => {
//                 //     if (el.slug === element[0]) {
//                 //         countArray.push(i);

//                 //         for (let j = 0; j < countArray.length; j++) {
//                 //             countArray[j] = j;
//                 //             if (j == 0) {
//                 //                 if (el.logos.includes(`https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el.slug}.png`)) {
//                 //                     continue;
//                 //                 } else {
//                 //                     el.logos[0] = `https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el.slug}.png`;
//                 //                     await el.save({ validateBeforeSave: false });
//                 //                 }
//                 //             } else {
//                 //                 if (el.logos.includes(`https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el.slug}-${j}.png`)) {
//                 //                     continue;
//                 //                 } else {
//                 //                     el.logos.push(`https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el.slug}-${j}.png`)
//                 //                     await el.save({ validateBeforeSave: false });
//                 //                 }
//                 //             }
//                 //         }
//                 //     }
//                 // })
//             } else {
//                 // console.log(element);
//             }
//         }
//     }

//     next();
// })

// tvShowSchema.post(/^find/, function (docs, next) {
//     docs.forEach(async (el) => {
//         // el.id = this._id;
//         // el.detailCover = `https://netflix-swift-api.herokuapp.com/img/detail-cover/tvshows/${el.slug}.jpeg`;
//         // el.logo = `https://netflix-swift-api.herokuapp.com/img/logo/movies/${el.slug}.png`;
//         // el.displayCover = `https://netflix-swift-api.herokuapp.com/img/display-cover/movies/${el.slug}.jpeg`;
//         // el.covers = [
//         //     `https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el.slug}.jpg`
//         // ];
//         el.logos = [el.logos[0]];
//         await el.save({ validateBeforeSave: false });
//     });

//     next();
// });

// movieSchema.post('find', function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/cover/movies');
//     docs.forEach((el) => {
//         // el.displayLogos = [];
//         el.covers = [];
//         // el.displayLogos = files.filter(file => file.match(el.slug));
//         el.covers = files.filter(file => file.match(el.slug));
//         let newLogos = el.covers.map(el => `https://netflix-swift-api.herokuapp.com/img/cover/movies/${el}`);
//         newLogos.unshift(newLogos.pop());
//         el.covers = newLogos;

//         //el.presentedCover = "0"
//         // el.presentedLogo = "0"
//         // el.presentedDisplayLogo = "0"

//         el.save({ validateBeforeSave: false });
//     });

//     next();
// })

// tvShowSchema.post('find', function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/cover/tvshows');
//     docs.forEach((el) => {
//         el.covers = files.filter(file => file.match(el.slug));
//         let newCovers = el.covers.map(el => `https://netflix-swift-api.herokuapp.com/img/cover/tvshows/${el}`);
//         newCovers.unshift(newCovers.pop());
//         el.covers = newCovers;

//         // el.presentedCover = "0";

//         el.save({ validateBeforeSave: false });
//     });
//     next();
// })

// movieSchema.post(/^find/, function (docs, next) {
//     docs.forEach(async (el) => {
//         // el.detailCover = `https://netflix-swift-api.herokuapp.com/img/detail-cover/movies/${el.slug}.jpeg`;
//         // el.logo = `https://netflix-swift-api.herokuapp.com/img/logo/movies/${el.slug}.png`;
//         // el.displayCover = `https://netflix-swift-api.herokuapp.com/img/display-cover/movies/${el.slug}.jpeg`;
//         // el.covers = [
//         //     `https://netflix-swift-api.herokuapp.com/img/cover/movies/${el.slug}.jpeg`
//         // ];
//         el.logos = [el.logos[0]];
//         await el.save({ validateBeforeSave: false });
//     });

//     next();
// });

const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;
