const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferListJobBlancer",
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
      Details: {
        type: DataTypes.STRING("max"),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferListJobBlancer",
      schema: "dbo",
      timestamps: false
    }
  );
};
