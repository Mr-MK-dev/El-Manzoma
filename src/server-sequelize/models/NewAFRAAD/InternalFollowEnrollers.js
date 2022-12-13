module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "InternalFollowEnrollers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "ID_KEY:"
      },
      Subject: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      WhatsDone: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      Expected: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      tableName: "InternalFollowEnrollers",
      timestamps: false
    }
  );
};
