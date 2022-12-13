/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "InternalFollowUp",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID_KEY:"
      },
      DeadLine: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Date"
      },
      GroupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Subject: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Subject"
      },
      BranchResponse: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "BranchResponse"
      },
      ManagerResponse: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "ManagerResponse"
      },

      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: "IsFollowed"
      },
      isFinished: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      tableName: "InternalFollowUp",
      timestamps: false
    }
  );
};
