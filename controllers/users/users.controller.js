const Services = require('../../services');
const logg = new Services.LoggerService('Signup', true).logger,
    async = require('async'),
    _ = require('lodash');

const config = require('config');
const UsersModel = require('../../models').users;

class ProjectController {
    constructor() {
        this._cryptService = new Services.CipherService();
        this._utilityService = new Services.UtilityService();
        this._authService = new Services.AuthService();
        this.conf = config.get('configuration');
        this.queries = this.conf.queries;
    }


    profile(req, res, next) {
        const {id} = req.params;
        const params = {
            id: `${id}`
        };

        UsersModel.findOne(
            {
                raw: true,
                where: params,
                attributes: ['id', 'email', 'role', 'name', 'active', 'imageURL', 'createdAt']
            })
            .then((rows) => {
                if (rows === null) {
                    res.status(500).json({
                        status: false,
                        message: `User profile Request Failed.`,
                        data: {}
                    });

                    console.timeEnd('User profile Request');
                    logg.error(`User profile Request Failed.`);
                } else {
                    logg.info('User profile Request completed successfully.');
                    const userData = rows;
                    userData.email = this._cryptService.decrypt(rows.email);

                    res.status(200).json({

                        status: true,
                        message: 'Request completed successfully.',
                        data: userData || []
                    });
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        message: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

    allUsers(req, res, next) {
        UsersModel.findAll(
            {
                raw: true,
                attributes: ['id', 'email', 'role', 'name', 'active', 'imageURL', 'createdAt']
            })
            .then(async (rows) => {
                let userData = rows;
                if (rows === null) {
                    res.status(500).json({
                        error: `AllUser profile Request Failed.`,
                        message: `AllUser profile Request Failed.`,
                        data: {}
                    });

                    console.timeEnd('AllUser profile Request');
                    logg.error(`AllUser profile Request Failed.`);
                } else {
                    logg.info('AllUser profile Request completed successfully.');

                    const updatedResult = rows.map((val, i) => {
                        val.email = this._cryptService.decrypt(val.email);
                        return val;
                    })

                    res.status(200).json({

                        status: true,
                        message: 'Request completed successfully.',
                        data: updatedResult || []
                    });
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        message: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

    editUser(req, res, next) {
        const {id} = req.body;
        UsersModel.findOne(
            {
                raw: true,
                where: params,
                attributes: ['id', 'email', 'role', 'name', 'active', 'imageURL', 'createdAt']
            })
            .then((rows) => {
                if (rows === null) {
                    res.status(500).json({
                        status: false,
                        message: `User profile Request Failed.`,
                        data: {}
                    });
                    const updateArgs = req.body,
                        whereArgs = {
                            id: id
                        };
                    UsersModel.update(
                        updateArgs, {
                            where: whereArgs
                        })
                        .then(async (response) => {
                            res.status(200).json({
                                status: true,
                                message: 'Request completed successfully.',
                                data: []
                            });
                        })
                        .catch((error) => {
                            res.status(200).json({
                                status: false,
                                message: 'Request failed.',
                                data: []
                            });
                        });
                    console.timeEnd('User profile Request');
                    logg.error(`User profile Request Failed.`);
                } else {
                    logg.info('User profile Request completed successfully.');
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        message: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

    deleteUser(req, res, next) {
        const {id} = req.params;
        const params = {
            id: `${id}`
        };

        UsersModel.findOne(
            {
                raw: true,
                where: params,
                attributes: ['id', 'email', 'role', 'name', 'active', 'imageURL', 'createdAt']
            })
            .then((rows) => {
                if (rows === null) {
                    res.status(500).json({
                        status: false,
                        message: `User profile Request Failed.`,
                        data: {}
                    });

                    console.timeEnd('User profile Request');
                    logg.error(`User profile Request Failed.`);
                } else {
                    return UsersModel.destroy({
                        where: params
                    }).then((rowDeleted) => {
                        if (rowDeleted === 1) {
                            res.status(200).json({
                                status: true,
                                message: 'Request completed successfully.',
                                data: []
                            });
                        } else {
                            res.status(200).json({
                                status: false,
                                message: 'Request failed.',
                                data: []
                            });
                        }
                    }).catch((err) => {
                        res.status(200).json({
                            status: false,
                            message: 'Request failed.',
                            data: []
                        });
                    });
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        message: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

}

module.exports = ProjectController;