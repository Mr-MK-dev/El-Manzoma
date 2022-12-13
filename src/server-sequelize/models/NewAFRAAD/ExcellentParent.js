const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "ExcellentParent",
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
      isHonor: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      HonorYear: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      ParentName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Place: {
        type: DataTypes.STRING,
        allowNull: true
      },
      RejectNotes: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Honor: {
        type: DataTypes.STRING,
        allowNull: true
      },
      HonoringLevel: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isReject: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      ParentType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Notes: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "ExcellentParent",
      schema: "dbo",
      timestamps: false
    }
  );
};
