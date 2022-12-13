const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "PrivatePages",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      PageID: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
    },
    {
      sequelize,
      tableName: "PrivatePages",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Brothers",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
