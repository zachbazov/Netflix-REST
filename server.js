// ------------------------------------------------------------
// MARK: - MODULE INJECTION
// ------------------------------------------------------------
const mongoose = require("mongoose");
const MongoConnection = require("./utils/db/MongoConnection");
const app = require("./app");
// ------------------------------------------------------------
// MARK: - PORT
// ------------------------------------------------------------
const port = process.env.PORT || 8000;
// ------------------------------------------------------------
// MARK: - DATABASE CONNECTION
// ------------------------------------------------------------
MongoConnection.connect();
mongoose.connection.once("open", () => {
    app.listen(port, () => console.log(`DATABASE: connected\nPORT: ${port}`));
});
// ------------------------------------------------------------
// MARK: - NODE ENVIRONMENT LOGGER
// ------------------------------------------------------------
console.log(`NODE_ENV: ${app.get("env")}`);
// ------------------------------------------------------------
// MARK: - UNHANDLED REJECTION ERROR HANDLER
// ------------------------------------------------------------
process.on("unhandledRejection", (err) => {
    console.log(`[UnhandledRejection] 💥 [${err.name}]`, err.message);
    server.close(() => process.exit(1));
});
// ------------------------------------------------------------
// MARK: - SIGTERM ERROR HANDLER
// ------------------------------------------------------------
process.on("SIGTERM", () => {
    console.log("[SIGTERM] 💥 received, shutting down...");
    server.close(() => console.log("[SIGTERM] 💥 process terminated."));
});
