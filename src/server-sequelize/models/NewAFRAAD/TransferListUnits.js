const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransferListUnits",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      TransferListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isRasisingEfficiency: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      MinimumHighRatedRequirement: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      MaximumHighRatedRequirement: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10
      },
      NeededHighRateb: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "TransferListUnits",
      schema: "dbo",
      timestamps: false
    }
  );
};
