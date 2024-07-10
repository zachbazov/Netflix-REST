// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class UpdateSettingsCommand extends Command {
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
    async execute(type, data) {
        try {
            const url =
                type === "data"
                    ? "api/v1/users/update-data"
                    : "/api/v1/users/update-password";
            const res = await this.requestHandler.patch(url, data);

            if (res.status === 200) {
                this.alert.showAlert(
                    "success",
                    `${type.toUpperCase()} updated successfully.`
                );
                window.setTimeout(() => location.assign("/settings"), 1500);
            }
        } catch (e) {
            this.alert.showAlert("error", e.response.data.message);
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default UpdateSettingsCommand;
