const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "AdditionsWorkPlacesFollowers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      WorkPlaceAdditionsID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(500),
        allowNull: true
      },

    },
    {
      sequelize,
      tableName: "AdditionsWorkPlacesFollowers",
      schema: "dbo",
      timestamps: false
    }
  );
};
