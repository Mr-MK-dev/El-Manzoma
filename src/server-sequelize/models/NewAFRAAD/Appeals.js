const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Appeals",
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
      AppealTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AppealIncomingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      AppealPresentingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      AppealNumber: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      JudgementYear: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AppealOrders: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      JudicialCommitteeProceduralDecisions: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FinalBranchJudicialCommitteeDecisions: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FinalHighJudicialCommitteeDecisions: {
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
      tableName: "Appeals",
      schema: "dbo",
      timestamps: false
    }
  );
};
