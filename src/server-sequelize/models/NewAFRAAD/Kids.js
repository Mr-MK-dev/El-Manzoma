const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Kids",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      MomID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      KidName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      KidType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      KidNationalID: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Kids",
      schema: "dbo",
      timestamps: false
    }
  );
};
