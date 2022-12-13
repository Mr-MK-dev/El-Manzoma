const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TraineeShipCollection",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "TraineeShipCollection",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_City",
      //     unique: true,
      //     fields: [
      //       { name: "CityID" },
      //     ]
      //   },
      // ]
    }
  );
};
