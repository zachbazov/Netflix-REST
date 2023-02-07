class ImageCropper {
    constructor(buttons) {
        this.buttons = buttons;
        this.mapButtons();
    }

    crop(previewImage) {
        this.cropper = new Cropper(previewImage, {
            viewMode: 0,
            dragMode: "crop",
            crop: function (event) {
                const widthInput = document.getElementById(
                    "input--img-crop-width"
                );
                const heightInput = document.getElementById(
                    "input--img-crop-height"
                );
                widthInput.value = event.detail.width;
                heightInput.value = event.detail.height;
            },
        });
    }

    async mapButtons() {
        this.buttons = await this.buttons.map((button) => {
            switch (button.id) {
                case "btn--img-crop-poster":
                    //
                    this.posterButton = button;
                case "btn--img-crop-logo":
                    //
                    this.logoButton = button;
                case "btn--img-crop-display-poster":
                    //
                    this.displayPosterButton = button;
                case "btn--img-crop-display-logo":
                    //
                    this.displayLogoButton = button;
                case "btn--img-crop-preview-poster":
                    //
                    this.previewPosterButton = button;
            }
            return button;
        });
    }

    async targetButtons(cropper) {
        this.buttons = await this.buttons.forEach(async (button) => {
            await button.addEventListener("click", async function () {
                switch (button.id) {
                    case "btn--img-crop-poster":
                        cropper.setAspectRatio(16 / 9);
                        break;
                    case "btn--img-crop-logo":
                        cropper.setAspectRatio(14 / 3);
                        break;
                    case "btn--img-crop-display-poster":
                        cropper.setAspectRatio(12 / 4);
                        break;
                    case "btn--img-crop-display-logo":
                        cropper.setAspectRatio(4 / 3);
                        break;
                    case "btn--img-crop-preview-poster":
                        cropper.setAspectRatio(1);
                        break;
                }
            });
        });
    }

    async updateSize(cropper, data) {
        return cropper.setAspectRatio(data.width / data.height);
    }

    // MARK: - Update Preview Image

    updatePreviewImage(panel, input, previewImage) {
        input.onchange = function () {
            var file = input.files[0],
                reader = new FileReader();

            reader.onloadend = async function () {
                previewImage.src = reader.result;

                await panel.crop(previewImage);
                await panel.targetButtons(panel.cropper);
            };

            reader.readAsDataURL(file);
        };
    }

    // MARK: - Image Cropping

    async cropImage(panel, btn, outputImage) {
        btn.addEventListener("click", async function (e) {
            e.preventDefault();

            let croppedImage = await panel.cropper
                .getCroppedCanvas()
                .toDataURL("image/png");
            outputImage.src = croppedImage;
        });
    }

    // MARK: - Execute Cropped Image Save Request

    async executeSave(croppedImage, input, btn, cb) {
        btn.addEventListener("click", async function (e) {
            e.preventDefault();

            let path = "poster";
            let name = input.files[0].name;
            const type = `.${name.split(".")[1]}`;
            name = name.split(".")[0];
            const output = {
                dataUri: croppedImage.src,
            };

            if (name !== undefined) {
                return await cb(name, path, type, output);
                // return await uploadRequest(name, path, type, output);
            }
        });
    }
}

module.exports = ImageCropper;
