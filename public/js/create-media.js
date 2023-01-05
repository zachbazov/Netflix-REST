import axios from "axios";
import { showAlert } from "./alert";
const Media = require("./../../models/media-model");

export const createNewMedia = async (media) => {
    try {
        console.log(1, media);
        const res = await axios({
            method: "POST",
            url: "api/v1/media",
            data: {
                type: media.type,
                title: media.title,
                rating: media.rating,
                description: media.description,
                cast: media.cast,
                writers: media.writers,
                duration: media.duration,
                length: media.length,
                genres: media.genres,
                hasWatched: media.hasWatched,
                isHD: media.isHD,
                isExclusive: media.isExclusive,
                isNewRelease: media.isNewRelease,
                isSecret: media.isSecret,
                resources: media.resources,
                seasons: media.seasons,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Created successfully");

            Media.save(media);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};
