const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MedicalRequests",
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
      Diagnosis: {
        type: DataTypes.STRING,
        allowNull: true
      },
      MedicineCost: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HospitalID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      CareDuration: {
        type: DataTypes.STRING,
        allowNull: true
      },
      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      RefundedAmount: {
        type: DataTypes.STRING,
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
      }
    },
    {
      sequelize,
      tableName: "MedicalRequests",
      schema: "dbo",
      timestamps: false
    }
  );
};
