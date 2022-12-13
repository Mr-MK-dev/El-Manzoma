const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OfficerSoldierRecommendation",
    {
      RecommendationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      tripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Recommended: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Status: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DegreeOfImportance: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "OfficerSoldierRecommendation",
      schema: "dbo",
      timestamps: false
    }
  );
};
