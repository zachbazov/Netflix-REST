const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const TVShow = require("./../models/tv-show-model");
const Season = require("./../models/season-model");
const Episode = require("./../models/episode-model");
const User = require("./../models/user-model");
const Movie = require("./../models/movie-model");

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

mongoose
    .connect(db, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE: 🟢"));

const tvShows = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/tvshows.json`, "utf-8")
);

const movies = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/movies.json`, "utf-8")
);

const seasons = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/seasons.json`, "utf-8")
);

const episodes = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/episodes.json`, "utf-8")
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/users.json`, "utf-8")
);

const importData = async () => {
    try {
        // await TvShow.create(tvShows);
        // await Season.create(seasons);
        // await Episode.create(episodes);
        // await User.create(users, {
        //     validateBeforeSave: false
        // });
        // await Movie.create(movies);

        console.log("successfully loaded.");

        process.exit();
    } catch (err) {
        console.log(err);
    }
};

const deleteData = async () => {
    try {
        // await TvShow.deleteMany();
        // await Season.deleteMany();
        // await Episode.deleteMany();
        // await User.deleteMany();
        // await Movie.deleteMany();

        console.log("successfully deleted.");

        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === "--import") {
    importData();
} else if (process.argv[2] === "--delete") {
    deleteData();
}

// console.log(process.argv);
