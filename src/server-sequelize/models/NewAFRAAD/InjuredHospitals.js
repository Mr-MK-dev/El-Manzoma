const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "InjuredHospitals",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      HospitalID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      InjuredStatusDescription: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      IncidentSummary: {
        type: DataTypes.STRING(4000),
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      EnterDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
        EntryDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        LeaveDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    },
    {
      sequelize,
      tableName: "InjuredHospitals",
      schema: "dbo",
      timestamps: false
    }
  );
};
