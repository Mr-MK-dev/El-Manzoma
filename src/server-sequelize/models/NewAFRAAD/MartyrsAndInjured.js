const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MartyrsAndInjured",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      PhoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      NationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      MilitaryStatus: {
        type: DataTypes.STRING(1000),
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
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Level: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DateOfDeath: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      ReasonOrder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      WarType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      hasSupport: {
        type: DataTypes.BOOLEAN,
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
      Ya3ol: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DisabilityRatio: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      DateOfInjury: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      InjuryCategory: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      MartialStatus: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Religion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Kind: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MartyrsAndInjured",
      schema: "dbo",
      timestamps: false
    }
  );
};
