const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Jobs",
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
      },
      isCritical: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isCritical"
      }
    },
    {
      sequelize,
      tableName: "Jobs",
      schema: "dbo",
      timestamps: false
    }
  );
};
