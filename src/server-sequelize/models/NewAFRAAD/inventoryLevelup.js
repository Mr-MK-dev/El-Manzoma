const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "inventoryLevelup",
    {
        ID_KEY: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true,
        primaryKey: true
      },
      akdmia: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      hafza: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "inventoryLevelup",
      schema: "dbo",
      timestamps: false
    }
  );
};
