class ImageUploader {
    constructor() {}

    updatePreviewImage(input, previewImage) {
        input.onchange = function () {
            var file = input.files[0],
                reader = new FileReader();

            reader.onloadend = async function () {
                previewImage.src = reader.result;
            };

            reader.readAsDataURL(file);
        };
    }

    // MARK: - Execute Image Upload

    async executeUpload(btn, input, cb) {
        btn.addEventListener("click", async function (e) {
            e.preventDefault();

            const file = input.files[0],
                reader = new FileReader();

            reader.onloadend = async function () {
                let filename = document.getElementById(
                    "input--image-upload"
                ).value;
                const path = document.getElementById(
                    "image-upload--select-path"
                ).value;
                let name = filename.split("C:\\fakepath\\")[1];
                const type = `.${name.split(".")[1]}`;
                name = name.split(".")[0];

                // Since it contains the Data URI, we should remove the prefix and keep only Base64 string
                var b64 = reader.result.replace(/^data:.+;base64,/, "");

                const output = {
                    dataUri: b64,
                };

                if (name !== undefined) {
                    return await cb(name, path, type, output);
                }
            };

            reader.readAsDataURL(file);
        });
    }
}

module.exports = ImageUploader;
