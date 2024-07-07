const AppError = require("../app/AppError");
const APIService = require("../api/APIService");
const catchAsync = require("../helpers/catch-async");
const Media = require("../../models/media-model");
const Season = require("../../models/season-model");
const Episode = require("../../models/episode-model");
const User = require("../../models/user-model");

// MARK: - CRUD Operations

exports.get = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;
        let query;
        let service;

        query = Model.find();

        service = new APIService(query, req.query)
            .filter()
            .sort()
            .limit()
            .limitFields()
            .paginate()
            .populate(Model);

        data = await service;

        if (!data) {
            const message = `No ${Model.modelName} documents found.`;
            const appError = new AppError(message);
            return next(appError);
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
            case "Section":
                data = await Model.create({
                    id: req.body.id,
                    title: req.body.title,
                    slug: req.body.slug,
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
            case "Season":
                const media = await Media.findOne(
                    req.query.mediaId !== undefined
                        ? { id: req.query.mediaId }
                        : { slug: req.query.slug }
                );

                if (!media) {
                    const message = "No media document found.";
                    const appError = new AppError(message, 400);
                    return next(appError);
                }

                let episodes = [];

                for (let i = 1; i <= req.query.episodes; i++) {
                    const episode = await Episode.create({
                        mediaId: media.id,
                        title: `S${req.query.season}:E${i}`,
                        slug: media.slug,
                        season: req.query.season * 1,
                        episode: i,
                        url: `${req.protocol}://${req.get("host")}/${
                            media.slug
                        }/s${req.query.season}e${i}`,
                    });

                    episodes.push(episode);
                }

                if (!episodes) {
                    const message = `Unable to create episodes for media: ${media.title}.`;
                    const appError = new AppError(message, 400);
                    return next(appError);
                }

                data = await Model.create({
                    mediaId: media.id,
                    title: `${media.title} - Season ${req.query.season}`,
                    slug: media.slug,
                    season: req.query.season * 1,
                    episodes,
                });

                if (!data) {
                    const message = `Unable to create a season for media: ${media.title}.`;
                    const appError = new AppError(message, 400);
                    return next(appError);
                }

                media.seasons.push(data._id);

                await media.save();

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
            case "User":
                data = await Model.create({
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    password: req.body.password,
                    passwordConfirm: req.body.passwordConfirm,
                    // role: req.body.role
                });
                break;
            case "MyList":
                const numberOfLists = await Model.find({
                    user: req.query.user,
                }).count();

                if (numberOfLists > 1) {
                    const message = "Exceeds list limitataion.";
                    return next(new AppError(message, 400));
                }

                data = await Model.create({
                    user: req.body.user,
                    media: req.body.media,
                });
                break;
            case "Image":
                data = await Model.create({
                    name: req.body.name,
                    path: req.body.path,
                    type: req.body.type,
                    output: req.body.output,
                });
                break;
            case "UserProfile":
                data = await Model.create({
                    name: req.body.name,
                    image: req.body.image,
                    active: req.body.active,
                    user: req.query.user,
                    settings: req.query.settings,
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
        let data;

        switch (Model.modelName) {
            case "Section":
                data = await Model.findOneAndUpdate(
                    req.query.id !== undefined
                        ? { id: req.query.id }
                        : req.query._id !== undefined
                        ? { _id: req.query._id }
                        : { slug: req.query.slug },
                    {
                        id: req.body.id,
                        title: req.body.title,
                        slug: req.body.slug,
                    },
                    { new: true }
                );
                break;
            case "Media":
                data = await Model.findOneAndUpdate(
                    req.query._id !== undefined
                        ? { _id: req.query._id }
                        : req.query.id !== undefined
                        ? { id: req.query.id }
                        : { slug: req.query.slug },
                    {
                        type: req.body.type,
                        title: req.body.title,
                        slug: req.body.slug,
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
                    },
                    { new: true, runValidators: true }
                );
                break;
            case "Season":
                data = await Model.findOneAndUpdate(
                    req.query.mediaId !== undefined
                        ? {
                              mediaId: req.query.mediaId,
                              season: req.query.season,
                          }
                        : { slug: req.query.slug, season: req.query.season },
                    {
                        mediaId: req.body.mediaId,
                        title: req.body.title,
                        slug: req.body.slug,
                        season: req.body.season,
                        episodes: req.body.episodes,
                    },
                    { new: true }
                );
                break;
            case "Episode":
                data = await Model.findOneAndUpdate(
                    {
                        mediaId: req.query.mediaId,
                        season: req.query.season,
                        episode: req.query.episode,
                    },
                    {
                        mediaId: req.body.mediaId,
                        title: req.body.title,
                        slug: req.body.slug,
                        season: req.body.season,
                        episode: req.body.episode,
                        url: req.body.url,
                    },
                    { new: true }
                );
                break;
            case "MyList":
                data = await Model.findOneAndUpdate(
                    req.query.user !== undefined
                        ? { user: req.query.user }
                        : { _id: req.query._id },
                    {
                        user: req.body.user,
                        media: req.body.media,
                    },
                    { new: true }
                );
                break;
            case "User":
                data = await Model.findOneAndUpdate(
                    req.query.id !== undefined
                        ? {
                              _id: req.query.id,
                          }
                        : req.query.name !== undefined
                        ? { name: req.query.name }
                        : { email: req.query.email },
                    {
                        name: req.body.name,
                        email: req.body.email,
                        photo: req.body.photo,
                        role: req.body.role,
                        password: req.body.password,
                        passwordConfirm: req.body.passwordConfirm,
                        profiles: req.body.profiles,
                        selectedProfile: req.body.selectedProfile,
                    },
                    { new: true, runValidators: true }
                );
                break;
            case "Image":
                data = await Model.findOneAndUpdate(
                    req.query.name !== undefined
                        ? { name: req.query.name }
                        : { _id: req.query._id },
                    {
                        name: req.body.name,
                        path: req.body.path,
                        type: req.body.type,
                    },
                    { new: true }
                );
                break;
            case "UserProfile":
                data = await Model.findOneAndUpdate(
                    req.query.id !== undefined
                        ? { _id: req.query.id }
                        : { name: req.query.name },
                    {
                        name: req.body.name,
                        image: req.body.image,
                        active: req.body.active,
                        settings: req.body.settings,
                    },
                    { new: true, runValidators: true }
                );
                break;
            default:
                break;
        }

        if (!data) {
            const message = "No documents found.";
            const appError = new AppError(message, 404);
            return next(appError);
        }

        res.status(200).json({
            status: "success",
            data,
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case "Section":
                data = await Model.findOne(
                    req.query.id !== undefined
                        ? { id: req.query.id }
                        : req.query._id !== undefined
                        ? { _id: req.query._id }
                        : { slug: req.query.slug }
                );
                break;
            case "Media":
                data = await Model.findOne(
                    req.query._id !== undefined
                        ? { _id: req.query._id }
                        : req.query.id !== undefined
                        ? { id: req.query.id }
                        : { slug: req.query.slug }
                );
                break;
            case "Season":
                const media = await Media.findOne(
                    req.query.mediaId !== undefined
                        ? { _id: req.query.mediaId }
                        : { slug: req.query.slug }
                );

                if (!media) {
                    const message = "No media document found.";
                    const appError = new AppError(message, 400);
                    return next(appError);
                }

                const episodes = await Episode.find(
                    req.query.mediaId !== undefined
                        ? {
                              mediaId: req.query.mediaId,
                              season: req.query.season,
                          }
                        : {
                              slug: req.query.slug,
                              season: req.query.season,
                          },
                    { episode: 1 }
                );

                if (!episodes) {
                    const message = "No episode documents found.";
                    const appError = new AppError(message, 400);
                    return next(appError);
                }

                data = await Season.findOne(
                    req.query.mediaId !== undefined
                        ? {
                              mediaId: req.query.mediaId,
                              season: req.query.season,
                          }
                        : {
                              slug: req.query.slug,
                              season: req.query.season,
                          }
                );

                if (data) {
                    media.seasons.pop(data._id);

                    await media.save();

                    eps.forEach(async (el) => await el.delete());
                }
                break;
            case "Episode":
                data = await Model.findOne({
                    mediaId: req.query.mediaId,
                    season: req.query.season,
                    episode: req.query.episode,
                });
                break;
            case "MyList":
                data = await Model.findOne(
                    req.query.user !== undefined
                        ? { user: req.query.user }
                        : { _id: req.query._id }
                );
                break;
            case "User":
                data = await Model.findOne(
                    req.query.id !== undefined
                        ? {
                              _id: req.query.id,
                          }
                        : req.query.name !== undefined
                        ? { name: req.query.name }
                        : { email: req.query.email }
                );
                break;
            case "UserProfile":
                data = await Model.findOne(
                    req.query.id !== undefined
                        ? { _id: req.query.id }
                        : { name: req.query.name }
                );
                break;
            case "Image":
                data = await Model.findOne(
                    req.query.name !== undefined
                        ? { name: req.query.name }
                        : { _id: req.query._id }
                );
                break;
            default:
                break;
        }

        if (!data) {
            const message = `No ${Model.modelName} documents found.`;
            const appError = new AppError(message, 404);
            return next(appError);
        }

        await data.delete();

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

exports.deleteAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const data = await Model.deleteMany();

        switch (Model.modelName) {
            case "UserProfile":
                const user = await User.findOne({ user: req.params.user });

                await user.profiles.splice(0, user.profiles.length);

                await user.save({ validateBeforeSave: false });

                break;
            default:
                break;
        }

        if (!data) {
            const message = `Unable to delete ${Model.modelName} documents.`;
            const appError = new AppError(message, 404);
            return next(appError);
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });
