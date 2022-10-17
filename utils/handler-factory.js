const mongoose = require('mongoose');
const AppError = require('./AppError');
const APIService = require('../utils/APIService');
const catchAsync = require('./catch-async');
const Media = require('../models/media-model');
const Season = require('./../models/season-model');
const Episode = require('../models/episode-model');
const Section = require('../models/section-model');

const assessParams = async (Model, req) => {
    let doc;

    if (mongoose.isValidObjectId(req.params.id)) {
        switch (Model.modelName) {
            case 'Section':
                return await Model.findById(req.params.id);

            case 'Media':
            doc = await Model.findById(req.params.id);

            if (!doc) {
                return await Model.findOne({
                    slug: req.params.id
                }).populate('seasons');
            }

            return await Model.findById(
                req.params.id
            ).populate('seasons');

            case 'Season':
                doc = await Media.findById(req.params.id);

                if (!doc) {
                    doc = await Media.findOne({
                        slug: req.params.id
                    });

                    if (req.params.season) {
                        return await Model.findOne({
                            tvShow: doc._id,
                            season: req.params.season
                        }).populate('media');
                    }

                    return await Model.find({
                        tvShow: doc._id
                    });
                }

                if (req.params.season) {
                    return await Model.findOne({
                        tvShow: doc._id,
                        season: req.params.season
                    }).populate('media');
                }

                return await Model.find({
                    tvShow: doc._id
                });

            case 'Episode':
                doc = await Media.findById(req.params.id);

                if (!doc) {
                    doc = await Media.findOne({
                        slug: req.params.id
                    });

                    return await Model.find({
                        episode: req.params.episode * 1,
                        season: req.params.season * 1,
                        tvShow: doc._id
                    });
                }

                return await Model.find({
                    tvShow: doc._id,
                    season: req.params.season * 1,
                    episode: req.params.episode * 1
                });

            case 'User':
                return await Model.findById(req.params.id);

            default:
                break;
        }
    } else {
        switch (Model.modelName) {
            case 'Section':
                return await Model.findOne({
                    id: req.params.id * 1
                });

            case 'Media':
                return await Model.findOne({
                    slug: req.params.id
                });//.populate('seasons');

            case 'Season':
                const tvShow = await Media.findOne({
                    slug: req.params.id
                });

                if (req.params.season) {
                    return await Model.findOne({
                        tvShow: tvShow._id,
                        season: req.params.season
                    }).populate('media');
                }

                return await Model.find({
                    tvShow: tvShow._id
                });

            case 'Episode':
                return await Model.findOne({
                    slug: req.params.id,
                    season: req.params.season * 1,
                    episode: req.params.episode * 1
                });

            default:
                break;
        }
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
            status: 'success',
            results: data.length,
            data
        });
    });

exports.getOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case 'Media':
                if (req.params.id !== 'seasons') {
                    data = await Promise.resolve(
                        (data = await assessParams(
                            Model,
                            req
                        ))
                    );
                }
                break;

            default:
                data = await Promise.resolve(
                    (data = assessParams(Model, req))
                );
                break;
        }

        if (!data) {
            const message = `No ${Model.modelName} document has been found.`;
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(200).json({
            status: 'success',
            results: () => {
                if (Model.modelName === 'Media') {
                    return;
                }

                return data.length;
            },
            data
        });
    });

