const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RecuEndDates",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      EndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "RecuEndDates",
      schema: "dbo",
      timestamps: false
    }
  );
};
