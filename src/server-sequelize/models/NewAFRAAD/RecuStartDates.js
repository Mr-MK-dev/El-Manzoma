const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RecuStartDates",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RecuStage: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      RecuDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "RecuStartDates",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_RecuStartDates_1",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //       { name: "SituationID" },
      //     ]
      //   },
      // ]
    }
  );
};
