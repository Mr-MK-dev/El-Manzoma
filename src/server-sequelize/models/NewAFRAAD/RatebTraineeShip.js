const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebTraineeShip",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      id: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      TraineeShipID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TraineeShip",
          key: "TraineeShipID"
        }
      },
      count: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      grade: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      degree: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      place: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_from: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      date_to: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RatebTraineeShip",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_tahel",
      //     unique: true,
      //     fields: [
      //       { name: "count" },
      //     ]
      //   },
      // ]
    }
  );
};
