const fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    basename = path.basename(__filename),
    env = process.env.NODE_ENV || 'development';

const config = require('config'),
    mysqlConfig = config.get('mysql');

const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(env, mysqlConfig);
} else {
    sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, mysqlConfig);
}

fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
