// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
import Media from "../../../../models/media-model";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class CreateMediaCommand extends Command {
    // ------------------------------
    // CONSTRUCTOR
    // ------------------------------
    constructor(requestHandler, alert) {
        super();
        this.requestHandler = requestHandler;
        this.alert = alert;
    }
    // ------------------------------
    // EXECUTION HANDLER
    // ------------------------------
    async execute(media) {
        try {
            const res = await this.requestHandler.post("/api/v1/media", media);

            if (res.status === 201) {
                this.alert.showAlert("success", "Created successfully");
                await Media.save(media);
            }
        } catch (err) {
            this.alert.showAlert("error", err.response.data.message);
        }
    }
    // ------------------------------
    // FORM DATA EXTRACTION HANDLER
    // ------------------------------
    extractFormData() {
        // ------------------------------
        // INITIAL VALUE SETTINGS
        // ------------------------------
        var genreCounter = 1;
        var posterCounter = 1;
        var logoCounter = 1;
        var displayLogoCounter = 1;
        var trailerCounter = 1;
        const finalGenres = new Set();
        const finalPosters = new Set();
        const finalLogos = new Set();
        const finalDisplayLogos = new Set();
        const finalTrailers = new Set();
        finalGenres.clear();
        finalPosters.clear();
        finalLogos.clear();
        finalTrailers.clear();
        finalDisplayLogos.clear();
        // ------------------------------
        // MEDIA ATTRIBUTES VALUE HANDLER
        // ------------------------------
        const type = document.getElementById("type").value;
        const title = document.getElementById("title").value;
        const rating = document.getElementById("rating").value;
        const description = document.getElementById("description").value;
        const cast = document.getElementById("cast").value;
        const writers = document.getElementById("writers").value;
        const duration = document.getElementById("duration").value;
        const length = document.getElementById("length").value;
        // ------------------------------
        // MEDIA INPUTS EXTRACTION
        // ------------------------------
        const genres = [];
        for (let i = 1; i <= genreCounter; i++) {
            const genre = document.getElementById(`input--genre-${i}`);
            if (genre.value.trim().length > 0) {
                genres.push(genre.value.trim());
            }
        }

        const posters = [];
        for (let i = 1; i <= posterCounter; i++) {
            const poster = document.getElementById(`input--poster-${i}`);
            if (poster.value.trim().length > 0) {
                posters.push(poster.value.trim());
            }
        }

        const logos = [];
        for (let i = 1; i <= logoCounter; i++) {
            const logo = document.getElementById(`input--logo-${i}`);
            if (logo.value.trim().length > 0) {
                logos.push(logo.value.trim());
            }
        }

        const trailers = [];
        for (let i = 1; i <= trailerCounter; i++) {
            const trailer = document.getElementById(`input--trailer-${i}`);
            if (trailer.value.trim().length > 0) {
                trailers.push(trailer.value.trim());
            }
        }

        const displayLogos = [];
        for (let i = 1; i <= displayLogoCounter; i++) {
            const displayLogo = document.getElementById(
                `input--display-logo-${i}`
            );
            if (displayLogo.value.trim().length > 0) {
                displayLogos.push(displayLogo.value.trim());
            }
        }
        // ------------------------------
        // MEDIA RESOURCES'S ATTRIBUTES VALUE HANDLER
        // ------------------------------
        const displayPoster = document.getElementById("displayPoster").value;
        const previewPoster = document.getElementById("previewPoster").value;
        const previewUrl = document.getElementById("previewUrl").value;
        const presentedPoster =
            document.getElementById("presentedPoster").value;
        const presentedLogo = document.getElementById("presentedLogo").value;
        const presentedDisplayLogo = document.getElementById(
            "presentedDisplayLogo"
        ).value;
        const presentedLogoAlignment = document.getElementById(
            "presentedLogoAlignment"
        ).value;
        const seasons = document.getElementById("seasons").value;
        // ------------------------------
        // MEDIA OBJECT CREATTION
        // ------------------------------
        return {
            type,
            title,
            rating,
            description,
            cast,
            writers,
            duration,
            length,
            genres,
            posters,
            logos,
            trailers,
            displayPoster,
            displayLogos,
            previewPoster,
            previewUrl,
            presentedPoster,
            presentedLogo,
            presentedDisplayLogo,
            presentedLogoAlignment,
            seasons,
        };
    }
}
// ------------------------------------------------------------
// MARK: - ADD INPUT HANDLER
// ------------------------------------------------------------
export const addInput = (type) => {
    switch (type) {
        case "genre":
            addGenreInput(".plus-button--genre", ".input-div");
            break;
        case "poster":
            addPosterInput(".plus-button--poster", ".div--resources-posters");
            break;
        case "logo":
            addLogoInput(".plus-button--logo", ".div--resources-logos");
            break;
        case "display-logo":
            addDisplayLogoInput(
                ".plus-button--display-logo",
                ".div--resources-display-logos"
            );
            break;
        case "trailer":
            addTrailerInput(
                ".plus-button--trailer",
                ".div--resources-trailers"
            );
            break;
    }
};
// ------------------------------------------------------------
// MARK: - REMOVE INPUT HANDLER
// ------------------------------------------------------------
const removeInput = (div, type) => {
    const parent = div.parentElement;
    switch (type) {
        case "genre":
            finalGenres.forEach((el) => {
                if (div.id === el.id) {
                    if (genreCounter < 0) {
                        return;
                    }
                    genreCounter--;
                    finalGenres.delete(el);
                }
            });
            break;
        case "poster":
            finalPosters.forEach((el) => {
                if (div.id === el.id) {
                    if (posterCounter < 0) {
                        return;
                    }
                    posterCounter--;
                    finalPosters.delete(el);
                }
            });
            break;
        case "logo":
            finalLogos.forEach((el) => {
                if (div.id === el.id) {
                    if (logoCounter < 0) {
                        return;
                    }
                    logoCounter--;
                    finalLogos.delete(el);
                }
            });
            break;
        case "display-logo":
            finalDisplayLogos.forEach((el) => {
                if (div.id === el.id) {
                    if (displayLogoCounter < 0) {
                        return;
                    }
                    displayLogoCounter--;
                    finalDisplayLogos.delete(el);
                }
            });
            break;
        case "trailer":
            finalTrailers.forEach((el) => {
                if (div.id === el.id) {
                    if (trailerCounter < 0) {
                        return;
                    }
                    trailerCounter--;
                    finalTrailers.delete(el);
                }
            });
            break;
    }
    parent.removeChild(div);
};
// ------------------------------------------------------------
// MARK: - ADD GENRE INPUT HANDLER
// ------------------------------------------------------------
const addGenreInput = (buttonSelector, divSelector) => {
    document
        .querySelector(buttonSelector)
        .addEventListener("click", function () {
            genreCounter++;
            var div = document.createElement("div");
            div.id = `rem-div--${genreCounter}`;
            div.className = `rem-div--${genreCounter}`;
            var input = document.createElement("input");
            input.id = `input--genre-${genreCounter}`;
            input.type = "text";
            input.className = "form__media-creation";
            input.placeholder = `Genre #${genreCounter}`;
            var minus = document.createElement("button");
            minus.id = `genre--minus-button-${genreCounter}`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                removeInput(div, "genre");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);

            finalGenres.add(div);
        });
};
// ------------------------------------------------------------
// MARK: - ADD POSTER INPUT HANDLER
// ------------------------------------------------------------
const addPosterInput = (buttonSelector, divSelector) => {
    document
        .querySelector(buttonSelector)
        .addEventListener("click", function () {
            posterCounter++;
            var div = document.createElement("div");
            div.id = `rem-div--${posterCounter}`;
            div.className = `rem-div--${posterCounter}`;
            var input = document.createElement("input");
            input.id = `input--poster-${posterCounter}`;
            input.type = "text";
            input.className = "form__media-creation";
            input.placeholder = `Poster #${posterCounter}`;
            var minus = document.createElement("button");
            minus.id = `poster--minus-button`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                removeInput(div, "poster");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);

            finalPosters.add(div);
        });
};
// ------------------------------------------------------------
// MARK: - ADD LOGO HANDLER
// ------------------------------------------------------------
const addLogoInput = (buttonSelector, divSelector) => {
    document
        .querySelector(buttonSelector)
        .addEventListener("click", function () {
            logoCounter++;
            var div = document.createElement("div");
            div.id = `rem-div--${logoCounter}`;
            div.className = `rem-div--${logoCounter}`;
            var input = document.createElement("input");
            input.id = `input--logo-${logoCounter}`;
            input.type = "text";
            input.className = "form__media-creation";
            input.placeholder = `Logo #${logoCounter}`;
            var minus = document.createElement("button");
            minus.id = `logo--minus-button`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                removeInput(div, "logo");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);

            finalLogos.add(div);
        });
};
// ------------------------------------------------------------
// MARK: - ADD DISPLAY LOGO INPUT HANDLER
// ------------------------------------------------------------
const addDisplayLogoInput = (buttonSelector, divSelector) => {
    document
        .querySelector(buttonSelector)
        .addEventListener("click", function () {
            displayLogoCounter++;
            var div = document.createElement("div");
            div.id = `rem-div--${displayLogoCounter}`;
            div.className = `rem-div--${displayLogoCounter}`;
            var input = document.createElement("input");
            input.id = `input--display-logo-${displayLogoCounter}`;
            input.type = "text";
            input.className = "form__media-creation";
            input.placeholder = `Display Logo #${displayLogoCounter}`;
            var minus = document.createElement("button");
            minus.id = `display-logo--minus-button`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                removeInput(div, "display-logo");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);

            finalDisplayLogos.add(div);
        });
};
// ------------------------------------------------------------
// MARK: - ADD TRAILER INPUT HANDLER
// ------------------------------------------------------------
const addTrailerInput = (buttonSelector, divSelector) => {
    document
        .querySelector(buttonSelector)
        .addEventListener("click", function () {
            trailerCounter++;
            var div = document.createElement("div");
            div.id = `rem-div--${trailerCounter}`;
            div.className = `rem-div--${trailerCounter}`;
            var input = document.createElement("input");
            input.id = `input--trailer-${trailerCounter}`;
            input.type = "text";
            input.className = "form__media-creation";
            input.placeholder = `Trailer #${trailerCounter}`;
            var minus = document.createElement("button");
            minus.id = `trailer--minus-button`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function (e) {
                e.preventDefault();
                removeInput(div, "trailer");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);

            finalTrailers.add(div);
        });
};
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default CreateMediaCommand;
