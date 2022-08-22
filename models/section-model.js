const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    title: String,
    tvshows: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'TVShow'
        }
    ],
    movies: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Movie'
        }
    ]
});

sectionSchema.index({ id: 1 });
sectionSchema.index({ title: 1 });

sectionSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'tvshows',
        select: '-__v'
    }).populate({
        path: 'movies',
        select: '-__v'
    });

    next();
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
