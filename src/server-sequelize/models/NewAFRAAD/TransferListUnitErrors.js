const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferListUnitErrors",
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
      JobID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Count: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "TransferListUnitErrors",
      schema: "dbo",
      timestamps: false
    }
  );
};
