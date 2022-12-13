const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TravalTable",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      isDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      ID: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      TravalDistination: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TravalType: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TravalDateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      TravalDateTo: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Travalintadab: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AmanaNum: {
        type: DataTypes.TEXT,
        allowNull: true
      },
        Status: {
          type: DataTypes.STRING(100),
          allowNull: true
        }
    },
      {
      sequelize,
      tableName: "TravalTable",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_TravalTable",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
