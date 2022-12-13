const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "NewComersRequests",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      Applicant: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Subject: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DateOfAppeal: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      DateOfEnd: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      isCertified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 1
      },
      PartyID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "NewComersRequests",
      schema: "dbo",
      timestamps: false
    }
  );
};
