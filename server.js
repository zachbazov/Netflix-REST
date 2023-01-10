const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

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

mongoose.set("strictQuery", false);
mongoose
    .connect(db, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE: 🟢"));
// .then(() => {
//     const fs = require("fs");
//     const MongoClient = require("mongodb").MongoClient;
//     const uri = db;
//     const client = mongoose.connections[0].client;
//     client.connect((err) => {
//         console.log("connec");

//         //add
//         // Read the image file into a Buffer
//         // const imageBuffer = fs.readFileSync(
//         //     "/Users/zachbazov/Development/Nodejs/netflix-swift-api/public/img/poster/aladdin.jpg"
//         // );

//         // Insert the image into the images collection
//         const collection = client.db("Netflix-Swift").collection("images");
//         // collection.insertOne({ image: imageBuffer }, (err, result) => {
//         //     console.log("Inserted image into the images collection");
//         //     client.close();
//         // });

//         // get
//         // Find the image in the images collection
//         var objectId = new mongoose.Types.ObjectId(
//             "63b8497ce5bc945c391554c0"
//         );
//         collection.findOne({ _id: objectId }, (err, doc) => {
//             // Convert the BinData image to a binary string
//             const imageBuffer = Buffer.from(doc.image);
//             // Convert the binary string to a base64-encoded string
//             const imageBase64 = imageBuffer.toString("base64");
//             // You can now use the imageBase64 string to work with the image data in JavaScript
//             console.log(imageBase64);
//             client.close();
//         });
//     });
// });

const app = require("./app");

const port = process.env.PORT || 8000;

console.log(app.get("env"));

const server = app.listen(port, () =>
    console.log(`PORT: ${port}\nENVIRONMENT: ${app.get("env")}`)
);

// Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
    console.log(`[UnhandledRejection] 💥 [${err.name}]`, err.message);
    // Optional: crashing the server.
    server.close(() => process.exit(1));
});

// SIGTERM - A signal that used to cause a problem to really stop running.
process.on("SIGTERM", () => {
    console.log("[SIGTERM] 💥 received, shutting down...");
    server.close(() => console.log("[SIGTERM] 💥 process terminated."));
});
