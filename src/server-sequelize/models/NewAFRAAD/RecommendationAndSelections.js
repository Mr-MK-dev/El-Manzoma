const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RecommendationAndSelections",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      tripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OfficerSoldierStatus: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuRigion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OfficerSoldierRecommendation: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WeaponRecommendation: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      weaponRecommendations: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SecondRecommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Specialization: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      // Certificator: {
      //   type: DataTypes.STRING(100),
      //   allowNull: true
      // },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      GeneralNotes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OfficerSoldierResult: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ExclusionNotes: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      WeaponResult: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      isCertificated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      Exclusion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      willContinuo: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      officerLatterHasSent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      weaponLatterHasSent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      DegreeOfImportance: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Government: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DateAdded: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RecommendationAndSelections",
      schema: "dbo",
      timestamps: false
    }
  );
};
