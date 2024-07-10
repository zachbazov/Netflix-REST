// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import Command from "../../modules/Command";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class RequestMainPageCommand extends Command {
    // ------------------------------
    // EXECUTION HANDLER
    // ------------------------------
    execute() {
        localStorage.setItem("page", 1);
        window.location.assign("/?page=1&limit=9");
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default RequestMainPageCommand;
