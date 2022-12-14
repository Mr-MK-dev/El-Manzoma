const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "followerwork",
    {
      idwork: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      workplace: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      wokel7aq: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      PrimaryPowerSoldier: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      LeaderCertification: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PrimaryPowerRateb: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ordernum: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "followerwork",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_followerwork",
      //     unique: true,
      //     fields: [
      //       { name: "idwork" },
      //     ]
      //   },
      // ]
    }
  );
};
