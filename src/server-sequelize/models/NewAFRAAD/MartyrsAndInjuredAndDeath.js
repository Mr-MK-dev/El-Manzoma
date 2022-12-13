const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MartyrsAndInjuredAndDeath",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
        InjuredStatusDescription: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      IncidentSummary: {
        type: DataTypes.STRING(4000),
        allowNull: true
      },
      Image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Kind: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      WarID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DateOfIncident: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      ReasonOrder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      MedicalCouncilOrder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      LastRecoveryOrder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      PatientCondition: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isSupporter: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      DisabilityRatio: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      InjuryCategory: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MartyrsAndInjuredAndDeath",
      schema: "dbo",
      timestamps: false
    }
  );
};
