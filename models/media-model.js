const mongoose = require('mongoose');
const slugify = require('slugify');

const mediaSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    type: String,
    title: {
        type: String,
        unique: true
    },
    slug: String,

    createdAt: {
        type: Date,
        default: Date.now()
    },

    rating: {
        type: Number,
        default: 0.0
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
        default: false
    },
    isSecret: {
        type: Boolean,
        default: false
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
        presentedLogoAlignment: String
    },

    seasons: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Season'
    }],
    numberOfEpisodes: Number,
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Improving performance

mediaSchema.index({ slug: 1 });
mediaSchema.index({ title: 1 });
mediaSchema.index({ rating: 1 });
mediaSchema.index({ year: 1 });

// Document Middleware

mediaSchema.pre('save', function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, '-'), {
        lower: true
    });

    this.id = this._id;

    next();
});

// Aggregate Middleware

mediaSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isSecret: { $ne: true } }
    });

    next();
});

// mediaSchema.post('find', async function (docs, next) {
//     var fs = require('fs');
//     // const TVShow = require('./tv-show-model');  
//     const Movie = require('./movie-model');
//     var posters = fs.readdirSync('./public/img/poster');
//     var logos = fs.readdirSync('./public/img/logo');
//     var displayPosters = fs.readdirSync('./public/img/display-poster');
//     var displayLogos = fs.readdirSync('./public/img/display-logo');
//     var previewPosters = fs.readdirSync('./public/img/preview-poster');

//     // const tvShows = await TVShow.find();
//     const movies = await Movie.find();

//     // if (el.type === 'series') {
//     //     for (let i = 0; i < tvShows.length; i++) {
//     //         const tvShow = tvShows[i];
//     //         const el = docs[i];
//     //         el.id = tvShow._id;
//     //         el.type = 'series';
//     //         el.title = tvShow.title;
//     //         el.slug = tvShow.slug;
//     //         el.createdAt = tvShow.createdAt;
//     //         el.rating = tvShow.rating;
//     //         el.description = tvShow.description;
//     //         el.cast = tvShow.cast;
//     //         el.writers = tvShow.writers;
//     //         el.duration = tvShow.duration;
//     //         // el.length = tvShow.length;
//     //         el.genres = tvShow.genres;
//     //         el.hasWatched = tvShow.hasWatched;
//     //         el.isHD = tvShow.isHD;
//     //         el.isExclusive = tvShow.isNetflixExclusive;
//     //         el.isNewRelease = tvShow.newRelease;
//     //         el.isSecret = tvShow.isSecret;

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

//     //         el.resources.previewUrl = tvShow.previewUrl;
//     //         el.resources.presentedPoster = tvShow.presentedCover;
//     //         el.resources.presentedLogo = tvShow.presentedLogo;
//     //         el.resources.presentedDisplayLogo = tvShow.presentedDisplayLogo;
//     //         el.resources.presentedLogoAlignment = tvShow.logoPosition;

//     //         el.seasons = tvShow.seasons;
//     //         el.numberOfEpisodes = tvShow.episodeCount;

//     //         el.save({ validateBeforeSave: false });
//     //     }
//     // };

//     if (el.type === 'film') {
//         for (let i = 0; i < movies.length; i++) {
//             const movie = movies[i];
//             const el = docs[i];
//             el.id = movie._id;
//             el.type = 'film';
//             el.title = movie.title;
//             el.slug = movie.slug;
//             el.createdAt = movie.createdAt;
//             el.rating = movie.rating;
//             el.description = movie.description;
//             el.cast = movie.cast;
//             el.writers = movie.writers;
//             el.duration = movie.year;
//             el.length = movie.length;
//             el.genres = movie.genres;
//             el.hasWatched = movie.hasWatched;
//             el.isHD = movie.isHD;
//             el.isExclusive = movie.isNetflixExclusive;
//             el.isNewRelease = movie.newRelease;
//             el.isSecret = movie.isSecret;

//             el.resources.posters = [];
//             el.resources.posters = posters.filter(file => file.match(el.slug));
//             let orderedPosters = el.resources.posters.map(el => `https://netflix-swift-api.herokuapp.com/img/poster/${el}`);
//             orderedPosters.unshift(orderedPosters.pop());
//             el.resources.posters = orderedPosters

//             el.resources.logos = [];
//             el.resources.logos = logos.filter(file => file.match(el.slug));
//             let orderedLogos = el.resources.logos.map(el => `https://netflix-swift-api.herokuapp.com/img/logo/${el}`);
//             orderedLogos.unshift(orderedLogos.pop());
//             el.resources.logos = orderedLogos

//             el.resources.trailers = el.trailers;

//             el.resources.displayPoster = '';
//             let displayPoster = displayPosters.filter(file => file.match(el.slug));
//             el.resources.displayPoster = `https://netflix-swift-api.herokuapp.com/img/display-poster/${displayPoster}`;

//             el.resources.displayLogos = [];
//             el.resources.displayLogos = displayLogos.filter(file => file.match(el.slug));
//             let orderedDisplayLogos = el.resources.displayLogos.map(el => `https://netflix-swift-api.herokuapp.com/img/display-logo/${el}`);
//             orderedDisplayLogos.unshift(orderedDisplayLogos.pop());
//             el.resources.displayLogos = orderedDisplayLogos

//             el.resources.previewPoster = '';
//             let previewPoster = previewPosters.filter(file => file.match(el.slug));
//             el.resources.previewPoster = `https://netflix-swift-api.herokuapp.com/img/preview-poster/${previewPoster}`;

//             el.resources.previewUrl = movie.previewURL;
//             el.resources.presentedPoster = movie.presentedCover;
//             el.resources.presentedLogo = movie.presentedLogo;
//             el.resources.presentedDisplayLogo = movie.presentedDisplayLogo;
//             el.resources.presentedLogoAlignment = movie.logoPosition;

//             // el.seasons = movie.seasons;
//             // el.numberOfEpisodes = movie.episodeCount;

//             el.save({ validateBeforeSave: false });
//         }
//     };

//     next();
// });

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;