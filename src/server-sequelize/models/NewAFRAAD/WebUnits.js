const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "WebUnits",
    {
      IDKEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: true,
        type: DataTypes.STRING(100),
        references: {
          model: "Rateb",
          key: "ID"
        }
      },
      UnitText: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Date: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "WebUnits",
      sequelize,
      schema: "dbo",
      timestamps: false
    }
  );
};
