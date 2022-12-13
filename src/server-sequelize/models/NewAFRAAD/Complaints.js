const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Complaints",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IncomingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      PresentingDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      IncomingRegion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Complainant: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Complaints",
      schema: "dbo",
      timestamps: false
    }
  );
};
