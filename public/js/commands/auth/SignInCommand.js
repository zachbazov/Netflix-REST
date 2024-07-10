// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class SignInCommand extends Command {
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
    async execute(email, password) {
        try {
            const response = await this.requestHandler.post(
                "http://localhost:3001/api/v1/auth/signin",
                { email, password },
                { withCredentials: true }
            );
            if (response.status === 200) {
                this.alert.showAlert("success", "Signed in successfully.");
                localStorage.setItem(
                    "refreshToken",
                    response.data.refreshToken
                );

                window.setTimeout(() => {
                    location.assign("/?page=1&limit=9");
                }, 1500);
            }
        } catch (e) {
            this.alert.showAlert("error", err.response.data.message);
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default SignInCommand;
