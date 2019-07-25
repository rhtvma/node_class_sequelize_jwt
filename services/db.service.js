const mysql = require('mysql');
const logger = new (require('./logger.service'))().logger;

const config = require('config'),
    mysqlConfig = config.get('mysql');

class DBService {
    constructor() {
        this.pool = mysql.createPool(mysqlConfig);
        this.conf = config.get('configuration');
    }

    executeQuery(q, params, cb) {
        logger.info(`Reaching ${process.env.NODE_ENV} MySQL database..`);
        this.pool.getConnection((err, conn) => {
            if (!!err) {
                console.log(`Error: ${err.message} ${err.stack}`);
                return;
            }

            conn.query(q, params, (e, rows, fields) => {
                conn.release();
                if (typeof cb === 'function')
                    cb(e, rows);
            });
        });
    }
}

module.exports = DBService;
