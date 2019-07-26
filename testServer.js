const express = require('express'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    Services = require('./services'),
    // loggingService = new (require('./services').LoggerService)(),
    AppRouter = require('./routes'),
    SessionController = new (require('./controllers/authentication/session.controller'))();


const config = require('config');

class TestServer {
    constructor() {
        this._authService = new Services.AuthService();
        this._loggingService = new Services.LoggerService();


        this.conf = config.get('configuration');
        this.mysqlconf = config.get('mysql');
        this._app = express();
        /*Load public*/
        // this._app.use(express.static(__dirname + '/../public/dist'));

        /*Logger*/
        this._initiateLogging();

        /*Session*/
        // this._setSessionMiddleware();

        /*Express middleware, helmet, cors etc.*/
        this._setMiddleware();

        /*Sequelize Databse Synce*/
        this._syncSequelizeDatabase();

        /**Routes*/
        /* Common of All routes. */
        this._app.use('*', (req, res, next) => {
            res.setHeader(this.conf.httpHeaders.names.contentType, this.conf.httpHeaders.values.appJson);
            next();
        });

        /* The default route. */
        this.appRouter = new AppRouter();
        this._app.use('/', [
            this.appRouter.subRoutes.globalRoute,
            this.appRouter.subRoutes.authRoute
        ]);

        this._app.use('/auth', (req, res, next) => {
            const clientIpUF = req.ip || '';
            const clientIp = clientIpUF.replace(/^.*:/, '');
            console.info(`Token : ${!!req.headers.authorization} | CLIENT : ${clientIp}  | API Request : ${req.originalUrl}`);
            next();
        })


        this._app.use('/auth', SessionController.validateRequest.bind(SessionController),
            [this.appRouter.subRoutes.secureRoutes]);
        /* Secure Routes */
        /******/

        /*Error Handler middleware*/
        this._setErrorHandler();
    }

    /*Public Property to get App from Module Instance*/
    get app() {
        return this._app;
    }

    /**Private Methods**/
    _initiateLogging() {
        /**
         * Initiating Bunyan
         */
        this.err = this._loggingService.fatalLogger;
        this._app.set('logg', this._loggingService.logger);
    }

    _setSessionMiddleware() {
        /**
         * Session middleware
         */
        // const sessionStore = new mySqlSessionStore(this.conf.mysqlconf);

        this._app.set('trust proxy', 1);
        // this._app.use(session({
        //     // key: '',
        //     secret: this.conf.session.secret,
        //     store: sessionStore,
        //     resave: false,
        //     saveUninitialized: false,
        //     clearExpired: true,
        //     checkExpirationInterval: 72000000, // ms
        //     expiration: 86400000,
        //     name: 'eliteSession'
        // }));

    }

    _setMiddleware() {
        /**
         * Setting middleware
         */
        this._app.locals.base = __dirname;
        this._app.locals.conf = this.conf;
        this._app.use(methodOverride())                                  // Express Middleware
            .use(bodyParser.json())                                       // Express BodyParser
            .use(bodyParser.urlencoded({extended: true}))
            // .use(multipart())
            // .use(helmet())
            .use(cors());

        this._app.use('/public', express.static('./public'));
        this._app.use('/images', express.static('./public/serve/images'));
    }

    _setErrorHandler() {
        this._app.use((err, req, res, next) => {                         // Error Handler - will be called by next(err).
            this.err.fatal(err);

            /*Checking whether response has been sent to client*/
            if (!res._headerSent)
                res.status(err.status || 500).json({
                    error: {message: err.message || 'Server Error', err: err.stack || err},
                    // message: '', ntk: (res.locals.renewedToken || null),
                    message: '',
                    data: {}
                });
        });
    }

    _syncSequelizeDatabase() {
        const models = require("./models");
        models.sequelize.sync().then(() => {
            console.log('Nice Databse looks fine');
        }).catch((err) => {
            console.log(err, "Something went wrong with the Database update!")
        })
    }

    /******/
}

// Server as Single Module Application
module.exports = TestServer;
