const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Fittings",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      Height: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      Weight: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      Difference: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      DateAdded: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      WeightedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Fit: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "Fit"
      },
      Excluded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "Excluded"
      },
      RATEB_ID: {
        type: DataTypes.STRING(100),
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: "Fittings",
      schema: "dbo",
      timestamps: false
    }
  );
};
