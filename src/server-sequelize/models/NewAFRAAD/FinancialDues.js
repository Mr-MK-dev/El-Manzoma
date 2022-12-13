const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FinancialDues",
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
      PrivateInsuranceFund: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SupplementaryFund: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      InsuranceAndPensions: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      MedicalInsurance: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      SarfState: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "FinancialDues",
      schema: "dbo",
      timestamps: false
    }
  );
};
