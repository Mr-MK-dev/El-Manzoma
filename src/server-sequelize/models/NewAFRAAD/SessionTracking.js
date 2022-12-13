const Devices = require("./Devices");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "SessionTracking",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "userId"
      },
      IP: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "IP"
      },
      MAC: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "MAC"
      },
      SessionStartDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SessionStartDate"
      },
      SessionEndtDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SessionEndtDate"
      }
    },
    {
      tableName: "SessionTracking",
      timestamps: false
    }
  );
};
