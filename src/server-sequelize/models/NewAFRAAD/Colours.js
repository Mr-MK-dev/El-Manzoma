const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Colours",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      hex: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      rgb: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Colours",
      schema: "dbo",
      timestamps: false
    }
  );
};
