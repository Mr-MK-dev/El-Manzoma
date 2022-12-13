const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Diseases",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Diseases",
      schema: "dbo",
      timestamps: false
    }
  );
};
