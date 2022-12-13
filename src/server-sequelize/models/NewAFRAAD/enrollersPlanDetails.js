const Sequelize = require("sequelize");
// const { TRUE } = require("node-sass");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "enrollersPlanDetails",
    {
      ID_KEY: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      EnrollersPlanID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      WorkPlaceID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      CertfiedNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      AvailableSlots: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "enrollersPlanDetails",
      schema: "dbo",
      timestamps: false
    }
  );
};
