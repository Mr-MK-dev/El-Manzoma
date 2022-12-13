const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Obligations",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Obligation: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      DateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      DateTo: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Obligations",
      schema: "dbo",
      timestamps: false
    }
  );
};
