const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebsMedicalSituations",
    {
      SituationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Situation: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SituationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Continuity: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      TakenAction: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RatebsMedicalSituations",
      schema: "dbo",
      timestamps: false
    }
  );
};
