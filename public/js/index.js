// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import "@babel/polyfill";
import RequestHandler from "./modules/RequestHandler.js";
import AlertService from "./modules/Alert.js";
import RequestExecutor from "./modules/RequestExecutor.js";
import Popup from "./modules/Popup.js";
// ------------------------------------------------------------
// MARK: - COMMAND INJECTION
// ------------------------------------------------------------
import SignInCommand from "./commands/auth/SignInCommand.js";
import SignOutCommand from "./commands/auth/SignOutCommand.js";
import RefreshTokenCommand from "./commands/auth/RefreshTokenCommand.js";
import RequestPageCommand from "./commands/media/RequestPageCommand.js";
import RequestMainPageCommand from "./commands/media/RequestMainPageCommand.js";
import CreateMediaCommand from "./commands/media/CreateMediaCommand.js";
import UpdateSettingsCommand from "./commands/users/UpdateSettingsCommand.js";
// ------------------------------------------------------------
// MARK: - INITIALIZER
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------
    // MODULES INITIALIZATION
    // ------------------------------
    const alert = new AlertService();
    const requestExecutor = new RequestExecutor();
    const requestHandler = new RequestHandler();
    // ------------------------------
    // COMMANDS INITIALIZATION
    // ------------------------------
    const requestMainPageCommand = new RequestMainPageCommand(
        requestHandler,
        alert
    );
    const requestPageCommand = new RequestPageCommand(requestHandler, alert);
    const createMediaCommand = new CreateMediaCommand(requestHandler, alert);
    const signInCommand = new SignInCommand(requestHandler, alert);
    const signOutCommand = new SignOutCommand(requestHandler, alert);
    const refreshTokenCommand = new RefreshTokenCommand(requestHandler, alert);
    const updateSettingsCommand = new UpdateSettingsCommand(
        requestHandler,
        alert
    );
    // ------------------------------
    // AUTH COMMANDS REGISTERY
    // ------------------------------
    requestExecutor.register("signIn", signInCommand);
    requestExecutor.register("signOut", signOutCommand);
    requestExecutor.register("refreshToken", refreshTokenCommand);
    // ------------------------------
    // MEDIA COMMANDS REGISTERY
    // ------------------------------
    requestExecutor.register("requestMainPage", requestMainPageCommand);
    requestExecutor.register("requestPage", requestPageCommand);
    requestExecutor.register("createMedia", createMediaCommand);
    // ------------------------------
    // USER COMMANDS REGISTERY
    // ------------------------------
    requestExecutor.register("updateSettings", updateSettingsCommand);
    // ------------------------------------------------------------
    // MARK: - POPUP INITIALIZATION
    // ------------------------------------------------------------
    const popup = new Popup(requestExecutor);
    // ------------------------------------------------------------
    // MARK: - AUTH EVENT HANDLERS
    // ------------------------------------------------------------
    // SIGN IN BUTTON HANDLER
    // ------------------------------
    const signInButton = document.getElementById("btn--sign-in");
    if (signInButton) {
        signInButton.addEventListener("click", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            requestExecutor.execute("signIn", email, password);
        });
    }
    // ------------------------------
    // SIGN OUT BUTTON HANDLER
    // ------------------------------
    const signOutButton = document.getElementById("ref--sign-out");
    if (signOutButton) {
        signOutButton.addEventListener("click", (e) => {
            e.preventDefault();
            requestExecutor.execute("signOut");
        });
    }
    // ------------------------------
    // REFRESH TOKEN BUTTON HANDLER
    // ------------------------------
    const refreshTokenButton = document.getElementById("ref--refresh-token");
    if (refreshTokenButton) {
        refreshTokenButton.addEventListener("click", (e) => {
            e.preventDefault();
            requestExecutor.execute("refreshToken");
        });
    }
    // ------------------------------------------------------------
    // MARK: - MEDIA EVENT HANDLERS
    // ------------------------------------------------------------
    // CURRENT PAGE PROPERTY
    // ------------------------------
    var currentPage =
        localStorage.getItem("page") * 1 || localStorage.setItem("page", 1);
    // ------------------------------
    // ALL MEDIA BUTTON HANDLER (HEADER)
    // ------------------------------
    const allMediaButton = document.getElementById("ref--all-media");
    if (allMediaButton) {
        allMediaButton.addEventListener("click", (e) => {
            e.preventDefault();
            requestExecutor.execute("requestMainPage");
        });
    }
    // ------------------------------
    // PREVIOUS PAGE BUTTON HANDLER
    // ------------------------------
    const prevPageRef = document.getElementById("btn--page-control-prev");
    if (prevPageRef) {
        prevPageRef.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage--;
            if (currentPage <= 0) {
                currentPage = 1;
            }
            localStorage.setItem("page", currentPage);
            requestExecutor.execute("requestPage", currentPage, 9);
        });
    }
    // ------------------------------
    // NEXT PAGE BUTTON HANDLER
    // ------------------------------
    const nextPageRef = document.getElementById("btn--page-control-next");
    if (nextPageRef) {
        nextPageRef.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage++;
            localStorage.setItem("page", currentPage);
            requestExecutor.execute("requestPage", currentPage, 9);
        });
    }
    // ------------------------------
    // CREATE MEDIA BUTTON HANDLER (ADMIN ROLE REQUIRED)
    // ------------------------------
    const createMediaButton = document.getElementById("btn--create-media");
    if (createMediaButton) {
        createMediaButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const media = createMediaCommand.extractFormData();
            requestExecutor.execute("createMedia", media);
            createMediaCommand.addInput("genre");
            createMediaCommand.addInput("poster");
            createMediaCommand.addInput("logo");
            createMediaCommand.addInput("display-logo");
            createMediaCommand.addInput("trailer");
        });
    }
    // ------------------------------------------------------------
    // MARK: - USER EVENT HANDLERS
    // ------------------------------------------------------------
    // UPDATE USER SETTINGS BUTTON HANDLER
    // ------------------------------
    const updateSettingsButton = document.getElementById(
        "btn--update-settings"
    );
    if (updateSettingsButton) {
        updateSettingsButton.addEventListener("click", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            requestExecutor.execute("updateSettings", "data", { name, email });
        });
    }
    // ------------------------------
    // UPDATE USER PASSWORD BUTTON HANDLER
    // ------------------------------
    const updatePasswordButton = document.getElementById(
        "btn--update-password"
    );
    if (updatePasswordButton) {
        updatePasswordButton.addEventListener("click", async (e) => {
            e.preventDefault();
            document.querySelector(".btn--save-password").textContent =
                "Updating...";
            const passwordCurrent =
                document.getElementById("password-current").value;
            const password = document.getElementById("password").value;
            const passwordConfirm =
                document.getElementById("password-confirm").value;
            requestExecutor.execute("updateSettings", "password", {
                passwordCurrent,
                password,
                passwordConfirm,
            });
            document.querySelector(".btn--save-password").textContent =
                "Save password";
            document.getElementById("password-current").value = "";
            document.getElementById("password").value = "";
            document.getElementById("password-confirm").value = "";
        });
    }
});
