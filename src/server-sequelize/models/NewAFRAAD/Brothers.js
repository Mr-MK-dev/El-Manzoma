const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Brothers",
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
      BrotherMilitaryID: {
        type: DataTypes.STRING(13),
        allowNull: true
      },
      Brothers: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      BNotes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Brothers",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Brothers",
      //     unique: true,
      //     fields: [
      //       { name: "ID" },
      //     ]
      //   },
      // ]
    }
  );
};
