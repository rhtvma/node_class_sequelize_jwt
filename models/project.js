/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('project', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        project: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        formsubmitted: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        total: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        count: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        created_by: DataTypes.INTEGER,
        createdAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            defaultValue: new Date(),
            type: DataTypes.DATE
        }
    }, {
        tableName: 'project'
    });
};
