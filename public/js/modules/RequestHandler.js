// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
import axios from "axios";
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class RequestHandler {
    // ------------------------------
    // GET REQUEST HANDLER
    // ------------------------------
    async get(url, params) {
        try {
            return await axios.get(url, { params });
        } catch (error) {
            throw error;
        }
    }
    // ------------------------------
    // POST REQUEST HANDLER
    // ------------------------------
    async post(url, data, options) {
        try {
            return await axios.post(url, data, options);
        } catch (error) {
            throw error;
        }
    }
    // ------------------------------
    // PATCH REQUEST HANDLER
    // ------------------------------
    async patch(url, data) {
        try {
            return await axios.patch(url, data);
        } catch (error) {
            throw error;
        }
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
export default RequestHandler;
