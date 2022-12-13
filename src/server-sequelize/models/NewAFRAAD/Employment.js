const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Employment",
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
      MilitaryType: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Kind: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      PapersExist: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      EmploymentState: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      grantee: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      granteeName: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      WorkPlace: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      Notes: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Employment",
      schema: "dbo",
      timestamps: false
    }
  );
};
