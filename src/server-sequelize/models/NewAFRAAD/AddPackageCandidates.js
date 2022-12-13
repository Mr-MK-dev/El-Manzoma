const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "AddPackageCandidates",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      SoldierID: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      PackageID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
        PackagedUnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "AddPackageCandidates",
      schema: "dbo",
      timestamps: false
    }
  );
};
