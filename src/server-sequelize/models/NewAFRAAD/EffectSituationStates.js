const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "EffectSituationStates",
    {
      SituationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Situation: {
        type: DataTypes.STRING(250),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "EffectSituationStates",
      schema: "dbo",
      timestamps: false
    }
  );
};
