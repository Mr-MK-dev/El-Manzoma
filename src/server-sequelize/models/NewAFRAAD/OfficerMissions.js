const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OfficerMissions",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      MissionID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID: {
        type: DataTypes.INTEGER,
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
      tableName: "OfficerMissions",
      schema: "dbo",
      timestamps: false
    }
  );
};
