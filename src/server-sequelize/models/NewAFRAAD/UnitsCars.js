const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "UnitsCars",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      CarNumber: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      DocNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DocNumber2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ChassetNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      ReleaseDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DocDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DocDate2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CarColorID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CarTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SideID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DestID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CarUsageID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SubClassID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CarCargoID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CarPreparationID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      OldUnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DocNumber3:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DocDate3:{
        type:DataTypes.STRING,
        allowNull : true
      }
    },
    {
      sequelize,
      tableName: "UnitsCars",
      schema: "dbo",
      timestamps: false
    }
  );
};
