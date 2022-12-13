const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ColorPalettes",
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
      Palette: {
        type: DataTypes.STRING(4000),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "ColorPalettes",
      schema: "dbo",
      timestamps: false
    }
  );
};
