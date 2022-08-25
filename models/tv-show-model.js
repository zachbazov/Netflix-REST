const mongoose = require('mongoose');
const slugify = require('slugify');

const tvShowSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true
        },
        title: {
            type: String,
            unique: true,
            required: [true, 'A title value is required.']
        },
        duration: {
            type: String,
            required: [
                true,
                'A duration period is required.'
            ]
        },
        rating: {
            type: Number,
            required: [true, 'A rating value is required.'],
            default: 0.0
        },
        seasonCount: {
            type: Number,
            required: [
                true,
                'A season count value is required.'
            ]
        },
        episodeCount: {
            type: Number,
            required: [
                true,
                'An episode count value is required.'
            ]
        },
        description: {
            type: String,
            required: [
                true,
                'A description value is required.'
            ]
        },
        cast: {
            type: String,
            required: [true, 'A cast value is required.']
        },
        isHD: {
            type: Boolean,
            required: [true, 'An HD value is required.'],
            default: false
        },
        displayCover: {
            type: String,
            required: [
                true,
                'A display cover value is required.'
            ]
        },
        detailCover: {
            type: String,
            required: [
                true,
                'A detail cover value is required.'
            ]
        },
        displayLogos: {
            type: [String]
        },
        logos: {
            type: [String],
            required: [true, 'A logo value is required.']
        },
        hasWatched: {
            type: Boolean,
            required: [true, 'A watch value is required.'],
            default: false
        },
        newRelease: {
            type: Boolean,
            required: [
                true,
                'A release value is required.'
            ],
            default: false
        },
        genres: {
            type: [String],
            required: [true, 'Genre values are required.']
        },
        trailers: {
            type: [String],
            required: [true, 'Trailer values are required.']
        },
        highResCover: {
            type: String,
            required: [
                true,
                'An high res image value is required.'
            ]
        },
        covers: {
            type: [String],
            required: [
                true,
                'A cover image value is required.'
            ]
        },
        smallCover: {
            type: String,
            required: [
                true,
                'A small cover image value is required.'
            ]
        },
        slug: {
            type: String
            // required: [true, 'A slug value is required.']
        },
        createdAt: {
            type: Date,
            default: Date.now()
            // select: false
        },
        isSecret: {
            type: Boolean,
            default: false
        },
        seasons: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Season'
            }
        ],
        isNetflixExclusive: {
            type: Boolean,
            required: [
                true,
                'An exclusive content value is required.'
            ]
        },
        presentedCover: String,
        presentedLogo: String,
        presentedDisplayLogo: String
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Improving performance

tvShowSchema.index({ slug: 1 });
tvShowSchema.index({ rating: 1 });

// Virtual Properties

tvShowSchema.virtual('durationString').get(function () {
    const arr = this.duration.split('-');
    const paramA = arr[1] * 1;
    const paramB = arr[0] * 1;
    return String(`${paramA - paramB} Seasons`);
});

// Document Middleware

tvShowSchema.pre('save', function (next) {
    this.slug = slugify(this.title.replace(/:|!| /g, '-'), {
        lower: true
    });

    this.id = this._id;

    next();
});

// Aggregate Middleware

tvShowSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isSecret: { $ne: true } }
    });

    next();
});

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

// Model Decleration

const TVShow = mongoose.model('TVShow', tvShowSchema);

module.exports = TVShow;
