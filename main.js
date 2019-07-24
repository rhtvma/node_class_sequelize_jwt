const express = require('express'),
    http = require('http'),
    server = express(),
    testServer = new (require('./testServer'))(),
    logger = testServer.app.get('logg'),
    config = require('config');

server.use('/', testServer.app);

const host = config.get('configuration.host'),
    port = config.get('configuration.port');

const listenerCallback = (err) => {
    if (!!err) {
        console.error(err.message || err.stack || err);
    }
    console.log(`--------------------**********************--------------------`);
    console.log(`Server is listening on port ${port}, in ${process.env.NODE_ENV} mode`);
    console.log(`${host}:${port}/`);
    console.log(`--------------------**********************--------------------`);
};

/*HTTP*/
let _testInstance = http.createServer(testServer.app).listen(port, listenerCallback);

/*Exception Handler*/
process.on('uncaughtException', (err) => {
    logger.fatal(`FATAL_EXCEPTION: ${err}`);
    logger.fatal(`FATAL_EXCEPTION: ${err.stack}`);
    logger.fatal(`**SERVER_CRASHED**`);

    _testInstance.close(() => {
        logger.info(`Shutting Down Server...`);
        process.exit(0);
    });
});
