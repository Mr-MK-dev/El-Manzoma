const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "security",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      id: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      security: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      decision: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "security",
      schema: "dbo",
      timestamps: false
    }
  );
};
