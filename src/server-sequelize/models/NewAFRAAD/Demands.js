const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Demands",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      MilitaryType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Kind: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Replier: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Demands: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Decision: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Demands",
      schema: "dbo",
      timestamps: false
    }
  );
};
