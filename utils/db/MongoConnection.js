const dotenv = require("dotenv");
const mongoose = require("mongoose");

// MARK: - DotEnv Config

dotenv.config({ path: "./config.env" });

// MARK: - Strict Policy - Mongoose v7.0

mongoose.set("strictQuery", false);

// MARK: - Database Connection String

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

// MARK: - MongoConnection

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

module.exports = MongoConnection;
