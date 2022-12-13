const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "KsasVolunteersProcedures",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      VolunteerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      FieldName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      FieldID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FieldValue: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "KsasVolunteersProcedures",
      schema: "dbo",
      timestamps: false
    }
  );
};
