const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Hajj",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      MilitaryType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Kind: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      grantee: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      granteeName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Hajj",
      schema: "dbo",
      timestamps: false
    }
  );
};
