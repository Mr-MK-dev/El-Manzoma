const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Investigations",
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
      DateOfInvestigation: {
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
      IncidentSummary: {
        type: DataTypes.STRING(4000),
        allowNull: true
      },
      Action: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AnotherSuspects: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Penalty: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Laws: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
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
      tableName: "Investigations",
      schema: "dbo",
      timestamps: false
    }
  );
};
