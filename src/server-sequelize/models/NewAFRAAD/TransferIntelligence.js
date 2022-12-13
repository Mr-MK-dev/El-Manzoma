const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferIntelligence",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RecommendedUnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RecommenderName: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      dateOfRecommendation: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isCertified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isHidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferIntelligence",
      schema: "dbo",
      timestamps: false
    }
  );
};
