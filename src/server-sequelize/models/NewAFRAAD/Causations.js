const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Causations",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ReasonStatus: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ReasonOrder: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ReasonSummary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DateOfDecisions: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      RecuStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      RecuEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      DateOfIncident: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      IncidentPlace: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IncidentNotes: {
        type: DataTypes.STRING(4000),
        allowNull: true
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isPapersCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Causations",
      schema: "dbo",
      timestamps: false
    }
  );
};
