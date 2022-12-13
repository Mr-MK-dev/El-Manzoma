const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Honors",
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
      HonorPlace: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Honor: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      grantee: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      granteeName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Honors",
      schema: "dbo",
      timestamps: false
    }
  );
};
