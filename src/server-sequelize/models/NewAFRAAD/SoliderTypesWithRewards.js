const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SoliderTypesWithRewards",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Reward: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "SoliderTypesWithRewards",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_City",
      //     unique: true,
      //     fields: [
      //       { name: "CityID" },
      //     ]
      //   },
      // ]
    }
  );
};
