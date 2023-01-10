import axios from "axios";
import { showAlert } from "../../utils/alert";

export const updatePreviewImage = function (input, previewImage) {
    input.onchange = function () {
        var file = input.files[0],
            reader = new FileReader();

        reader.onloadend = function () {
            previewImage.src = reader.result;
        };

        reader.readAsDataURL(file);
    };
};

export const executeUpload = async (btn, input) => {
    btn.addEventListener("click", async function (e) {
        e.preventDefault();

        const file = input.files[0],
            reader = new FileReader();

        reader.onloadend = async function () {
            let filename = document.getElementById("input--image-upload").value;
            const path = document.getElementById(
                "image-upload--select-path"
            ).value;
            let name = filename.split("C:\\fakepath\\")[1];
            const type = `.${name.split(".")[1]}`;
            name = name.split(".")[0];
            const output = {
                dataUri: reader.result,
            };

            if (name !== undefined) {
                return await uploadRequest(name, path, type, output);
            }
        };

        reader.readAsDataURL(file);
    });
};

const uploadRequest = async (name, path, type, output) => {
    try {
        const url = "api/v1/images";

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
