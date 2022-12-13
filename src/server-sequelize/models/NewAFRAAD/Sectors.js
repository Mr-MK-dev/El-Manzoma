const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Sectors",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "State"
      }
    },
    {
      sequelize,
      tableName: "Sectors",
      schema: "dbo",
      timestamps: false
    }
  );
};
