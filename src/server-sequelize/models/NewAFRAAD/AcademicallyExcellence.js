const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "AcademicallyExcellence",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Type: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Honor: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isHonor: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      HonoringLevel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HonorYear: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ChildName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      DegreeType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Degree: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Percent: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isReject: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      RejectNotes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "AcademicallyExcellence",
      schema: "dbo",
      timestamps: false
    }
  );
};
