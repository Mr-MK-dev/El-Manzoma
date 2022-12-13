const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "JobPackagingDaily",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      PackagePlanID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      JobName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DailyType: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      moratab: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SoldierNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      moratabPackaging: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      BehindPrecentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TotalMatlob: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Available: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "JobPackagingDaily",
      schema: "dbo",
      timestamps: false
    }
  );
};
