const express = require('express'),
    ProjectController = require('./project.controller');

const config = require('config');

/**
 * @swagger
 * definitions:
 *   Puppy:
 *     properties:
 *       name:
 *         type: string
 *       breed:
 *         type: string
 *       age:
 *         type: integer
 *       sex:
 *         type: string
 */


class ProjectRouter {
    constructor() {
        this.routes = config.get('configuration.routes');
        this._projectController = new ProjectController();

        this.router = express.Router();

        this.router.route(this.routes.project.projectList)
            .get(this._projectController.projectList.bind(this._projectController));

        this.router.route(this.routes.project.projectCreate)
            .post(this._projectController.projectCreate.bind(this._projectController));

        this.router.route(this.routes.users.usersList)
            .get(this._projectController.usersList.bind(this._projectController));

    }

    get router() {
        return this._router;
    }

    set router(_router) {
        this._router = _router;
    }
}

module.exports = {
    ProjectRouter: ProjectRouter
};