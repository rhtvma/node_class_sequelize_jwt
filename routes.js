const express = require('express'),
    Project = require('./controllers/project'),
    Auth = require('./controllers/auth');

class AppRouter {
    constructor() {
        this._router = express.Router();
        this._projectModule = new Project.ProjectRouter();
        this._authModule = new Auth.AuthRouter();

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
            authRoute: this._authModule.router,
            secureRoutes: [this._projectModule.router]
        };
    }
}

module.exports = AppRouter;
