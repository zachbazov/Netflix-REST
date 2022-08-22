const mongoose = require('mongoose');

const TVShow = require('./../models/tv-show-model');

const episodeSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true
    },
    url: String,
    season: Number,
    episode: Number,
    tvShow: String,
    slug: String
});

// Improving performance

episodeSchema.index({ episode: 1 });
episodeSchema.index({ season: 1 });
episodeSchema.index({ slug: 1 });

// episodeSchema.post(/^find/, async function (docs, next) {
//     docs.forEach(async (el) => {
//         if (el) {
//             // console.log(el.tvShow);
//             const tvShow = await TVShow.findById(el.tvShow);
//             // console.log(tvShow.slug);
//             el.slug = tvShow.slug;
//             // const ep = el.title.split(' ')[1];
//             // el.episode = ep * 1;
//             await el.save();
//             console.log(el.slug, 'saved');
//         }
//     });

//     next();
// });

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode;
