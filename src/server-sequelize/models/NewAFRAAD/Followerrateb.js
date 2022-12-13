const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Followerrateb",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      Orderoffolwer: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      followplace: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      workplace: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Suputer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      notes: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      isRecommended: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isSelected: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isTrainingOrder: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isIllegal: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Recommender: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      uintid: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TarekhElhak: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isEnrolled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      },
      FollowerDuty: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      AlarmNotes: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      FollowerEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      AlarmDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      FollowerEndCause: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      OrderOfEndFollower: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Followerrateb",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Followerrateb",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
