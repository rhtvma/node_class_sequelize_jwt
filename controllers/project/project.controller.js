const Services = require('../../services');
let conf, queries;
const logg = new Services.LoggerService('Signup', true).logger,
    async = require('async');
const Project = require('../../models').project;
const Users = require('../../models').users;
const Projectmapping = require('../../models').projectmapping;

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
                .then(project => {
                    console.log(project.id);
                    let userProjectMappingArr = [];
                    body.profile.reduce((val, index) => {
                        userProjectMappingArr.push({
                            "projectId": project.id,
                            "userId": val
                        })
                    })

                    Projectmapping.bulkCreate(userProjectMappingArr).then(usersRe => {
                        res.status(200).json({
                            status: 1,
                            message: "Success",
                            data: usersRe
                        });
                    })
                })
                .catch(error => {
                    res.status(200).json({
                        data: [],
                        message: error.message || "Code error",
                        status: 3
                    });
                })
        } catch (err) {
            console.log(err);
            res.status(200).json({
                data: [],
                message: err.message || "Code error",
                status: 4
            });
        }
    }

    projectList(req, res, next) {
        Projectmapping.belongsTo(Project, {targetKey: 'id', foreignKey: 'projectId'});
        Projectmapping.belongsTo(Users, {targetKey: 'id', foreignKey: 'userId'});

        // return Projectmapping.findAll({
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
            return Projectmapping
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
                            message: "Success",
                            data: result
                        });
                        console.timeEnd('request');
                    } else {
                        res.status(200).json({
                            data: [],
                            message: "No Record Found",
                            status: 2
                        });
                    }
                }).catch((err) => {
                    console.timeEnd('request');
                    logg.error(`${err.code} ${err.message}`);
                    res.status(200).json({
                        data: [],
                        message: err.message || "Code error",
                        status: 3
                    });
                });
        } catch
            (err) {
            res.status(200).json({
                data: [],
                message: err.message || "Code error",
                status: 4
            });
        }
    }
}

module.exports = ProjectController;