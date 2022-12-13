const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PunishmentTypes",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Difficulties: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isRenewBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
       periodInDays: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "PunishmentTypes",
      schema: "dbo",
      timestamps: false
    }
  );
};
