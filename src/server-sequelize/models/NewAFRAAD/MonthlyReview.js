const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MonthlyReview",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DateOfMonthlyReview: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: "0",
        field: "isFilled"
      }
    },
    {
      sequelize,
      tableName: "MonthlyReview",
      schema: "dbo",
      timestamps: false
    }
  );
};
