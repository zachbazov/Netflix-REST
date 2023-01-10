import "@babel/polyfill";
import { executeRequest } from "./repositories/auth/auth";
import { updateUserSettings, updatePassword } from "./repositories/users/users";
import { createMedia, addInput } from "./repositories/media/media";
import {
    updatePreviewImage,
    executeUpload,
} from "./repositories/images/images";

// MARK: - Authentication
const signInButton = document.getElementById("btn--sign-in");
const signOutRef = document.getElementById("ref--sign-out");
if (signInButton) {
    executeRequest("signIn", signInButton);
} else if (signOutRef) {
    executeRequest("signOut", signOutRef);
}

// MARK: - Update Settings
const updateSettingsButton = document.getElementById("btn--update-settings");
const updatePasswordButton = document.getElementById("btn--update-password");
if (updateSettingsButton) {
    updateUserSettings(updateSettingsButton);
} else if (updatePasswordButton) {
    updatePassword(updatePasswordButton);
}

// MARK: - Create Media
const createMediaButton = document.getElementById("btn--create-media");
if (createMediaButton) {
    createMedia();
    addInput("genre");
    addInput("poster");
    addInput("logo");
    addInput("display-logo");
    addInput("trailer");
}

// MARK: - Image Upload
const imageUploadInput = document.querySelector(".input--image-upload-p");
const imageUploadPreviewImage = document.getElementById("preview-img--upload");
const imageUploadButton = document.querySelector(".btn--image-upload");
if (imageUploadButton) {
    updatePreviewImage(imageUploadInput, imageUploadPreviewImage);
    executeUpload(imageUploadButton, imageUploadInput);
}
