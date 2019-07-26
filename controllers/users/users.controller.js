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
                where: params
            })
            .then(async (rows) => {
                let userData = rows;
                if (rows === null) {
                    res.status(500).json({
                        error: `User profile Request Failed.`,
                        msg: `User profile Request Failed.`,
                        data: {}
                    });

                    console.timeEnd('User profile Request');
                    logg.error(`User profile Request Failed.`);
                } else {
                    logg.info('User profile Request completed successfully.');
                    res.status(200).json({
                        error: null,
                        status: true,
                        msg: 'Request completed successfully.',
                        data: rows || []
                    });
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        msg: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

    allUsers(req, res, next) {
        const params = {
            // id: `${id}`
        };

        UsersModel.findAll(
            {
                raw: true,
                // where: params
            })
            .then(async (rows) => {
                let userData = rows;
                if (rows === null) {
                    res.status(500).json({
                        error: `AllUser profile Request Failed.`,
                        msg: `AllUser profile Request Failed.`,
                        data: {}
                    });

                    console.timeEnd('AllUser profile Request');
                    logg.error(`AllUser profile Request Failed.`);
                } else {
                    logg.info('AllUser profile Request completed successfully.');
                    res.status(200).json({
                        error: null,
                        status: true,
                        msg: 'Request completed successfully.',
                        data: rows || []
                    });
                }
            })
            .catch((err) => {
                console.log('Query executed with error');
                if (!!err) {
                    res.status(500).json({
                        error: `${err.code} - ${err.message}`,
                        msg: err.message,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`${err.code} ${err.message}`);
                }
            });
    }

}

module.exports = ProjectController;