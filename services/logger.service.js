const bunyan = require('bunyan');

class LoggerService {
    constructor(name, isSrc) {
        /**
         * FATAL ERROR WARN INFO DEBUG TRACE
         */

        this._fatalLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'fatal' || 60,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && true,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._errorLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'error' || 50,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && true,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._warnLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'warn' || 40,                    // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && false,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._infoLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'info' || 30,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && false,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._debugLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'debug' || 20,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && true,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._traceLogger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            level: 'trace' || 10,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            src: isSrc && false,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });

        this._logger = bunyan.createLogger({
            name: name || 'Elite',                     // Required
            // level: 'fatal' || 60,                   // Optional, see "Levels" section
            // stream: <node.js stream>,           // Optional, see "Streams" section
            // streams: [<bunyan streams>],        // Optional, see "Streams" section
            // serializers: <serializers mapping>,     // Optional, see "Serializers" section
            // src: isSrc && true,                     // Optional, see "src" section

            // Any other fields are added to all log records as is.
            // foo: 'bar'
        });
    }

    get fatalLogger() {
        return this._fatalLogger;
    }

    get errorLogger() {
        return this._errorLogger;
    }

    get warnLogger() {
        return this._warnLogger;
    }

    get infoLogger() {
        return this._infoLogger;
    }

    get debugLogger() {
        return this._debugLogger;
    }

    get traceLogger() {
        return this._traceLogger;
    }
    get logger() {
        return this._logger;
    }
}

module.exports = LoggerService;