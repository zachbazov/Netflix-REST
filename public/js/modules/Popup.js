class Popup {
    constructor(requestExecutor) {
        this.requestExecutor = requestExecutor;

        this.bg = document.getElementById("dimmedBackground");
        this.popup = document.getElementById("popup");
        this.popupMessage = document.getElementById("popupMessage");
        this.resignButton = document.getElementById("popupButton1");
        this.closeButton = document.getElementById("popupButton2");

        if (this.resignButton) {
            this.resignButton.addEventListener(
                "click",
                this.onResignButtonClick.bind(this)
            );
        }

        if (this.closeButton) {
            this.closeButton.addEventListener(
                "click",
                this.onCloseButtonClick.bind(this)
            );
        }

        if (window.location.pathname === "/invalid-token") {
            this.showPopup("Your session has expired. Please sign in again.");
        }
    }

    showPopup(message) {
        this.popupMessage.textContent = message;
        this.popup.classList.remove("hidden");
        this.bg.classList.remove("hidden");
    }

    hidePopup() {
        this.popup.classList.add("hidden");
        this.bg.classList.add("hidden");
    }

    onResignButtonClick(e) {
        e.preventDefault();
        this.hidePopup();
        this.requestExecutor.execute("refreshToken");
    }

    onCloseButtonClick(e) {
        e.preventDefault();
        this.hidePopup();
    }
}

export default Popup;
