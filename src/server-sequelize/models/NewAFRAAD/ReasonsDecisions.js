const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ReasonsDecisions",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Reason: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "ReasonsDecisions",
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
