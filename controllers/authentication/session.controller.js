const Validator = require('../../interfaces/validator.interface'),
    Services = require('../../services'),
    logg = new (require('../../services/logger.service'))().logger;

let conf;

class SessionController extends Validator {
    constructor() {
        super();
        this._cipher = new Services.CipherService();
        this._authService = new Services.AuthService();
        this._utilities = new Services.UtilityService();
    }

    validateRequest(req, res, next) {
        conf = req.app.locals.conf;

        if (!req.header('Authorization')) {
            res.status(401).json({
                error: 'Invalid authorization header!',
                message: '', ntk: (res.locals.renewedToken || null),
                data: {}
            });

            const errMsg = 'Invalid authorization header!';
            logg.error(errMsg);

            next({status: 401, message: errMsg});
            return;
        }

        this.validateToken(req.header('Authorization').split('Bearer ')[1], (e, payload) => {
            if (!!e) {
                if ((e || {}).message === 'jwt expired' && (Date.now() > new Date(e.expiredAt).valueOf())) {
                    logg.info('Renewing expired token..');
                    console.time('Renew Token');
                    logg.info(`################################################################`);
                    logg.info(`Expired Token: '${req.header('Authorization').split('Bearer ')[1]}'`);
                    logg.info(`################################################################`);

                    if (req.originalUrl.indexOf('/auth/editProfile') >= 0) {
                        logg.info('Edit Profile with expired token');
                        // next();
                        // return;
                    }

                    let uid = req.body.userId || req.query.userId;
                    logg.info(`................................................................`);
                    logg.info(`${req.originalUrl} - UserId is ${uid}`);
                    logg.info(`................................................................`);
                    if (!uid) {
                        res.status(401).json({
                            error: `Expired Token. User ID is not found.`,
                            message: ``, ntk: (res.locals.renewedToken || null),
                            data: {}
                        });
                        logg.error(`Expired Token. User ID is not found.`);
                        console.timeEnd('Renew Token');
                        res.locals.renewedToken = "";
                        return;
                    }

                    if (parseInt(uid, 10) < 1 || !this._utilities.isParsableInt(uid)) {
                        res.status(400).json({
                            error: `Expired Token. User ID is not valid.`,
                            message: ``, ntk: (res.locals.renewedToken || null),
                            data: {}
                        });
                        logg.error(`Expired Token. User ID is not valid.`);
                        console.timeEnd('Renew Token');
                        res.locals.renewedToken = "";
                        return;
                    }

                    uid = parseInt(uid, 10);
                    this.verifyUserId([uid], conf.queries.authentication.checkUserId, (err, data) => {
                        if (!(!err && ((((data[0] || [])[0] || [])[0] || {}).result === 'true'))) {
                            res.status(401).json({
                                error: 'Authentication Failed! Invalid User Id!',
                                message: 'Authentication Failed! Invalid User Id!',
                                ntk: (res.locals.renewedToken || null),
                                data: {}
                            });
                            next({status: 200, message: 'Authentication Failed! Invalid User Id!'});
                            return;
                        }

                        this.dbService.executeQuery(conf.queries.user.getUser, [uid, uid], (err, rows) => {
                            if (!!err) {
                                res.status(500).json({
                                    error: `${err.code} - ${err.message}`,
                                    message: err.message, ntk: null,
                                    data: {}
                                });
                                console.timeEnd('Renew Token');
                                logg.error(`${err.code} ${err.message}`);
                            } else {
                                let userDetails = ((rows || [])[0] || [])[0] || {};
                                delete userDetails.password;
                                userDetails.firstName = this._cipher.decrypt(userDetails.firstName);
                                userDetails.email = this._cipher.decrypt(userDetails.email);

                                this.getToken({
                                    id: uid,
                                    firstName: userDetails.firstName,
                                    email: userDetails.email,
                                    uuid: userDetails.uuid
                                }, (er, tok) => {
                                    if (!!er) {
                                        res.status(401).json({
                                            error: `Expired Token found, Renewing token is failed: ${er}`,
                                            message: ``, ntk: (res.locals.renewedToken || null),
                                            data: {}
                                        });
                                        logg.error(`Expired Token found, Renewing token is failed: ${er}`);
                                        console.timeEnd('Renew Token');
                                        res.locals.renewedToken = "";
                                        return;
                                    }

                                    // req.session.user.token = tok;
                                    res.locals.renewedToken = tok;
                                    res.status(200).json({
                                        error: `AUTHENTICATION_TOKEN_EXPIRED`,
                                        message: 'Please get a verified authentication token.',
                                        ntk: (res.locals.renewedToken || null),
                                        data: {}
                                    });
                                    logg.info('New token is intimated to client successfully.');
                                    console.timeEnd('Renew Token');
                                    next({
                                        error: 'AUTHENTICATION_TOKEN_EXPIRED',
                                        message: 'Please get a verified authentication token.'
                                    });
                                });
                            }
                        });
                    });

                    return;
                }

                res.status(401).json({
                    error: (e || {}).message || 'Authentication Failed!',								// {message: errMessage}
                    message: (e || {}).message || '', ntk: (res.locals.renewedToken || null),																// string
                    data: {}
                });

                logg.info(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
                logg.info(`Error while verifying token: ${e}`);
                logg.info(`Authorization header: ${req.headers.authorization}`);
                logg.info(`URL: ${req.originalUrl}`);
                logg.info(`++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);

                const errMsg = !!e ? `${(e || {}).code} - ${(e || {}).message}` : 'Authentication Failed!';
                logg.warn(errMsg);

                next({status: 401, message: errMsg});

            } else {
                req.body.uuid = payload.uuid;

                next();
            }
        });
    }

    getToken(payload, callback) {
        this._authService.generateToken(payload, callback);
    }

    validateToken(token, callback) {
        this._authService.verify((token || '').trim(), null, null, null, callback);
    }

    renewExpiredToken(req, res, next) {
        console.time('Renew Token request');
        if (!req.body.userId) {
            res.status(400).json({
                error: 'User Id is missing.',
                message: '',
                ntk: (res.locals.renewedToken || null),
                data: {"newToken": ''}
            });
            next({status: 400, error: 'User Id is missing'});
            return;
        }
        if (!req.body.firstName) {
            res.status(400).json({
                error: 'First Name is missing.',
                message: '',
                ntk: (res.locals.renewedToken || null),
                data: {"newToken": ''}
            });
            next({status: 400, error: 'First Name is missing'});
            return;
        }
        if (!req.body.email) {
            res.status(400).json({
                error: 'Email is missing.',
                message: '',
                ntk: (res.locals.renewedToken || null),
                data: {"newToken": ''}
            });
            next({status: 400, error: 'Email is missing'});
            return;
        }
        if (!req.body.uuid) {
            res.status(400).json({
                error: 'UUID is missing.',
                message: '',
                ntk: (res.locals.renewedToken || null),
                data: {"newToken": ''}
            });
            next({status: 400, error: 'UUID is missing'});
            return;
        }

        this.getToken({
            id: req.body.userId,
            firstName: req.body.firstName,
            email: req.body.email,
            uuid: req.body.uuid
        }, (er, tok) => {
            if (!!er) {
                res.status(200).json({
                    error: `Expired Token found, Renewing token is failed: ${er}`,
                    message: ``, ntk: (res.locals.renewedToken || null),
                    data: {}
                });
                logg.error(`Expired Token found, Renewing token is failed: ${er}`);
                // req.session.user.token = "";
                res.locals.renewedToken = "";
                return;
            }

            // req.session.user.token = tok;
            res.locals.renewedToken = tok;
            res.status(401).json({
                error: `AUTHENTICATION_TOKEN_EXPIRED`,
                message: 'Please get a verified authentication token.',
                ntk: (res.locals.renewedToken || null),
                data: {}
            });
            logg.info('New token is intimated to client successfully.');

            next({
                error: 'AUTHENTICATION_TOKEN_EXPIRED',
                message: 'Please get a verified authentication token.'
            });
        });
    }
}

module.exports = SessionController;
