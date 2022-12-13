const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PsychologicalRequests",
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
      DateOfEntrance: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      HospitalID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
        FollowUpPartyID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      FollowStatus: {
        type: DataTypes.STRING,
        allowNull: true
      },
        SelectorIndicators: {
          type: DataTypes.STRING,
            allowNull: true
        },
        Recommendation: {
            type: DataTypes.STRING,
            allowNull: true
        },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      IllnessType: {
        type: DataTypes.STRING,
        allowNull: true
      },
        StatusType: {
            type: DataTypes.STRING,
            allowNull: true
        },
      CommitteeDecision: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Punishment: {
        type: DataTypes.STRING,
        allowNull: true
      },
        DisplayResult: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
      sequelize,
      tableName: "PsychologicalRequests",
      schema: "dbo",
      timestamps: false
    }
  );
};
