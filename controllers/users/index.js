const express = require('express'),
    UsersController = require('./users.controller');

const config = require('config');


class UsersRouter {
    constructor() {
        this.routes = config.get('configuration.routes');
        this._usersController = new UsersController();

        this.router = express.Router();

        this.router.route(this.routes.users.profile)
            .get(this._usersController.profile.bind(this._usersController));

        this.router.route(this.routes.users.allUsers)
            .get(this._usersController.allUsers.bind(this._usersController));


    }

    get router() {
        return this._router;
    }

    set router(_router) {
        this._router = _router;
    }
}

module.exports = {
    UsersRouter: UsersRouter
};