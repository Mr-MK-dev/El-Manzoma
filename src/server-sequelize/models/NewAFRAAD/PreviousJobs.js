const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PreviousJobs",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      JobID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RatebDegreeFromSpecialist: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RatebDegreeFromUnitLeader: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RatebDegreeFromBranchHead: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      WorkStatus: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "PreviousJobs",
      schema: "dbo",
      timestamps: false
    }
  );
};
