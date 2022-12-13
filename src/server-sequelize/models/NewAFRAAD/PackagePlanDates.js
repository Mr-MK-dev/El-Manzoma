const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "PackagePlanDates",
        {
            ID_KEY: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            PackagePlanID: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            FirstDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            FirstDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            SecondDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            SecondDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            ThirdDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            ThirdDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            }, FourthDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            FourthDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            }, FifthDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            FifthDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            }, SixthDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            SixthDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },
            SeventhDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            SeventhDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            }, EighthDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            EighthDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            }, NinthDateName: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            NinthDateValues: {
                type: DataTypes.STRING(1000),
                allowNull: true
            },

        },
        {
            sequelize,
            tableName: "PackagePlanDates",
            schema: "dbo",
            timestamps: false
        }
    );
};