exports.getMany = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case 'Season':
                if (!req.params.id) {
                    return next();
                } else if (req.params.season) {
                    return next();
                } else {
                    data = await Promise.resolve(
                        (data = assessParams(Model, req))
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
            status: 'success',
            results: data.length,
            data
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let data;

        switch (Model.modelName) {
            case 'Section':
                if (req.body.id === 0) {
                    const media = await Media.find();

                    let arr = [];

                    media.forEach((tvShow) => {
                        arr.push(tvShow._id);
                    });

                    const section = await Model.create({
                        id: req.body.id,
                        title: req.body.title,
                        media: arr
                    });

                    return res.status(201).json({
                        status: 'success',
                        data: {
                            section
                        }
                    });
                }

                const message =
                    'Only the primary section is allowed to be created.';
                const appError = new AppError(message, 405);

                return next(appError);

            case 'Media':
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
                    numberOfEpisodes: req.body.numberOfEpisodes
                });
                break;
            case 'Episode':
                data = await Model.create({
                    title: req.body.title,
                    url: req.body.url,
                    season: req.body.season,
                    episode: req.body.episode,
                    tvShow: req.body.tvShow,
                    slug: req.body.slug
                });
                break;
            case 'Season':
                for (
                    let i = 1;
                    i <= req.params.episodes;
                    i++
                ) {
                    const media = await Media.findById(
                        req.params.id
                    );

                    await Episode.create({
                        title: `Ep. ${i}`,
                        url: `https://${media.slug}.com/ep${i}`,
                        season: req.params.season,
                        episode: i,
                        tvShow: req.params.id,
                        slug: media.slug
                    });
                }

                const media = await Media.findById(
                    req.params.id
                );

                if (!media) {
                    const message =
                        'Unable to find a tv show';
                    const appError = new AppError(
                        message,
                        400
                    );

                    return next(appError);
                }

                const eps = await Episode.find({
                    tvShow: media._id
                });

                if (!eps) {
                    const message =
                        'Unable to find episodes';
                    const appError = new AppError(
                        message,
                        400
                    );

                    return next(appError);
                }

                const season = await Season.create({
                    season: req.params.season,
                    title: `${media.title} - Season ${req.params.season}`,
                    media: eps,
                    tvShow: req.params.id,
                    slug: media.slug
                });

                if (!season) {
                    const message =
                        'Unable to create a season';
                    const appError = new AppError(
                        message,
                        400
                    );

                    return next(appError);
                }

                media.seasons.push(season._id);
                await media.save();

                return res.status(201).json({
                    status: 'success',
                    data: {
                        season
                    }
                });

            case 'User':
                data = await Model.create({
                    name: req.body.name,
                    email: req.body.email,
                    photo: req.body.photo,
                    password: req.body.password,
                    passwordConfirm:
                        req.body.passwordConfirm
                });

                break;

            case 'Section':
                data = await Model.create({
                    id: req.body.id,
                    title: req.body.title,
                    media: req.body.media
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
            status: 'success',
            data
        });
    });

