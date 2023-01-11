const mongoose = require("mongoose");

// MARK: - Image Schema

const imageSchema = new mongoose.Schema({
    name: String,
    path: String,
    type: String,
    output: {
        dataUri: {
            type: Buffer,
            unique: true,
        },
    },
});

// MARK: - Improve Performance

imageSchema.index({ name: 1 });
imageSchema.index({ path: 1 });
imageSchema.index({ type: 1 });
imageSchema.index({ dataUri: 1 });

// MARK: - Image Model

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
