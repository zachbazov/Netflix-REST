const mongoose = require("mongoose");
const MongoConnection = require("./utils/db/MongoConnection").connect();

// MARK: - Application

const app = require("./app");

// MARK: - Server

const port = process.env.PORT || 8000;

mongoose.connection.once("open", () => {
    app.listen(port, () => console.log(`DATABASE: connected\nPORT: ${port}`));
});

// MARK: - Environment Logger

console.log(`NODE_ENV: ${app.get("env")}`);

// MARK: - Unhandled Rejection Error

process.on("unhandledRejection", (err) => {
    console.log(`[UnhandledRejection] 💥 [${err.name}]`, err.message);
    server.close(() => process.exit(1));
});

// MARK: - SIGTERM
// A signal that used to cause a problem to really stop running.
process.on("SIGTERM", () => {
    console.log("[SIGTERM] 💥 received, shutting down...");
    server.close(() => console.log("[SIGTERM] 💥 process terminated."));
});
