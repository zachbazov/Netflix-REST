const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    title: String,
    slug: String,
    media: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Media",
        },
    ],
});

sectionSchema.index({ id: 1 });
sectionSchema.index({ title: 1 });

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
