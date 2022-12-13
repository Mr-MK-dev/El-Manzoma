const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "TransportLicense",
    {
      TransportLicenseID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Weapon",
          key: "WeaponID"
        }
      },
      SoldierIDS: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "TransportLicense",
      schema: "dbo",
      timestamps: false
    }
  );
};
