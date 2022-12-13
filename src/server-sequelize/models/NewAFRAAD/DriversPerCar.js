const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "DriversPerCar",
      {
          ID_KEY: {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
          CarUsageID: {
              type: DataTypes.INTEGER,
              allowNull: true,
          },
          DriversNumber: {
              type: DataTypes.STRING(100),
              allowNull: true,
          },
          IsSpecialized: {
             type: DataTypes.BOOLEAN,
             allowNull: true,
          },
          UnitIDs: {
              type: DataTypes.STRING,
              allowNull: true
          },

    },
    {
      sequelize,
      tableName: "DriversPerCar",
      schema: "dbo",
      timestamps: false
    }
  );
};
