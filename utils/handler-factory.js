const mongoose = require("mongoose");
const AppError = require("./AppError");
const APIService = require("../utils/APIService");
const catchAsync = require("./catch-async");
const Media = require("../models/media-model");
const Season = require("./../models/season-model");
const Episode = require("../models/episode-model");
const Image = require("../models/image-model");

// MARK: - CRUD Operations

exports.get = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;
        let query = Model.find();

        const service = new APIService(query, req.query)
            .filter()
            .sort()
            .limit()
            .limitFields()
            .pagniate();

        if (Model.modelName === "Season") {
            data = await service.query.populate("episodes");
        } else if (Model.modelName === "MyList") {
            data = await service.query.populate("media");
        } else {
            data = await service.query; //.explain();
        }

        res.status(200).json({
            status: "success",
            results: data.length,
            data,
        });
    });

exports.create = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case "User":
                data = await Model.create({
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm,
                });
                break;
            case "Image":
                data = await Image.create({
                    name: req.body.name,
                    path: req.body.path,
                    type: req.body.type,
                    output: req.body.output,
                });
                break;
            case "Section":
                data = await Model.create({
                    id: req.body.id,
                    title: req.body.title,
                    media: req.body.media,
                });
                break;
            case "Media":
                data = await Model.create({
                    type: req.body.type,
                    title: req.body.title,
                    rating: req.body.rating,
                    description: req.body.description,
                    cast: req.body.cast,
                    writers: req.body.writers,
                    duration: req.body.duration,
                    length: req.body.length,
                    genres: req.body.genres,
                    hasWatched: req.body.hasWatched,
                    isHD: req.body.isHD,
                    isExclusive: req.body.isExclusive,
                    isNewRelease: req.body.isNewRelease,
                    isSecret: req.body.isSecret,
                    resources: req.body.resources,
                    seasons: req.body.seasons,
                    numberOfEpisodes: req.body.numberOfEpisodes,
                });
                break;
            case "Episode":
                data = await Model.create({
                    mediaId: req.body.mediaId,
                    title: req.body.title,
                    slug: req.body.slug,
                    season: req.body.season,
                    episode: req.body.episode,
                    url: req.body.url,
                });
                break;
            case "Season":
                const media = await Media.findById(req.body.mediaId);
                let eps = [];
                for (let i = 1; i <= req.params.episodes; i++) {
                    const ep = await Episode.create({
                        mediaId: media.id,
                        title: `S${req.params.numberOfSeason}:E${i}`,
                        slug: media.slug,
                        season: req.params.numberOfSeason,
                        episode: i,
                        url: `${req.protocol}://${req.get("host")}/${
                            media.slug
                        }/s${req.params.numberOfSeason}e${i}`,
                    });
                    eps.push(ep);
                }

                if (!media) {
                    const message =
                        "Unable to find a media resource for an episode.";
                    const appError = new AppError(message, 400);

                    return next(appError);
                } else if (!eps) {
                    const message = "Unable to find episodes resource.";
                    const appError = new AppError(message, 400);

                    return next(appError);
                }

                const season = await Season.create({
                    mediaId: media.id,
                    title: `${media.title} - Season ${req.params.numberOfSeason}`,
                    slug: media.slug,
                    season: req.params.numberOfSeason,
                    episodes: eps,
                });

                if (!season) {
                    const message = "Unable to create a season.";
                    const appError = new AppError(message, 400);

                    return next(appError);
                }

                media.seasons.push(season._id);
                await media.save();

                return res.status(201).json({
                    status: "success",
                    data: {
                        season,
                    },
                });
            case "MyList":
                const numberOfLists = await Model.find({
                    user: req.body.user,
                });
                if (numberOfLists.length > 0) {
                    return next(
                        new AppError("Only one list is allowed per user.", 400)
                    );
                }
                data = await Model.create({
                    user: req.body.user,
                    media: req.body.media,
                });
                break;
            default:
                break;
        }

        if (!data) {
            const message = `Unable to create a ${Model.modelName} document.`;
            const appError = new AppError(message);

            return next(appError);
        }

        res.status(201).json({
            status: "success",
            data,
        });
    });

