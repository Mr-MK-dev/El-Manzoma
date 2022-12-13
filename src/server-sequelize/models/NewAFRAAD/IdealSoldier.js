const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "IdealSoldier",
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
      Type: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Honor: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DateOfHonor: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "IdealSoldier",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_followersolider",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
