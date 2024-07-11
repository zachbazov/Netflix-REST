// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class RefreshTokenCommand extends Command {
    constructor(requestHandler, alert) {
        // ------------------------------
        // CONSTRUCTOR
        // ------------------------------
        super();
        this.requestHandler = requestHandler;
        this.alert = alert;
    }
    // ------------------------------
    // EXECUTION HANDLER
    // ------------------------------
    async execute() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const response = await this.requestHandler.post(
                "http://localhost:3001/api/v1/auth/refresh",
                { refreshToken },
                { withCredentials: true }
            );

            if (response.status === 200) {
                this.alert.showAlert(
                    "success",
                    "Token has refreshed successfully"
                );
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );
                window.setTimeout(() => {
                    location.assign("/?page=1&limit=9");
                }, 1500);
            }
        } catch (err) {
            if (
                err.response.data === "Forbidden" ||
                err.response.data === "Unauthorized"
            ) {
                return window.setTimeout(() => {
                    location.assign("/sign-in");
                }, 1500);
            }
            this.alert.showAlert(
                "error",
                "Error occurred while refreshing token",
                err.message
            );
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default RefreshTokenCommand;
