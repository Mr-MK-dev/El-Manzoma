const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "LowLevels",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Decision: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Diagnosis: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "LowLevels",
      schema: "dbo",
      timestamps: false
    }
  );
};
