const Services = require('../../services');
let conf, queries;
const logg = new Services.LoggerService('Signup', true).logger,
    async = require('async');
const Project = require('../../models').project;
const Users = require('../../models').users;
const UserProjectMapping = require('../../models').userprojectmapping;

const _ = require('lodash');
class ProjectController {
    constructor() {
    }

    projectCreate(req, res, next) {
        const body = req.body;
        try {
            Project
                .build({
                    "project": body.project,
                    "formsubmitted": body.formsubmitted,
                    "description": body.description,
                    "symbol": body.symbol,
                    "total": body.profile.length + 3,
                    "count": body.profile.length
                })
                .save()
                .then(projectResult => {
                    console.log(projectResult.id);
                    let userProjectMappingArr = [];
                    body.profile.reduce((val, index) => {
                        userProjectMappingArr.push({
                            "projectId": projectResult.id,
                            "userId": val
                        })
                    })

                    UserProjectMapping.bulkCreate(userProjectMappingArr).then(usersRe => {
                        res.status(200).json({
                            status: 1,
                            msg: "Success",
                            data: usersRe
                        });
                    })
                })
                .catch(error => {
                    res.status(200).json({
                        data: [],
                        msg: error.message || "Code error",
                        status: 3
                    });
                })
        } catch (err) {
            console.log(err);
            res.status(200).json({
                data: [],
                msg: err.message || "Code error",
                status: 4
            });
        }
    }

    usersList(req, res, next) {
        try {
            return Users
                .all().then((result) => {
                    logg.info('completed successfully.');
                    if (result.length > 0) {
                        res.status(200).json({
                            status: 1,
                            msg: "Success",
                            data: result
                        });
                        console.timeEnd('request');
                    } else {
                        res.status(200).json({
                            data: [],
                            msg: "No Record Found",
                            status: 2
                        });
                    }
                })
                .catch((err) => {
                    console.timeEnd('request');
                    logg.error(`${err.code} ${err.message}`);
                    res.status(200).json({
                        data: [],
                        msg: err.message || "Code error",
                        status: 3
                    });
                });
        } catch
            (err) {
            res.status(200).json({
                data: [],
                msg: err.message || "Code error",
                status: 4
            });
        }
    }

    projectList(req, res, next) {
        UserProjectMapping.belongsTo(Project, {targetKey: 'id', foreignKey: 'projectId'});
        UserProjectMapping.belongsTo(Users, {targetKey: 'id', foreignKey: 'userId'});

        // return UserProjectMapping.findAll({
        //     include: [{
        //         model: Project
        //     }, {
        //         model: Users
        //     }]

        // .aggregate('projectId', 'DISTINCT',
        //         {
        //             plain: false,
        //             include: [{
        //                 model: Project
        //             }]
        //         })


        try {
            return UserProjectMapping
                .findAll({
                    include: [{
                        model: Project
                    }, {
                        model: Users
                    }]
                })
                .then((result) => {
                    result.profile = [];
                    logg.info('completed successfully.');
                    if (result.length > 0) {
                        res.status(200).json({
                            status: 1,
                            msg: "Success",
                            data: result
                        });
                        console.timeEnd('request');
                    } else {
                        res.status(200).json({
                            data: [],
                            msg: "No Record Found",
                            status: 2
                        });
                    }
                }).catch((err) => {
                    console.timeEnd('request');
                    logg.error(`${err.code} ${err.message}`);
                    res.status(200).json({
                        data: [],
                        msg: err.message || "Code error",
                        status: 3
                    });
                });
        } catch
            (err) {
            res.status(200).json({
                data: [],
                msg: err.message || "Code error",
                status: 4
            });
        }
    }
}

module.exports = ProjectController;