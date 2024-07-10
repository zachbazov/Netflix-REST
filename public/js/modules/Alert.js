// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class Alert {
    // ------------------------------
    // CONSTRUCTOR
    // ------------------------------
    constructor(timeout = 5000) {
        this.timeout = timeout;
    }
    // ------------------------------
    // HIDE ALERT HANDLER
    // ------------------------------
    hideAlert() {
        const el = document.querySelector(".alert");
        if (el) el.parentElement.removeChild(el);
    }
    // ------------------------------
    // SHOW ALERT HANDLER
    // ------------------------------
    showAlert(type, message) {
        this.hideAlert();
        const markup = `<div class="alert alert--${type}">${message}</div>`;
        document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
        window.setTimeout(() => this.hideAlert(), this.timeout);
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default Alert;
