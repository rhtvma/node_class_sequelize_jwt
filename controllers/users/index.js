const express = require('express'),
    UsersController = require('./users.controller');

const SchemaValidator = require('../../services/middlewares/schema.validator');

const config = require('config');


class UsersRouter {
    constructor() {
        this.routes = config.get('configuration.routes');
        this._usersController = new UsersController();

        this.validateRequest = SchemaValidator(true);

        this.router = express.Router();

        this.router.route(this.routes.users.profile)
            .get(this._usersController.profile.bind(this._usersController));

        this.router.route(this.routes.users.allUsers)
            .get(this._usersController.allUsers.bind(this._usersController));


        this.router.route(this.routes.users.editUser)
            .put(this.validateRequest,
                this._usersController.editUser.bind(this._usersController));


        this.router.route(this.routes.users.deleteUser)
            .delete(this._usersController.deleteUser.bind(this._usersController));


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