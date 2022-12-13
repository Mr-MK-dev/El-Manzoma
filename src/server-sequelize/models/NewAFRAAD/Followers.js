const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Followers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      WorkPlaceID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FollowingOrder: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      FollowingRecommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Acceptance: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isRecommended: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isSelected: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Exclusion: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      ExclusionNotes: {
        type: DataTypes.STRING(300),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tripleNo: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DegreeOfImportance: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DemandedJob: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Followers",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Followers",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "FollowRigionID" },
      //       { name: "FollowingOrder" },
      //       { name: "FollowingRecommender" }
      //     ]
      //   }
      // ]
    }
  );
};
