const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OfficerDuty",
    {
      OfficerDutyID: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      OfficerDuty: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "OfficerDuty",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_OfficerDuty",
      //     unique: true,
      //     fields: [
      //       { name: "OfficerDutyID" },
      //     ]
      //   },
      // ]
    }
  );
};
