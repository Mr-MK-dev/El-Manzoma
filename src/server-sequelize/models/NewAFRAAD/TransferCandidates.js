const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferCandidates",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      OutOfJob: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Checked: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferCandidates",
      schema: "dbo",
      timestamps: false
    }
  );
};
