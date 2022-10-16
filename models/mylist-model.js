const mongoose = require('mongoose');

const myListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    media: {
        type: mongoose.Schema.ObjectId,
        ref: 'Media'
    }
})

const myList = mongoose.model('mylist', myListSchema);

module.exports = myList;