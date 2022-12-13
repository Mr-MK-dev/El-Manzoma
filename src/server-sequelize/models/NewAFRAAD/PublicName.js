const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PublicName",
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
      PublicName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      PrevPublicName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "PublicName",
      schema: "dbo",
      timestamps: false
    }
  );
};
