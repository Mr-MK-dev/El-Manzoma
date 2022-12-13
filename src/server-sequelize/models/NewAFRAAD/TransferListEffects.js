const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferListEffects",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(200),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransferListEffects",
      schema: "dbo",
      timestamps: false
    }
  );
};
