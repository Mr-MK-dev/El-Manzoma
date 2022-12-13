const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ActionsTaken",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
        actionsTakenID: {
           type: DataTypes.INTEGER,
           allowNull: false
       },
      ActionsTaken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DateOfActionsTaken: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Executed: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "ActionsTaken",
      schema: "dbo",
      timestamps: false
    }
  );
};
