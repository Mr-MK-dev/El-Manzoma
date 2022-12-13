const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitSystems",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SystemID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Stage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TotalSystems: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitSystems",
      schema: "dbo",
      timestamps: false
    }
  );
};
