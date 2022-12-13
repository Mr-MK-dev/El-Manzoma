const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Recommendations",
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
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      firstDesire: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      secondDesire: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      thirdDesire: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ExclusionNotes: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      RecuRigion: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      SecondRecommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Government: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      FinalResult: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      UnitDirection: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      soldierDirection: {
        type: DataTypes.STRING(7),
        allowNull: true
      },
      Certification: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Exclusion: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isUnitFollow: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Matching: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      CountRecommendations: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Degree: {
        type: DataTypes.STRING(1),
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
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Specialization: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      DateAdded: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Recommendations",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Revommendations",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "UnitID" },
      //       { name: "Recommender" },
      //       { name: "Certificator" },
      //     ]
      //   },
      // ]
    }
  );
};
