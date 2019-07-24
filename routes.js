const express = require('express'),
    Project = require('./controllers/project');

class AppRouter {
    constructor() {
        this._router = express.Router();
        this._projectModule = new Project.ProjectRouter();

        /*Always should be the last middleware for default route handler*/
        this._router.all('/', (req, res, next) => {
            res.status(200).json({
                error: null,								// {message: errMessage}
                message: 'This is the default URL.', ntk: (res.locals.renewedToken || null),		// string
                // data: {}
            });
        });
    }

    get subRoutes() {
        return {
            globalRoute: this._router,
            projectRoutes: this._projectModule.router,
            resourceRoutes: []
        };
    }
}

module.exports = AppRouter;
