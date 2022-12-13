const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "reviewPlanListDetails",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      reviewPlanID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TasgelReviewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TasgelReviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      TasgelReviewer: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TasgelNotes: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      EnrollersReviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      EnrollersNotes: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      EnrollersReviewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      EnrollersReviewer: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      HighReviewed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      HighNotes: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      HighReviewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      HighReviewer: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "reviewPlanListDetails",
      schema: "dbo",
      timestamps: false
    }
  );
};
