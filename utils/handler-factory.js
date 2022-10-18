const mongoose = require("mongoose");
const AppError = require("./AppError");
const APIService = require("../utils/APIService");
const catchAsync = require("./catch-async");
const Media = require("../models/media-model");
const Season = require("./../models/season-model");
const Episode = require("../models/episode-model");

const isValidObjectId = async (Model, req) => {
    switch (Model.modelName) {
        case "Section":
            if (mongoose.isValidObjectId(req.params.id)) {
                let validIdObject = await Model.findById(req.params.id);
                // There is a change that mongodb recognizes certain slugs as valid id objects.
                // In that case we need check if any object is returned from the `findById` query.
                // If not, the object returned with another query.
                if (!validIdObject) {
                    return await Model.findOne({ slug: req.params.id });
                }
                return validIdObject;
            }
            // In this assignment we've been returned an object by a slug query.
            const slugObject = await Model.findOne({ slug: req.params.id });
            // If there is no document that conforms to the slug query.
            // We return an object by an id query.
            if (!slugObject) {
                return await Model.findOne({ id: req.params.id });
            }
            return slugObject;
        case "Media":
            if (mongoose.isValidObjectId(req.params.mediaId)) {
                let validIdObject = await Model.findById(req.params.mediaId);
                if (!validIdObject) {
                    return await Model.findOne({ slug: req.params.mediaId });
                }
                return validIdObject;
            }
            return await Model.findOne({
                slug: req.params.mediaId,
            });
        case "Season":
            // If there is no 'numberOfSeason' param, returns all seasons for that media.
            if (!req.params.numberOfSeason) {
                if (mongoose.isValidObjectId(req.params.mediaId)) {
                    let validIdObject = await Media.findById(
                        req.params.mediaId
                    );
                    if (!validIdObject) {
                        return await Model.find({
                            slug: req.params.mediaId,
                        }).populate("episodes");
                    }
                    return await Model.find({
                        mediaId: validIdObject.id,
                    }).populate("episodes");
                } else {
                    let slugObject = await Media.find({
                        slug: req.params.mediaId,
                    });
                    slugObject = await Model.find({
                        slug: req.params.mediaId,
                    }).populate("episodes");
                    if (!slugObject) {
                        slugObject = await Model.find({
                            mediaId: slugObject.id,
                        }).populate("episodes");
                    }
                    return slugObject;
                }
                // In case a 'numberOfSeason' param is given, return in response accordingly.
            } else {
                if (mongoose.isValidObjectId(req.params.mediaId)) {
                    let validIdObject = await Media.findById(
                        req.params.mediaId
                    );
                    return await Model.findOne({
                        mediaId: validIdObject.id,
                        season: req.params.numberOfSeason,
                    }).populate("episodes");
                }
                let slugObject = await Media.findOne({
                    slug: req.params.mediaId,
                });
                return await Model.findOne({
                    mediaId: slugObject.id,
                    season: req.params.numberOfSeason,
                }).populate("episodes");
            }
        case "Episode":
            let object = await Model.findOne({
                mediaId: req.params.mediaId,
                season: req.params.numberOfSeason,
                episode: req.params.numberOfEpisode,
            });
            if (!object) {
                return await Model.findOne({
                    slug: req.params.mediaId,
                    season: req.params.numberOfSeason,
                    episode: req.params.numberOfEpisode,
                });
            }
            return object;
        default:
            break;
    }
};

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;
        let query = Model.find();

        const service = new APIService(query, req.query)
            .filter()
            .sort()
            .limit()
            .limitFields()
            .pagniate();

        data = await service.query; //.explain();

        res.status(200).json({
            status: "success",
            results: data.length,
            data,
        });
    });

exports.getOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case "Media":
                data = await Promise.resolve(
                    (data = await isValidObjectId(Model, req))
                );
                break;
            default:
                console.log(req.params);
                data = await Promise.resolve(
                    (data = isValidObjectId(Model, req))
                );
                break;
        }

        if (!data) {
            const message = `No ${Model.modelName} document has been found.`;
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(200).json({
            status: "success",
            results: () => {
                if (Model.modelName === "Media") {
                    return;
                }

                return data.length;
            },
            data,
        });
    });

