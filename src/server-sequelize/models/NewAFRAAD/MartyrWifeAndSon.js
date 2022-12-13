const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MartyrWifeAndSon",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      MilitaryType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Kind: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      WifeName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Sons: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      Daughters: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      Address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ChildName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ChildKind: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ChildNationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      NationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tele: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MartyrWifeAndSon",
      schema: "dbo",
      timestamps: false
    }
  );
};
