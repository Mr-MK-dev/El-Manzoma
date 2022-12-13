const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FittingRules",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      AgeFrom: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      AgeTo: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DifferenceFrom: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DifferenceTo: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "FittingRules",
      schema: "dbo",
      timestamps: false
    }
  );
};
