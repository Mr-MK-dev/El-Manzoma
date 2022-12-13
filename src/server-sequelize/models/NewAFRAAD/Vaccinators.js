const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Vaccinators",
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
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      VaccineID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      DiseaseID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      VaccineDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Vaccinators",
      schema: "dbo",
      timestamps: false
    }
  );
};
