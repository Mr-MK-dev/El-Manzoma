module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "DepartmentsInternalFollow",
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
      DepartmentType: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      AlarmNotes: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      EndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      AlarmDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: "DepartmentsInternalFollow",
      timestamps: false
    }
  );
};
