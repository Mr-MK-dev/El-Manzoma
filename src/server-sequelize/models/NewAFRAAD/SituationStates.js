const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SituationStates",
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
      tableName: "SituationStates",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_SituationStates",
      //     unique: true,
      //     fields: [
      //       { name: "SituationID" },
      //     ]
      //   },
      // ]
    }
  );
};
