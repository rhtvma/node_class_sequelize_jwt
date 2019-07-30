/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('projectmapping', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        projectId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'project',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
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
        tableName: 'projectmapping'
    });
};
