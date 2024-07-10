// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// ------------------------------------------------------------
// MARK: - CONFIG PATH
// ------------------------------------------------------------
dotenv.config({ path: "./config.env" });
// ------------------------------------------------------------
// MARK: - STRICT POILICY (MONGOOSE V7.0)
// ------------------------------------------------------------
mongoose.set("strictQuery", false);
// ------------------------------------------------------------
// MARK: - CONNECTION STRING
// ------------------------------------------------------------
const db = process.env.DB_URL.replace(
    /<DB_USER>|<DB_PASS>|<DB_CLUSTER>|<DB_NAME>/gi,
    (arg) => {
        return {
            "<DB_USER>": process.env.DB_USER,
            "<DB_PASS>": process.env.DB_PASS,
            "<DB_CLUSTER>": process.env.DB_CLUSTER,
            "<DB_NAME>": process.env.DB_NAME,
        }[arg];
    }
);
// ------------------------------------------------------------
// MARK: - CLASS DECLARATION
// ------------------------------------------------------------
class MongoConnection {
    static async connect() {
        try {
            await mongoose.connect(db);
        } catch (e) {
            console.log(e);
        }
        return this;
    }
}
// ------------------------------------------------------------
// MARK: - MODULE EXPORT
// ------------------------------------------------------------
module.exports = MongoConnection;
