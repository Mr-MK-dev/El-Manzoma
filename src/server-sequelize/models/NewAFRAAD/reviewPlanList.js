const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "reviewPlanList",
        {
            ID_KEY: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            Name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            ReviewPlanDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                defaultValue: ""
            }
        },
        {
            sequelize,
            tableName: "reviewPlanList",
            schema: "dbo",
            timestamps: false
        }
    );
};
