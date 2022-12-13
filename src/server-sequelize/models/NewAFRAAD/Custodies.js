const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Custodies",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CustodyTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Custody: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IncomingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      ReportDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      DescisionMade: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      AppealOrders: {
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
      }
    },
    {
      sequelize,
      tableName: "Custodies",
      schema: "dbo",
      timestamps: false
    }
  );
};
