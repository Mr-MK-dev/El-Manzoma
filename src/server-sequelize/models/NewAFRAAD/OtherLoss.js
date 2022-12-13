const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OtherLoss",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OtherLossTypeID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      AccidentID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      IsReturned: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Reason: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "OtherLoss",
      schema: "dbo",
      timestamps: false
    }
  );
};
