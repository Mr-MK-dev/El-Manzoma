const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitsOfficers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      OfficerLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Job: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Commitment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      DateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      DateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitsOfficers",
      schema: "dbo",
      timestamps: false
    }
  );
};
