const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "tahel",
    {
      count: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      id: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      leavel: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      date_from: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      date_to: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      degree: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      TahelCourseID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "tahel",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_tahel",
      //     unique: true,
      //     fields: [
      //       { name: "count" },
      //     ]
      //   },
      // ]
    }
  );
};
