const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Wives",
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
      WifeAddress: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WifeNationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      WifeTele: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SocialState: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Wives",
      schema: "dbo",
      timestamps: false
    }
  );
};
