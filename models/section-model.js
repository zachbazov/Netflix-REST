const mongoose = require("mongoose");

// MARK: - Section Schema

const sectionSchema = new mongoose.Schema({
    id: Number,
    title: String,
    slug: String,
    media: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Media",
        },
    ],
});

// MARK: - Improve Performance

sectionSchema.index({ id: 1 });
sectionSchema.index({ title: 1 });

// MARK: - Section Model

const Section = mongoose.model("Section", sectionSchema);

module.exports = Section;
