import "@babel/polyfill";
import { signin, signout } from "./signin";
import { updateSettings } from "./update-settings";
import { createNewMedia } from "./create-media";

// MARK: - DOM Elements
const signinForm = document.querySelector(".form");
const signOutButton = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const createMediaForm = document.querySelector(".form-media-creation");

// MARK: - Sign In / Sign Out
if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signin(email, password);
    });
}

if (signOutButton) {
    signOutButton.addEventListener("click", signout);
}

// MARK: - Update Settings
if (userDataForm) {
    userDataForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        updateSettings("data", { name, email });
    });
}

// MARK: - Update Password
if (userPasswordForm) {
    userPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        document.querySelector(".btn--save-password").textContent =
            "Updating...";

        const passwordCurrent =
            document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm =
            document.getElementById("password-confirm").value;

        await updateSettings("password", {
            passwordCurrent,
            password,
            passwordConfirm,
        });

        document.querySelector(".btn--save-password").textContent =
            "Save password";

        passwordCurrent.value = "";
        password.value = "";
        passwordConfirm.value = "";
    });
}

// MARK: - Create New Media
if (createMediaForm) {
    createMediaForm.addEventListener("submit", async (e) => {
        finalGenres.clear();
        finalPosters.clear();
        finalLogos.clear();
        finalTrailers.clear();
        finalDisplayLogos.clear();
        e.preventDefault();

        const type = document.getElementById("type").value;
        const title = document.getElementById("title").value;
        const rating = document.getElementById("rating").value;
        const description = document.getElementById("description").value;
        const cast = document.getElementById("cast").value;
        const writers = document.getElementById("writers").value;
        const duration = document.getElementById("duration").value;
        const length = document.getElementById("length").value;
        for (let i = 1; i <= genreCounter; i++) {
            const genre = document.getElementById(`input--genre-${i}`);
            if (genre.value.trim().length > 0) {
                finalGenres.add(genre.value.trim());
            }
        }
        const genres = Array.from(finalGenres);
        const hasWatched = document.getElementById("hasWatched").checked;
        const isHD = document.getElementById("isHD").checked;
        const isExclusive = document.getElementById("isExclusive").checked;
        const isNewRelease = document.getElementById("isNewRelease").checked;
        const isSecret = document.getElementById("isSecret").checked;
        for (let i = 1; i <= posterCounter; i++) {
            const poster = document.getElementById(`input--poster-${i}`);
            if (poster.value.trim().length > 0) {
                finalPosters.add(poster.value.trim());
            }
        }
        const posters = Array.from(finalPosters);
        for (let i = 1; i <= logoCounter; i++) {
            const logo = document.getElementById(`input--logo-${i}`);
            if (logo.value.trim().length > 0) {
                finalLogos.add(logo.value.trim());
            }
        }
        const logos = Array.from(finalLogos);
        for (let i = 1; i <= trailerCounter; i++) {
            const trailer = document.getElementById(`input--trailer-${i}`);
            if (trailer.value.trim().length > 0) {
                finalTrailers.add(trailer.value.trim());
            }
        }
        const trailers = Array.from(finalTrailers);
        const displayPoster = document.getElementById("displayPoster").value;
        for (let i = 1; i <= displayLogoCounter; i++) {
            const displayLogo = document.getElementById(
                `input--display-logo-${i}`
            );
            if (displayLogo.value.trim().length > 0) {
                finalDisplayLogos.add(displayLogo.value.trim());
            }
        }
        const displayLogos = Array.from(finalDisplayLogos);
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

        const media = Object.assign({
            type,
            title,
            rating,
            description,
            cast,
            writers,
            duration,
            length,
            genres,
            hasWatched,
            isHD,
            isExclusive,
            isNewRelease,
            isSecret,
            resources: {
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
            },
            seasons,
        });

        await createNewMedia(media);
    });
}

// MARK: - Create Media Properties
var genreCounter = 1;
var posterCounter = 1;
var logoCounter = 1;
var trailerCounter = 1;
var displayLogoCounter = 1;
var finalGenres = new Set();
var finalPosters = new Set();
var finalLogos = new Set();
var finalTrailers = new Set();
var finalDisplayLogos = new Set();

addGenreInput(".plus-button--genre", ".input-div");
addPosterInput(".plus-button--poster", ".div--resources-posters");
addLogoInput(".plus-button--logo", ".div--resources-logos");
addTrailerInput(".plus-button--trailer", ".div--resources-trailers");
addDisplayLogoInput(
    ".plus-button--display-logo",
    ".div--resources-display-logos"
);

// MARK: - Create Media Functions
function addGenreInput(buttonSelector, divSelector) {
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
            minus.id = `genre--minus-button`;
            minus.type = "button";
            minus.textContent = "-";
            minus.addEventListener("click", function () {
                removeInput(div, "genre");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);
        });
}

function addPosterInput(buttonSelector, divSelector) {
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
            minus.addEventListener("click", function () {
                removeInput(div, "poster");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);
        });
}

function addLogoInput(buttonSelector, divSelector) {
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
            minus.addEventListener("click", function () {
                removeInput(div, "logo");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);
        });
}

function addTrailerInput(buttonSelector, divSelector) {
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
            minus.addEventListener("click", function () {
                removeInput(div, "trailer");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);
        });
}

function addDisplayLogoInput(buttonSelector, divSelector) {
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
            minus.addEventListener("click", function () {
                removeInput(div, "display-logo");
            });
            div.appendChild(input);
            div.appendChild(minus);
            div.appendChild(document.createElement("br"));
            document.querySelector(divSelector).appendChild(div);
        });
}

function removeInput(div, type) {
    const parent = div.parentElement;
    switch (type) {
        case "genre":
            genreCounter--;
            var input = document.getElementById(`input--genre-${genreCounter}`);
            finalGenres.delete(input.value);
            if (genreCounter <= 0) {
                genreCounter = 1;
            }
            break;
        case "poster":
            posterCounter--;
            var input = document.getElementById(
                `input--poster-${posterCounter}`
            );
            finalPosters.delete(input.value);
            if (posterCounter <= 0) {
                posterCounter = 1;
            }
            break;
        case "logo":
            logoCounter--;
            var input = document.getElementById(`input--logo-${logoCounter}`);
            finalLogos.delete(input.value);
            if (logoCounter <= 0) {
                logoCounter = 1;
            }
            break;
        case "trailer":
            trailerCounter--;
            var input = document.getElementById(
                `input--trailer-${trailerCounter}`
            );
            finalTrailers.delete(input.value);
            if (trailerCounter <= 0) {
                trailerCounter = 1;
            }
            break;
        case "display-logo":
            displayLogoCounter--;
            var input = document.getElementById(
                `input--display-logo-${displayLogoCounter}`
            );
            finalDisplayLogos.delete(input.value);
            if (displayLogoCounter <= 0) {
                displayLogoCounter = 1;
            }
            break;
    }
    parent.removeChild(div);
}
