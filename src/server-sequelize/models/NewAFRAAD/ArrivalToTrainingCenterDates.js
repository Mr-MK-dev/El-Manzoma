const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ArrivalToTrainingCenterDates",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      HighDateArrival: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      AboveAvgDateArrival: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      AvgDateArrival: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      NormalDateArrival: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      HighDateLeave: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      AboveAvgDateLeave: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      AvgDateLeave: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      NormalDateLeave: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "ArrivalToTrainingCenterDates",
      schema: "dbo",
      timestamps: false
    }
  );
};
