const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SignalWeapons",
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
      TypeID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "SignalWeapons",
      schema: "dbo",
      timestamps: false
    }
  );
};
