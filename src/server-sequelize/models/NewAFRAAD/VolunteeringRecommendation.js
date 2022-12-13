const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "VolunteeringRecommendation",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true
      },
      thirdnumber: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      FileNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      BatchNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      NationalID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      RecRegion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecommenderName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SecondRecommenderName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      IsVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "VolunteeringRecommendation",
      schema: "dbo",
      timestamps: false
    }
  );
};
