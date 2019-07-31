const Services = require('../../services');
const logg = new Services.LoggerService('Signup', true).logger,
    async = require('async'),
    _ = require('lodash');

const config = require('config');
const UsersModel = require('../../models').users;

class AuthController {
    constructor() {
        this.conf = config.get('configuration');
        this.queries = this.conf.queries;
        this._cryptService = new Services.CipherService();
        this._utilityService = new Services.UtilityService();
        this._authService = new Services.AuthService();
    }

    signUp(req, res, next) {
        const {name, password, email} = req.body;
        try {
            UsersModel.findOne(
                {
                    raw: true,
                    where: {email: `${this._cryptService.encrypt((email || '').trim().toLowerCase())}`},
                    attributes: ['id']
                })
                .then((rows) => {
                    if (rows) {
                        return res.status(409).json({
                            status: false,
                            data: [],
                            message: "User already exists"
                        });
                    } else {
                        UsersModel
                            .build({
                                "name": name,
                                "password": this._cryptService.createPassword(password),
                                "email": this._cryptService.encrypt((email).trim().toLowerCase()),
                                "imageURL": '/images/dummy-profile.jpg',
                            })
                            .save()
                            .then(result => {
                                console.log(result.id);
                                res.status(200).json({
                                    status: true,
                                    data: [{profileImage: result.imageURL}],
                                    message: "User Created"
                                });
                            })
                            .catch(error => {
                                res.status(200).json({
                                    data: [],
                                    message: error.message || "Code error",
                                    status: false
                                });
                            })
                    }

                })
                .catch(error => {
                    res.status(200).json({
                        data: [],
                        message: error.message || "Code error",
                        status: false
                    });
                })

        } catch (err) {
            console.log(err);
            res.status(200).json({
                data: [],
                message: err.message || "Code error",
                status: false
            });
        }
    }

    signIn(req, res, next) {
        const {email, password} = req.body;
        const params = {
            email: `${this._cryptService.encrypt((email || '').trim().toLowerCase())}`,
            password: `${this._cryptService.createPassword(password)}`
        };

        UsersModel.findOne(
            {
                raw: true,
                where: params,
                attributes: ['id', 'email', 'role', 'name', 'active', 'imageURL', 'createdAt']
            })
            .then(async (rows) => {
                let userData = rows;
                if (rows === null) {
                    res.status(500).json({
                        status: false,
                        message: `Authentication Failed.`,
                        data: {}
                    });

                    console.timeEnd('Login request');
                    logg.error(`Authentication Failed.`);
                } else {

                    if (!userData.active) {
                        res.status(500).json({
                            status: false,
                            message: `User is not active, Please contact administrator.`,
                            data: {}
                        });

                        console.timeEnd('Login request');
                        logg.error(`User is not active, Please contact administrator.`);
                        return;
                    }
                    userData.name = userData.name; // this._cryptService.decrypt(userData.firstName);
                    userData.email = this._cryptService.decrypt(userData.email);
                    delete userData.password;
                    userData.token = '';
                    req.body.myId = userData.id;

                    const userDetails = {
                        id: userData.id,
                        name: userData.name,
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
                                status: true,
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

module.exports = AuthController;