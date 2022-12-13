const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "GeneralRequests",
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
      RequestType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RequestBeneficial: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DateOfRequest: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      IsVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      VerificationNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      VerificationDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      SecretariatVerification: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Result: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      spentAmount: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "GeneralRequests",
      schema: "dbo",
      timestamps: false
    }
  );
};
