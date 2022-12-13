const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TraineeShip",
    {
      TraineeShipID: {
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
      tableName: "TraineeShip",
      schema: "dbo",
      timestamps: false
    }
  );
};
