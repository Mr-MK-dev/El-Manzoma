 const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MilitaryManagementOfficers",
    {
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      OfficerCategory: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OfficerLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      BranchID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      VacationType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Status: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Address: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      PhoneNumber: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Religion: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      MartialStatus: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Job: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OccasionalDaysCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      AnnualDaysCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RemainingOccasionalDaysCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        RemainingAnnualDaysCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MilitaryManagementOfficers",
      schema: "dbo",
      timestamps: false
    }
  );
};
