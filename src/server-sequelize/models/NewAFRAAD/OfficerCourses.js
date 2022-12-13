const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "OfficerCourses",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      CourseID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DateFrom: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      DateTo: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "OfficerCourses",
      schema: "dbo",
      timestamps: false
    }
  );
};
