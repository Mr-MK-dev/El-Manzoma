const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferList",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      DateOfTransferList: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isFilled"
      },
      TimeStart: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "0"
      },
      TimeFirstSergant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: "0"
      },
      Notes: {
        type: DataTypes.STRING(4000),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferList",
      schema: "dbo",
      timestamps: false
    }
  );
};
