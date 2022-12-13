const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OrganizationPlanUnit",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },

      PackagePlanID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
        ArrivalPoint: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
        CenteringPoint: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
        Siasa: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        Mawgod: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        PackagingMoratab: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        AbsenetPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
        TotalRequired: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
         AssignedPerPlan: {
        type: DataTypes.INTEGER,
        allowNull: true
      },


    },
    {
      sequelize,
      tableName: "OrganizationPlanUnit",
      schema: "dbo",
      timestamps: false
    }
  );
};
