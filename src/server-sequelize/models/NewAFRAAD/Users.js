/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "username"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "password"
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "Role"
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "UserId"
      },
      randomKey: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "randomKey"
      },
      realName: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "RealName"
      },
      degree: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Degree"
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1,2",
        field: "section"
      },
      permissions: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1,2",
        field: "permissions"
      },
      deletePermissions: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1,2",
        field: "deletePermissions"
      },
      dateAdded: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "DateAdded"
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isAdmin"
      },
      canEdit: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: "1",
        field: "canEdit"
      },
      canEditRateb: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: "1",
        field: "canEditRateb"
      },
      isVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "isVisible"
      },
      canUnfollow: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "CanUnfollow"
      },
      canAddFollowup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: "0",
        field: "CanAddFollowup"
      },
      GroupIds: {
        type: DataTypes.STRING,
        allowNull: true
      },
      forceClose: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "Users_",
      timestamps: false
    }
  );
};
