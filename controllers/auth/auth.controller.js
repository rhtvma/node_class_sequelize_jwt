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

    signup(req, res, next) {
        let {firstName, lastName, password, username, age, imageURL} = req.body;
        password = '12345';
        username = 'rhtvma';
        try {
            UsersModel
                .build({
                    "firstName": firstName || 'Rohit',
                    "lastName": lastName || 'Verma',
                    "password": this._cryptService.createPassword(password),
                    "username1": username,
                    "username": this._cryptService.encrypt((username).trim().toLowerCase()),
                    "age": age || 26,
                    "imageURL": imageURL || 'http://localhost:3000/images/dummy-profile.jpg',
                })
                .save()
                .then(result => {
                    console.log(result.id);
                    res.status(200).json({
                        data: [{profileImage: result.imageURL}],
                        msg: "User Created",
                        status: 1
                    });
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

    signin(req, res, next) {
        let {username, password} = req.body;
        password = '12345';
        username = 'rhtvma';
        const params = {
            username: `${this._cryptService.encrypt((username || '').trim().toLowerCase())}`,
            password: `${this._cryptService.createPassword(password)}`
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
                        error: `Authentication Failed.`,
                        message: `Authentication Failed.`,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`Authentication Failed.`);
                } else {

                    if (!userData.active) {
                        res.status(500).json({
                            error: `User is not active, Please contact administrator.`,
                            message: `User is not active, Please contact administrator.`,
                            data: {}
                        });

                        console.timeEnd('Login request');
                        logg.error(`User is not active, Please contact administrator.`);
                        return;
                    }
                    userData.firstName = userData.firstName; // this._cryptService.decrypt(userData.firstName);
                    userData.lastName = userData.lastName; //this._cryptService.decrypt(userData.lastName);
                    userData.email = this._cryptService.decrypt(userData.email);
                    delete userData.password;
                    userData.token = '';
                    req.body.myId = userData.id;

                    const userDetails = {
                        id: userData.id,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        role: userData.role,
                        imageURL: userData.imageURL
                    };

                    this.getToken(userDetails, (e, tok) => {
                        if (!!e) {
                            res.status(500).json({
                                error: `Session Creation error: ${e}`,
                                message: ``,
                                data: {}
                            });

                            console.timeEnd('Login request');
                            logg.error(`Failed to create session: ${e}`);
                            next(e);
                        } else {
                            console.timeEnd('Login request');
                            logg.info('Login completed successfully.');
                            res.status(200).json({
                                error: null,
                                message: 'Request completed successfully.',
                                payload: (tok || null),
                            });
                        }
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

    getToken(payload, callback) {
        this._authService.generateToken(payload, callback);
    }
}

module.exports = ProjectController;