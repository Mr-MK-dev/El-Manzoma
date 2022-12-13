const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "WorkPlaceMainPower",
    {
      ID_KEY:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      WorkPlaceID:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID:{
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type:{
        type: DataTypes.STRING(100),
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "WorkPlaceMainPower",
      schema: "dbo",
      timestamps: false
    }
  );
};