const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SystemRules",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Key: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      Value: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "SystemRules",
      schema: "dbo",
      timestamps: false
    }
  );
};
