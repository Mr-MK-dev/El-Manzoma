const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Situations",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      SituationID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SituationStates",
          key: "SituationID"
        }
      },
      SituationNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Contnuity: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      TakenAction: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Situations",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Situations_1",
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
