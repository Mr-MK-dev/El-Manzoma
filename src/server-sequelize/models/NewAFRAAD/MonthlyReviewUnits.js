const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MonthlyReviewUnits",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Delegate: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      Reviewer: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      DateOfReview: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MonthlyReviewUnits",
      schema: "dbo",
      timestamps: false
    }
  );
};
