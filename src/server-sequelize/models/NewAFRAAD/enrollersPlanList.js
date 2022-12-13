const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "enrollersPlanList",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      isFilled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isFilled"
      }
    },
    {
      sequelize,
      tableName: "enrollersPlanList",
      schema: "dbo",
      timestamps: false
    }
  );
};
