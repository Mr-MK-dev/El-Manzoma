const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "NewComersArrivals",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      RecuRegion: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      KnowledgeLevel: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        primaryKey: true
      },
      NumberofArrivals: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.STRING(50),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "NewComersArrivals",
      schema: "dbo",
      timestamps: false
    }
  );
};
