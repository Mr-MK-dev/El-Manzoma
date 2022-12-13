const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Point",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Hub_ID: {
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
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isHeadQuarter: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "Point",
      schema: "dbo",
      timestamps: false
    }
  );
};
