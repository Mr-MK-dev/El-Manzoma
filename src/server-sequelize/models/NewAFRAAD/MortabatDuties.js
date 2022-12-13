const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "MortabatDuties",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
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
      },
      Category: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      Level: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      ServiceType: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      Moratab: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      Siasa: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      SoldiersCompletenessPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RatebsCompletenessPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "MortabatDuties",
      schema: "dbo",
      timestamps: false
    }
  );
};
