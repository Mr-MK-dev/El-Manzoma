const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OutOfRenew",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Reasons: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: 0
      },
      RenewType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 0
      },
      RenewListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "OutOfRenew",
      schema: "dbo",
      timestamps: false
    }
  );
};
