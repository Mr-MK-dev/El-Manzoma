/* jshint indent: 1 */
const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "CalendarDegrees",
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
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Color"
      }
    },
    {
      sequelize,
      schema: "dbo",
      tableName: "CalendarDegrees",
      timestamps: false
    }
  );
};
