/* jshint indent: 1 */
const Sequelize = require("sequelize");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Calendars",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: "Id"
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CalendarTypes",
          key: "Id"
        },
        field: "TypeId"
      },
      alarmId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CalendarAlarms",
          key: "Id"
        },
        field: "AlarmId"
      },
      degreeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "CalendarDegrees",
          key: "Id"
        },
        field: "DegreeId"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Name"
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "Description"
      },
      start: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "Start",
        get() {
          const v = this.getDataValue("start");
          return new Date(v).toISOString().substring(0, 10);
        }
      },
      end: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "End",
        get() {
          const v = this.getDataValue("end");
          return new Date(v).toISOString().substring(0, 10);
        }
      },
      addedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users_",
          key: "UserId"
        },
        field: "AddedBy"
      },
      sectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "UsersGroups",
          key: "ID_KEY"
        },
        field: "SectionId"
      }
    },
    {
      sequelize,
      schema: "dbo",
      tableName: "Calendars",
      timestamps: false
    }
  );
};
