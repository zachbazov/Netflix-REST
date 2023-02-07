import axios from "axios";
import { showAlert } from "../../utils/alert";

// MARK: - Request Image

export const requestImage = async (img, name) => {
    try {
        const url = `/api/v1/images?name=${name}`;

        const res = await axios({
            method: "GET",
            url,
            data: {
                name,
            },
        });

        if (res.data.status === "success") {
            const buffer = res.data.data[0].output.dataUri;
            img.src = Buffer.from(buffer);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};

// MARK: - Upload Request

export const uploadRequest = async (name, path, type, output) => {
    try {
        const url = "/api/v1/images";

        const res = await axios({
            method: "POST",
            url,
            data: {
                name,
                path,
                type,
                output,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Image uploaded successfully");
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};
