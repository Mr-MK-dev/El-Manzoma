const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ArchiveFileFollowers",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ArchiveFileID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "ArchiveFileFollowers",
      schema: "dbo",
      timestamps: false
    }
  );
};
