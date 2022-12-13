const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RecStages",
    {
      ID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RecStages",
      schema: "dbo",
      timestamps: false
    }
  );
};
