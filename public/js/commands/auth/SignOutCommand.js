// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class SignOutCommand extends Command {
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
    async execute() {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            await this.requestHandler.post(
                "http://localhost:3001/api/v1/auth/signout",
                { refreshToken },
                { withCredentials: true }
            );
            this.alert.showAlert("success", "Signed out successfully");
            localStorage.removeItem("refreshToken");
            window.setTimeout(() => {
                location.assign("/?page=1&limit=9");
            }, 1500);
        } catch (err) {
            this.alert.showAlert(
                "error",
                "Error occurred while signing out",
                err.message
            );
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default SignOutCommand;
