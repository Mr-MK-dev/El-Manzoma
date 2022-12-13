const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "NotMatchedWeapon",
    {
      IDKey: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuRigion: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(12),
        allowNull: true
      },
      WeaponIDs: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Recommander: {
        type: DataTypes.STRING(120),
        allowNull: true
      },
      SelectedWeapon: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitName: {
        type: DataTypes.STRING(200),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "NotMatchedWeapon",
      schema: "dbo",
      timestamps: false
    }
  );
};
