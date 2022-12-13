const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferAllocationSnapshot",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TransferedUnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OldUnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ReasonType: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ReasonID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DecisionNotes: {
        type: DataTypes.STRING(800),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferAllocationSnapshot",
      schema: "dbo",
      timestamps: false
    }
  );
};
