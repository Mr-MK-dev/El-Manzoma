const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TraineeShipCollectionPivot",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      TraineeShipID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      CollectionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "TraineeShipCollectionPivot",
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
