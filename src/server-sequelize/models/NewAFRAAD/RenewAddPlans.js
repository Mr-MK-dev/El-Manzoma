const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RenewAddPlans",
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
      RenewListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      RenewType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      isChecked: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(500),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "RenewAddPlans",
      schema: "dbo",
      timestamps: false
    }
  );
};
