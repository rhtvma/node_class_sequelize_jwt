/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(20),
            defaultValue: 'user',
            allowNull: true
        },
        active: {
            allowNull: false,
            defaultValue: 1,
            type: DataTypes.BOOLEAN
        },
        imageURL: {
            type: DataTypes.TEXT,
            defaultValue: "/images/dummy-profile.jpg",
            allowNull: true
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
        tableName: 'users'
    });

    users.associate = function (models) {
        // associations can be defined here
    };
    return users;
};

