const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "HumanLoss",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
        AccidentID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
      ID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      LossStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IsDeathReportExecuted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      IsMartyrdomReportExecuted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      IsHealedWithDeformity: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      CommitteeDecisionForFitting: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "HumanLoss",
      schema: "dbo",
      timestamps: false
    }
  );
};
