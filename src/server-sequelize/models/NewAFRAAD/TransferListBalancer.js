const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferListBalancer",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Category: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Supply: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      itemsNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferListBalancer",
      schema: "dbo",
      timestamps: false
    }
  );
};
