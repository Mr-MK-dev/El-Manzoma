const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowUpParty",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "FollowUpParty",
      schema: "dbo",
      timestamps: false
    }
  );
};
