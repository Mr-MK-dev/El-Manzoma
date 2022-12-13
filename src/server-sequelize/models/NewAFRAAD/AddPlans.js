const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "AddPlans",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      isChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "AddPlans",
      schema: "dbo",
      timestamps: false
    }
  );
};
