const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "StageSupportReports",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RecuStage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ShouldHave: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ShouldHaveHigh: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ShouldHaveAboveAverage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ShouldHaveAverage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ShouldHaveNormal: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AlreadyHave: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AlreadyHaveHigh: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AlreadyHaveAboveAverage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AlreadyHaveAverage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AlreadyHaveNormal: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DidntReceive: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      EndCandidates: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "StageSupportReports",
      schema: "dbo",
      timestamps: false
    }
  );
};
