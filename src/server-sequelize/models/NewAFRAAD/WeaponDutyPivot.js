const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "WeaponDutyPivot",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      DutyID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Duty",
          key: "DutyID"
        }
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Weapon",
          key: "WeaponID"
        }
      }
    },
    {
      sequelize,
      tableName: "WeaponDutyPivot",
      schema: "dbo",
      timestamps: false
    }
  );
};
