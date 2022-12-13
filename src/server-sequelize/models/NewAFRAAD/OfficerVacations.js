const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OfficerVacations",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      VacationID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isAnnual: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isOccasional: {
        type:  DataTypes.BOOLEAN,
        allowNull: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      DateTo: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "OfficerVacations",
      schema: "dbo",
      timestamps: false
    }
  );
};
