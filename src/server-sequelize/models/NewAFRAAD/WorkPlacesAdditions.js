
const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "WorkPlacesAdditions",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      WorkPlaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "WorkPlacesAdditions",
      schema: "dbo",
      timestamps: false
    }
  );
};
