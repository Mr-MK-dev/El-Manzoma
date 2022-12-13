/* jshint indent: 1 */
const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "CalendarAlarms",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      displayedText: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "DisplayedText"
      }
    },
    {
      sequelize,
      schema: "dbo",
      tableName: "CalendarAlarms",
      timestamps: false
    }
  );
};
