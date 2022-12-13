const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "TransferAllocation",
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
      ReasonType: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ReasonID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DecisionNotes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      createdAt: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferAllocation",
      schema: "dbo",
      timestamps: false
    }
  );
};
