const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Requests",
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
      RecommendedUnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Note: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isCertified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
        field: "isCertified"
      }
    },
    {
      sequelize,
      tableName: "Requests",
      schema: "dbo",
      timestamps: false
    }
  );
};