exports.getMany = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case "Season":
                if (!req.params.mediaId) {
                    return next();
                } else if (req.params.numberOfSeason) {
                    return next();
                } else {
                    data = await Promise.resolve(
                        (data = isValidObjectId(Model, req))
                    );
                }
                break;
            default:
                break;
        }

        if (!data) {
            const message = `No ${Model.modelName} document has been found.`;
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(200).json({
            status: "success",
            results: data.length,
            data,
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case "Section":
                if (req.body.id === 0) {
                    const media = await Media.find();

                    let arr = [];

                    media.forEach((el) => {
                        arr.push(el._id);
                    });

                    const section = await Model.create({
                        id: req.body.id,
                        title: req.body.title,
                        media: arr,
                    });

                    return res.status(201).json({
                        status: "success",
                        data: {
                            section,
                        },
                    });
                }

                const message =
                    "Only the primary section is allowed to be created.";
                const appError = new AppError(message, 405);

                return next(appError);
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
                for (let i = 1; i <= req.params.numberOfEpisode; i++) {
                    const media = await Media.findById(req.params.mediaId);

                    await Episode.create({
                        mediaId: req.params.mediaId,
                        title: `Ep. ${i}`,
                        slug: media.slug,
                        season: req.params.numberOfSeason,
                        episode: i,
                        url: `https://${media.slug}.com/ep${i}`,
                    });
                }

                const media = await Media.findById(req.params.mediaId);

                if (!media) {
                    const message = "Unable to find a tv show";
                    const appError = new AppError(message, 400);

                    return next(appError);
                }

                const eps = await Episode.find({
                    mediaId: media._id,
                });

                if (!eps) {
                    const message = "Unable to find episodes";
                    const appError = new AppError(message, 400);

                    return next(appError);
                }

                const season = await Season.create({
                    mediaId: req.params.mediaId,
                    title: `${media.title} - Season ${req.params.numberOfSeason}`,
                    slug: media.slug,
                    season: req.params.numberOfSeason,
                    episodes: eps,
                });

                if (!season) {
                    const message = "Unable to create a season";
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
            case "User":
                data = await Model.create({
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm,
                });
                break;
            case "Section":
                data = await Model.create({
                    id: req.body.id,
                    title: req.body.title,
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

exports.createMany = (Model) =>
    catchAsync(async (req, res, next) => {
        let docs;

        switch (Model.modelName) {
            case "Section":
                if (req.body.docs) {
                    docs = await Model.insertMany(req.body.docs);
                }
                break;
            case "Episode":
                for (let i = 1; i <= req.params.numberOfEpisode; i++) {
                    const media = await Media.findById(req.params.mediaId);

                    await Episode.create({
                        mediaId: req.params.mediaId,
                        title: `Ep. ${i}`,
                        slug: media.slug,
                        season: req.params.numberOfSeason,
                        episode: i,
                        url: `https://${media.slug}.com/ep${i}`,
                    });
                }
                break;
            default:
                break;
        }

        if (!docs) {
            const message = `An error occurred while creating ${Model.modelName} documents`;
            const appError = new AppError(message, 400);

            return next(appError);
        }

        res.status(201).json({
            status: "success",
            results: docs.length,
            data: { docs },
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc;

        switch (Model.modelName) {
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
                        const message = "Unable to find a tv show";
                        const appError = new AppError(message, 400);

                        return next(appError);
                    }

                    const eps = await Episode.find(
                        {
                            mediaId: req.params.mediaId,
                            season: req.params.season,
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
                        season: req.params.season,
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
                            season: req.params.season,
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
                        season: req.params.season,
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

                default:
                    doc = await Model.findById(req.params.numberOfEpisode);

                    if (!doc) {
                        doc = await Model.findOne({
                            slug: req.params.mediaId,
                        });
                    }

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
        let docs;

        switch (Model.modelName) {
            case "Section":
                docs = await Model.deleteMany();
                break;
            case "Media":
                docs = await Model.deleteMany();
                break;
            default:
                break;
        }

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
