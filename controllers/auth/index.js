const express = require('express'),
    AuthController = require('./auth.controller');

const config = require('config');


class AuthRouter {
    constructor() {
        this.routes = config.get('configuration.routes');
        this._authController = new AuthController();

        this.router = express.Router();

        this.router.route(this.routes.auth.signin)
            .post(this._authController.signin.bind(this._authController));

        this.router.route(this.routes.auth.signup)
            .post(this._authController.signup.bind(this._authController));

    }

    get router() {
        return this._router;
    }

    set router(_router) {
        this._router = _router;
    }
}

module.exports = {
    AuthRouter: AuthRouter
};