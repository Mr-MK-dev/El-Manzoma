const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitEffecs",
    {
      effetId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ID: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      increment: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      descrption: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitEffecs",
      schema: "dbo",
      timestamps: false
    }
  );
};
