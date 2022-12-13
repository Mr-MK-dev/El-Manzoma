const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "VicealesManagment",
      {
          ID_KEY: {
              type: DataTypes.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true
          },
          VicealeName: {
              type: DataTypes.STRING(100),
              allowNull: true,
          },
          DriversNumber: {
              type: DataTypes.STRING(100),
              allowNull: true,
          },
          IsSpecialized: {
             type: DataTypes.BOOLEAN,
             allowNull: true,
       }
    },
    {
      sequelize,
      tableName: "VicealesManagment",
      schema: "dbo",
      timestamps: false
    }
  );
};
