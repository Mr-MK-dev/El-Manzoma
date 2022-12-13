const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "lossCompensation",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      PackagePlanID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      LossGroupID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      moratabWar: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lossPercentage: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nonRerturned: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      AbsencePercentage: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Ordered: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Placed: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      PlacedPerOrdered: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "lossCompensation",
      schema: "dbo",
      timestamps: false
    }
  );
};
