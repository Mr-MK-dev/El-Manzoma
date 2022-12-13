const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Officers",
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
      VacationID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Yearly: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Occasional: {
        type: DataTypes.INTEGER,
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
      }
    },
    {
      sequelize,
      tableName: "Officers",
      schema: "dbo",
      timestamps: false
    }
  );
};
