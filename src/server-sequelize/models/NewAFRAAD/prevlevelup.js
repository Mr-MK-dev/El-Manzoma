const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "prevlevelup",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      count: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      id: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      level: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      date_level: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "prevlevelup",
      schema: "dbo",
      timestamps: false
    }
  );
};