exports.createMany = (Model) =>
    catchAsync(async (req, res, next) => {
        let docs;

        switch (Model.modelName) {
            case 'Section':
                if (req.body.docs) {
                    docs = await Model.insertMany(
                        req.body.docs
                    );
                }
                break;
            case 'Episode':
                for (
                    let i = 1;
                    i <= req.params.episodes;
                    i++
                ) {
                    const media = await Media.findById(
                        req.params.id
                    );

                    await Episode.create({
                        title: `Ep. ${i}`,
                        url: `https://${media.slug}.com/ep${i}`,
                        season: req.params.season,
                        episode: i,
                        tvShow: req.params.id,
                        slug: media.slug
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
            status: 'success',
            results: docs.length,
            data: { docs }
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc;

        switch (Model.modelName) {
            case 'Section':
                if (
                    mongoose.isValidObjectId(req.params.id)
                ) {
                    doc = await Model.findByIdAndUpdate(
                        req.params.id,
                        {
                            id: req.body.id,
                            title: req.body.title,
                            media: req.body.media
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    );
                } else {
                    const id = req.params.id * 1;

                    if (typeof id == 'number') {
                        doc = await Model.findOneAndUpdate(
                            {
                                id: req.params.id
                            },
                            {
                                id: req.body.id,
                                title: req.body.title,
                                media: req.body.media
                            },
                            {
                                new: true,
                                runValidators: true
                            }
                        );
                    }
                }
                break;
            case 'Media':
                doc = await Model.findByIdAndUpdate(
                    req.params.id,
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
                        numberOfEpisodes: req.body.numberOfEpisodes
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );

                if (!doc) {
                    doc = await Model.findOneAndUpdate(
                        { slug: req.params.id },
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
                            numberOfEpisodes: req.body.numberOfEpisodes
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    );
                }
                break;
            case 'Episode':
                doc = await Model.findByIdAndUpdate(
                    req.params.id,
                    {
                        season: req.body.season,
                        episode: req.body.episode,
                        title: req.body.title,
                        media: req.body.media,
                        tvShow: req.body.tvShow,
                        slug: req.body.slug
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                break;
            case 'Season':
                doc = await Model.findByIdAndUpdate(
                    req.params.id,
                    {
                        tvShow: req.body.tvShow,
                        slug: req.body.slug,
                        season: req.body.season,
                        title: req.body.title,
                        media: req.body.media
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                break;
            case 'User':
                doc = await Model.findByIdAndUpdate(
                    {
                        _id: req.params.id
                    },
                    {
                        name: req.body.name,
                        email: req.body.email,
                        photo: req.body.photo,
                        role: req.body.role,
                        password: req.body.password,
                        passwordConfirm:
                            req.body.passwordConfirm
                    },
                    {
                        new: true,
                        runValidators: true
                    }
                );
                break;
            default:
                break;
        }

        if (!doc) {
            const message = 'No documents found.';
            const appError = new AppError(message, 404);

            return next(appError);
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
    });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc;

        if (mongoose.isValidObjectId(req.params.id)) {
            doc = await Model.findById(req.params.id);

            switch (Model.modelName) {
                case 'Season':
                    const media = await Media.findById(
                        req.params.id
                    );

                    if (!media) {
                        const message =
                            'Unable to find a tv show';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    const eps = await Episode.find(
                        {
                            tvShow: req.params.id,
                            season: req.params.season
                        },
                        { _id: 1 }
                    );

                    if (!eps) {
                        const message =
                            'Unable to find episodes';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    const season = await Season.findOne({
                        tvShow: req.params.id,
                        season: req.params.season
                    });

                    if (!season) {
                        const message =
                            'Unable to find season';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    media.seasons.pop(season._id);
                    await media.save();

                    await season.delete();
                    eps.forEach(
                        async (el) => await el.delete()
                    );

                    return res.status(204).json({
                        status: 'success',
                        data: null
                    });
                case 'Media':
                    doc = await Model.findById(
                        req.params.id
                    );
                    break;
                default:
                    break;
            }
        } else {
            switch (Model.modelName) {
                case 'Section':
                    const id = req.params.id * 1;
                    doc = await Model.findOneAndDelete({
                        id: id
                    });
                    break;
                case 'Season':
                    const media = await Media.findById(
                        req.params.id
                    );

                    if (!media) {
                        const message =
                            'Unable to find a tv show';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    const eps = await Episode.find(
                        {
                            tvShow: req.params.id,
                            season: req.params.season
                        },
                        { _id: 1 }
                    );

                    if (!eps) {
                        const message =
                            'Unable to find episodes';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    const season = await Season.findOne({
                        tvShow: req.params.id,
                        season: req.params.season
                    });

                    if (!season) {
                        const message =
                            'Unable to find season';
                        const appError = new AppError(
                            message,
                            400
                        );

                        return next(appError);
                    }

                    media.seasons.pop(season._id);
                    await media.save();

                    await season.delete();
                    eps.forEach(
                        async (el) => await el.delete()
                    );

                    return res.status(204).json({
                        status: 'success',
                        data: null
                    });
                case 'Media':
                    doc = await Model.findById(
                        req.params.id
                    );
                    break;
                default:
                    doc = await Model.findById(
                        req.params.episode
                    );

                    if (!doc) {
                        doc = await Model.findOne({
                            slug: req.params.id
                        });
                    }

                    break;
            }
        }

        if (!doc) {
            const message = 'None TV Show has been found.';
            const appError = new AppError(message, 404);

            return next(appError);
        }

        await doc.delete();

        res.status(204).json({
            status: 'success',
            data: null
        });
    });

exports.deleteAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let docs;

        switch (Model.modelName) {
            case 'Section':
                docs = await Model.deleteMany();
                break;
            case 'Media':
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
            status: 'success',
            data: null
        });
    });
