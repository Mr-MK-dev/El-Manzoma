const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "distriputionPlanStats",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      distriputionPlanID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      // Siasa: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      // Moratab: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      // totalBefore: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      // Leavers: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      // High: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // AboveAvg: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // Avg: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // Normal: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      HighSupply: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      AboveAvgSupply: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      AvgSupply: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      NormalSupply: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
      // HighLeavers: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // AboveAvgLeavers: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // AvgLeavers: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // },
      // NormalLeavers: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true
      // }
    },
    {
      sequelize,
      tableName: "distriputionPlanStats",
      schema: "dbo",
      timestamps: false
    }
  );
};
