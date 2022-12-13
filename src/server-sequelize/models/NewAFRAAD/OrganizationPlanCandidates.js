const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OrganizationPlanCandidates",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SoldierID: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      PackageID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      PackagedUnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "OrganizationPlanCandidates",
      schema: "dbo",
      timestamps: false
    }
  );
};
