const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitSignals",
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
      SignalWeaponID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      SignalWeaponTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TotalSignalWeapons: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "UnitSignals",
      schema: "dbo",
      timestamps: false
    }
  );
};
