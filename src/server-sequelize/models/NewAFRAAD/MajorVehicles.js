const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MajorVehicles",
    {
      CarNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      AC: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      BookNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      BookDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SpecDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      SeniorityNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Rank: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MajorName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PromDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Position: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OccDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
      // },
      // CarColorID: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // CarTypeID: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
    },
    {
      sequelize,
      tableName: "MajorVehicles",
      schema: "dbo",
      timestamps: false
    }
  );
};
