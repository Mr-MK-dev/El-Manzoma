const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RenewList",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      DateOfRenewList: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: "0",
        field: "isFilled"
      }
    },
    {
      sequelize,
      tableName: "RenewList",
      schema: "dbo",
      timestamps: false
    }
  );
};
