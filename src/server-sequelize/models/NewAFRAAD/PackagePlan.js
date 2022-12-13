const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PackagePlan",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      recuEndDateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      recuEndDateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(4000),
        allowNull: true
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isCompletePlanFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isOrganizationPlanFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isDateFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "PackagePlan",
      schema: "dbo",
      timestamps: false
    }
  );
};
