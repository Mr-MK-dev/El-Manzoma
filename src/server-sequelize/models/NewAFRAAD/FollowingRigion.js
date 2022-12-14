const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "FollowingRigion",
    {
      FollowRigionID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      FollowRigionName: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "FollowingRigion",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_FollowingRigion",
      //     unique: true,
      //     fields: [
      //       { name: "FollowRigionID" },
      //     ]
      //   },
      // ]
    }
  );
};
