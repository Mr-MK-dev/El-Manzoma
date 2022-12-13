const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitBoats",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      BoatID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TotalBoats: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "UnitBoats",
      schema: "dbo",
      timestamps: false
    }
  );
};
