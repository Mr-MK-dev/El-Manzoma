const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "HighLevelWeaponManagement",
    {
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Weapon: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "HighLevelWeaponManagement",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Weapon",
      //     unique: true,
      //     fields: [
      //       { name: "WeaponID" },
      //     ]
      //   },
      // ]
    }
  );
};
