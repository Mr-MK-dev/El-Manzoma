const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowingAreas",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      State: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "1",
        field: "State"
      }
    },
    {
      sequelize,
      tableName: "FollowingAreas",
      schema: "dbo",
      timestamps: false
    }
  );
};
