// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class RequestPageCommand extends Command {
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
    async execute(page, limit) {
        try {
            const params = { page, limit };
            const res = await this.requestHandler.get("/api/v1/media", params);

            if (res.status === 200) {
                window.location.assign(`/?page=${page}&limit=${limit}`);
            }
        } catch (err) {
            this.alert.showAlert("error", err.response.data.message);
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default RequestPageCommand;
