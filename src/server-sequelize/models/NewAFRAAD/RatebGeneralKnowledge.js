const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebGeneralKnowledge",
    {
      RatebGeneralKnowledgeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      Description: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      CreatedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      LevelOfImportance: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RatebGeneralKnowledge",
      schema: "dbo",
      timestamps: false
    }
  );
};
