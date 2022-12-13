const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ParentsAndBrothers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      MilitaryType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Kind: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RelevantName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Status: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RelevantType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tele: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      NationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "ParentsAndBrothers",
      schema: "dbo",
      timestamps: false
    }
  );
};
