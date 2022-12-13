const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PointHub",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Unit_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OfficerCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      SoldierCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      RatebCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      isBian: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      isHeadQuarter: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "PointHub",
      schema: "dbo",
      timestamps: false
    }
  );
};
