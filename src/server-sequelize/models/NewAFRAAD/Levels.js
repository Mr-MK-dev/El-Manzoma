const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Levels",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Level: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Levels",
      schema: "dbo",
      timestamps: false
    }
  );
};
