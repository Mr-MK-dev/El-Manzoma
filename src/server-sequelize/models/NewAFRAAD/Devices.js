/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Devices",
    {
      Mac: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "Devices",
      timestamps: false
    }
  );
};
