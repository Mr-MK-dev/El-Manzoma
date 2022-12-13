const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SMRecommandations",
    {
      IDKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      ID: {
        type: DataTypes.STRING(16),
        allowNull: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuRigion: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Recommander: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      SecondRecommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RecentWeapon: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitName: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Certificator: {
        type: DataTypes.STRING(100),
        allowNull: true,
        primaryKey: true
      },
      ExclusionNotes: {
        type: DataTypes.STRING(300),
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
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      Exclusion: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      isUnitFollow: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      latterHasSent: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      FinalResult: {
        type: DataTypes.STRING(200),
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
      tableName: "SMRecommandations",
      schema: "dbo",
      timestamps: false
    }
  );
};
