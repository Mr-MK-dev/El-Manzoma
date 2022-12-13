const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "RatebPenalities",
    {
      IDKEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      ID: {
        type: DataTypes.STRING,
        allowNull: true,
        type: DataTypes.STRING(100),
        references: {
          model: "Rateb",
          key: "ID"
        }
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true
      },
      crimeText: {
        type: DataTypes.STRING,
        allowNull: true
      },
      crimeFromDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      crimeToDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      periodInDays: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order: {
        type: DataTypes.STRING,
        allowNull: true
      },
      kind: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // ordererId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "WebPenalityOrderers",
      //     key: "Id"
      //   },
      //   field: "OrdererId"
      // },
      // kindId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "WebPenalityKinds",
      //     key: "Id"
      //   },
      //   field: "KindId"
      // },
      withSalaryCut: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      fromDate: {
        type: DataTypes.STRING,
        allowNull: true
      },

      PunishmentTypeID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      toDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orderNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orderDate: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      // typeId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: "WebPenalityTypes",
      //     key: "Id"
      //   },
      //   field: "TypeId"
      // },
      isCourt: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      courtDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      courtPlace: {
        type: DataTypes.STRING,
        allowNull: true
      }
      // courtPlaceId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: "WebCourtPlaces",
      //     key: "Id"
      //   },
      //   field: "CourtPlaceId"
      // }
    },
    {
      tableName: "RatebPenalities",
      sequelize,
      schema: "dbo",
      timestamps: false
    }
  );
};
