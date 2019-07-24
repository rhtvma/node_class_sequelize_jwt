const express = require('express'),
    session = require('express-session'),
    mySqlSessionStore = (require('express-mysql-session'))(session),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    loggingService = new (require('./services').LoggerService)(),
    AppRouter = require('./routes');


const config = require('config');

class TestServer {
    constructor() {
        this.conf = config.get('configuration');
        this.mysqlconf = config.get('mysql');
        this.testServer = express();
        /*Load public*/
        // this.testServer.use(express.static(__dirname + '/../public/dist'));

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
        this.testServer.use('*', (req, res, next) => {
            res.setHeader(this.conf.httpHeaders.names.contentType, this.conf.httpHeaders.values.appJson);
            next();
        });

        /* The default route. */
        this.appRouter = new AppRouter();
        this.testServer.use('/', [
            this.appRouter.subRoutes.globalRoute
        ]);
        this.testServer.use('/', this.appRouter.subRoutes.projectRoutes);
        /******/

        /*Error Handler middleware*/
        this._setErrorHandler();
    }

    /*Public Property to get App from Module Instance*/
    get app() {
        return this.testServer;
    }

    /**Private Methods**/
    _initiateLogging() {
        /**
         * Initiating Bunyan
         */
        this.err = loggingService.fatalLogger;
        this.testServer.set('logg', loggingService.logger);
    }

    _setSessionMiddleware() {
        /**
         * Session middleware
         */
        const sessionStore = new mySqlSessionStore(this.conf.mysqlconf);

        this.testServer.set('trust proxy', 1);
        this.testServer.use(session({
            // key: '',
            secret: this.conf.session.secret,
            store: sessionStore,
            resave: false,
            saveUninitialized: false,
            clearExpired: true,
            checkExpirationInterval: 72000000, // ms
            expiration: 86400000,
            name: 'eliteSession'
        }));

    }

    _setMiddleware() {
        /**
         * Setting middleware
         */
        this.testServer.locals.base = __dirname;
        this.testServer.locals.conf = this.conf;
        this.testServer.use(methodOverride())                                  // Express Middleware
            .use(bodyParser.json())                                       // Express BodyParser
            .use(bodyParser.urlencoded({extended: true}))
            // .use(multipart())
            // .use(helmet())
            .use(cors());

        this.testServer.use('/public', express.static('./public'));
        this.testServer.use('/images', express.static('./public/serve/images'));
    }

    _setErrorHandler() {
        this.testServer.use((err, req, res, next) => {                         // Error Handler - will be called by next(err).
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
