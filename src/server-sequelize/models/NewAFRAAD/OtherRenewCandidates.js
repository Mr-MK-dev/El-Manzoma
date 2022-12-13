const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OtherRenewCandidates",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RatebID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RenewType: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: 0
      },
      RenewListID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      isRenewDone: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      Requirement: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "OtherRenewCandidates",
      schema: "dbo",
      timestamps: false
    }
  );
};
