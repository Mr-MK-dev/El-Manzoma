const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    return sequelize.define(
        "KsasVolunteeringTimePlan",
        {
            ID_KEY: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            dateFrom: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            dateTo: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            excutingResponsible: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            IsFollowed: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: "KsasVolunteeringTimePlan",
            schema: "dbo",
            timestamps: false
        }
    );
};
