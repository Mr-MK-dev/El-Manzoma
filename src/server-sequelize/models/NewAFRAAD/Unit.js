const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Unit",
    {
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      Unit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Directionforunit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      SupplyLayer: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Area: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ordering: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      DirectionforFeaat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      General_Direction: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      OrderingFeaat: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TaabeaaCode: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DirectionForSM: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tamrkoz: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      statue: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      FollowedWeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      CommandAreasID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      FollowingAreasID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PatternID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      PackagingCode: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      StatisticsCode: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Formation: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      direction: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Moratab: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      Siasa: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SoldiersCompletenessPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      RatebsCompletenessPercentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      OrderNo: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SectorID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      SpecialOrganizationID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      OrderDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      forCause: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      isActivated: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ShortenName: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      isSpecial: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "0",
        field: "isSpecial"
      },
      isHardWork: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: "0",
        field: "isHardWork"
      },
      extraProfitType: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      minimumDegree: {
        type: DataTypes.STRING,
        allowNull: true
      },
      maximumDegree: {
        type: DataTypes.STRING,
        allowNull: true
      },
      Category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      ShapeType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      isRaiseEfficiency: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      hasPackaging: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      willReview: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "Unit",
      schema: "dbo",
      timestamps: false
      // indexes: [
      //   {
      //     name: "PK_Unit",
      //     unique: true,
      //     fields: [
      //       { name: "UnitID" },
      //     ]
      //   },
      // ]
    }
  );
};
