// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class RequestExecutor {
    // ------------------------------
    // CONSTRUCTOR
    // ------------------------------
    constructor() {
        this.commands = {};
    }
    // ------------------------------
    // REGISTERY HANDLER
    // ------------------------------
    register(request, command) {
        this.commands[request] = command;
    }
    // ------------------------------
    // EXECUTION HANDLER
    // ------------------------------
    execute(request, ...args) {
        if (this.commands[request]) {
            this.commands[request].execute(...args);
        } else {
            throw new Error(`Request ${request} not found.`);
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default RequestExecutor;