exports.update = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc;
        let data;

        switch (Model.modelName) {
            case "Image":
                doc = await Model.findOneAndUpdate(
                    { name: req.params.imageName },
                    {
                        name: req.body.name,
                        path: req.body.path,
                        type: req.body.type,
                    },
                    { new: true }
                );
                break;
            case "Section":
                if (mongoose.isValidObjectId(req.params.mediaId)) {
                    doc = await Model.findByIdAndUpdate(
                        req.params.mediaId,
                        {
                            id: req.body.id,
                            title: req.body.title,
                            media: req.body.media,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                } else {
                    const id = req.params.mediaId * 1;

                    if (typeof id == "number") {
                        doc = await Model.findOneAndUpdate(
                            {
                                id: req.params.mediaId,
                            },
                            {
                                id: req.body.id,
                                title: req.body.title,
                                media: req.body.media,
                            },
                            {
                                new: true,
                                runValidators: true,
                            }
                        );
                    }
                }
                break;
            case "Media":
                doc = await Model.findByIdAndUpdate(
                    req.params.mediaId,
                    {
                        type: req.body.type,
                        title: req.body.title,
                        rating: req.body.rating,
                        description: req.body.description,
                        cast: req.body.cast,
                        writers: req.body.writers,
                        duration: req.body.duration,
                        length: req.body.length,
                        genres: req.body.genres,
                        hasWatched: req.body.hasWatched,
                        isHD: req.body.isHD,
                        isExclusive: req.body.isExclusive,
                        isNewRelease: req.body.isNewRelease,
                        isSecret: req.body.isSecret,
                        resources: req.body.resources,
                        seasons: req.body.seasons,
                        numberOfEpisodes: req.body.numberOfEpisodes,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );

                if (!doc) {
                    doc = await Model.findOneAndUpdate(
                        { slug: req.params.mediaId },
                        {
                            type: req.body.type,
                            title: req.body.title,
                            rating: req.body.rating,
                            description: req.body.description,
                            cast: req.body.cast,
                            writers: req.body.writers,
                            duration: req.body.duration,
                            length: req.body.length,
                            genres: req.body.genres,
                            hasWatched: req.body.hasWatched,
                            isHD: req.body.isHD,
                            isExclusive: req.body.isExclusive,
                            isNewRelease: req.body.isNewRelease,
                            isSecret: req.body.isSecret,
                            resources: req.body.resources,
                            seasons: req.body.seasons,
                            numberOfEpisodes: req.body.numberOfEpisodes,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );
                }
                break;
            case "Episode":
                doc = await Model.findByIdAndUpdate(
                    req.params.mediaId,
                    {
                        mediaId: req.body.mediaId,
                        title: req.body.title,
                        slug: req.body.slug,
                        season: req.body.season,
                        episode: req.body.episode,
                        url: req.body.url,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                break;
            case "Season":
                doc = await Model.findByIdAndUpdate(
                    req.params.mediaId,
                    {
                        mediaId: req.body.mediaId,
                        title: req.body.title,
                        slug: req.body.slug,
                        season: req.body.season,
                        episodes: req.body.episodes,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                break;
            case "User":
                doc = await Model.findByIdAndUpdate(
                    {
                        _id: req.params.id,
                    },
                    {
                        name: req.body.name,
                        email: req.body.email,
                        photo: req.body.photo,
                        role: req.body.role,
                        password: req.body.password,
                        passwordConfirm: req.body.passwordConfirm,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                );
                break;
            case "MyList":
                if (mongoose.isValidObjectId(req.params.listUserId)) {
                    data = await Model.findOneAndUpdate(
                        { user: req.params.listUserId },
                        {
                            user: req.body.user,
                            media: req.body.media,
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    ).populate("media");

                    if (!data) {
                        const message = "No documents found.";
                        const appError = new AppError(message, 404);

                        return next(appError);
                    }

                    return res.status(200).json({
                        status: "success",
                        data,
                    });
                }
            default:
                break;
        }

        if (!doc) {
            const message = "No documents found.";
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(200).json({
            status: "success",
            data: {
                doc,
            },
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc;

        if (mongoose.isValidObjectId(req.params.mediaId)) {
            doc = await Model.findById(req.params.mediaId);

            switch (Model.modelName) {
                case "Season":
                    const media = await Media.findById(req.params.mediaId);
                    if (!media) {
                        const message = "Unable to find a media document.";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    const eps = await Episode.find(
                        {
                            mediaId: req.params.mediaId,
                            season: req.params.numberOfSeason,
                        },
                        { _id: 1 }
                    );
                    if (!eps) {
                        const message = "Unable to find episodes";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    const season = await Season.findOne({
                        mediaId: req.params.mediaId,
                        season: req.params.numberOfSeason,
                    });
                    if (!season) {
                        const message = "Unable to find season";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    media.seasons.pop(season._id);
                    await media.save();

                    await season.delete();
                    eps.forEach(async (el) => await el.delete());

                    return res.status(204).json({
                        status: "success",
                        data: null,
                    });
                case "Media":
                    doc = await Model.findById(req.params.mediaId);
                    break;
                default:
                    break;
            }
        } else {
            switch (Model.modelName) {
                case "Section":
                    const id = req.params.id * 1;
                    doc = await Model.findOneAndDelete({
                        id: id,
                    });
                    break;
                case "Season":
                    const media = await Media.findById(req.params.mediaId);
                    if (!media) {
                        const message = "Unable to find a tv show";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    const eps = await Episode.find(
                        {
                            mediaId: req.params.mediaId,
                            season: req.params.numberOfSeason,
                        },
                        { _id: 1 }
                    );
                    if (!eps) {
                        const message = "Unable to find episodes";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    const season = await Season.findOne({
                        mediaId: req.params.mediaId,
                        season: req.params.numberOfSeason,
                    });
                    if (!season) {
                        const message = "Unable to find season";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    media.seasons.pop(season._id);
                    await media.save();

                    await season.delete();
                    eps.forEach(async (el) => await el.delete());

                    return res.status(204).json({
                        status: "success",
                        data: null,
                    });
                case "Media":
                    doc = await Model.findById(req.params.mediaId);
                    break;
                case "Episode":
                    doc = await Model.findById(req.params.numberOfEpisode);
                    if (!doc) {
                        doc = await Model.findOne({
                            slug: req.params.mediaId,
                        });
                    }
                    break;
                case "Image":
                    doc = await Model.findOne({
                        name: req.params.imageName,
                    });
                    break;
                default:
                    break;
            }
        }

        if (!doc) {
            const message = `None ${Model.modelName} has been found.`;
            const appError = new AppError(message, 404);

            return next(appError);
        }

        await doc.delete();

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

exports.deleteAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const docs = await Model.deleteMany();

        if (!docs) {
            const message = `Unable to delete ${Model.modelName} documents.`;
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });
