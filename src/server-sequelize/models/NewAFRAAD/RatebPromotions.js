const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebPromotions",
    {
      IDKEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: true,
        type: DataTypes.STRING(100),
        references: {
          model: "Rateb",
          key: "ID"
        }
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ""
      },
      degree: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ""
      },
      date: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ""
      },
      orderNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ""
      },
      orderDate: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: ""
      }
    },
    {
      tableName: "RatebPromotions",
      sequelize,
      schema: "dbo",
      timestamps: false
    }
  );
};
