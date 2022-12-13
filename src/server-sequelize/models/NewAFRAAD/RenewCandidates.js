const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RenewCandidates",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RenewListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isAgree: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      isHasRecommendation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      MedicalSituation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      CandidateGrade: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RenewType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RenewDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Requirements: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RenewCandidates",
      schema: "dbo",
      timestamps: false
    }
  );
};
