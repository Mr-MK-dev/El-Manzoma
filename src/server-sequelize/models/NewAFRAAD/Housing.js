const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Housing",
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
      Papers: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Customize: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Beneficiary: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BeneficiaryName: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      BeneficiaryPhoneNumber: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Place: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING(1000),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Housing",
      schema: "dbo",
      timestamps: false
    }
  );
};
