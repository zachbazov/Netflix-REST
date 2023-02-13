import "@babel/polyfill";
import { executeRequest } from "./repositories/auth/auth";
import { updateUserSettings, updatePassword } from "./repositories/users/users";
import { createMedia, addInput, requestPage } from "./repositories/media/media";

// MARK: - Header View

const allMediaRef = document.getElementById("ref--all-media");
if (allMediaRef) {
    allMediaRef.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("page", 1);
        window.location.assign("/?page=1&limit=9");
    });
}

// MARK: - Overview Page
// Pagination
const prevPageRef = document.getElementById("btn--page-control-prev");
const nextPageRef = document.getElementById("btn--page-control-next");

var currentPage =
    localStorage.getItem("page") * 1 || localStorage.setItem("page", 1);

if (prevPageRef) {
    prevPageRef.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage--;
        if (currentPage <= 0) {
            currentPage = 1;
        }
        localStorage.setItem("page", currentPage);
        requestPage(currentPage, 9);
    });
}
if (nextPageRef) {
    nextPageRef.addEventListener("click", (e) => {
        e.preventDefault();
        currentPage++;
        localStorage.setItem("page", currentPage);
        requestPage(currentPage, 9);
    });
}

// MARK: - Authentication Form

const signInButton = document.getElementById("btn--sign-in");
const signOutRef = document.getElementById("ref--sign-out");
if (signInButton) {
    executeRequest("signIn", signInButton);
} else if (signOutRef) {
    executeRequest("signOut", signOutRef);
}

// MARK: - Update Settings Form

const updateSettingsButton = document.getElementById("btn--update-settings");
const updatePasswordButton = document.getElementById("btn--update-password");
if (updateSettingsButton) {
    updateUserSettings(updateSettingsButton);
} else if (updatePasswordButton) {
    updatePassword(updatePasswordButton);
}

// MARK: - Create Media Form

const createMediaButton = document.getElementById("btn--create-media");
if (createMediaButton) {
    createMedia();
    addInput("genre");
    addInput("poster");
    addInput("logo");
    addInput("display-logo");
    addInput("trailer");
}
