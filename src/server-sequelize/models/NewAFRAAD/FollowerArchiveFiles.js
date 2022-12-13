const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowerArchiveFiles",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ArchiveNum: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      SequenceNum: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      FilePath: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {
      sequelize,
      tableName: "FollowerArchiveFiles",
      schema: "dbo",
      timestamps: false
    }
  );
};
