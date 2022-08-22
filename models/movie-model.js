const mongoose = require('mongoose');
const slugify = require('slugify');

const movieSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        unique: true
    },
    rating: Number,
    description: String,
    cast: String,
    year: Number,
    length: String,
    writers: String,
    isHD: Boolean,
    hasWatched: Boolean,
    newRelease: Boolean,
    previewURL: String,
    logos: [String],
    genres: [String],
    trailers: [String],
    covers: [String],
    slug: String,
    displayCover: String,
    detailCover: String,
    isNetflixExclusive: {
        type: Boolean,
        required: [
            true,
            'An exclusive content value is required.'
        ]
    },
    logoPosition: String,
    presentedCover: String,
    presentedLogo: String,
    presentedDisplayLogo: String
});

// Improving performance

movieSchema.index({ slug: 1 });
movieSchema.index({ title: 1 });
movieSchema.index({ rating: 1 });
movieSchema.index({ year: 1 });

// Document Middleware

movieSchema.pre('save', function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, '-'), {
        lower: true
    });

    this.id = this._id;

    next();
});

// movieSchema.post('find', function (docs, next) {
//     var fs = require('fs');
//     var files = fs.readdirSync('./public/img/logo/movies');
//     docs.forEach((el) => {
//         // el.logos = files.filter(file => file.match(el.slug));
//         // let newLogos = el.logos.map(el => `https://netflix-swift-api.herokuapp.com/img/logo/tvshows/${el}`);
//         // newLogos.unshift(newLogos.pop());
//         // el.logos = newLogos;

//         //el.presentedCover = "0"
//         // el.presentedLogo = "0"
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

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
