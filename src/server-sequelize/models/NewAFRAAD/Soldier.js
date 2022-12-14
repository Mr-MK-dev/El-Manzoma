const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Soldier",
    {
      ID: {
        type: DataTypes.STRING(13),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Soldier",
          key: "ID"
        }
      },
      Name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IndexNo: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      TripleNo: {
        type: DataTypes.STRING(14),
        allowNull: true
      },
      WeaponID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Weapon",
          key: "WeaponID"
        }
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Unit",
          key: "UnitID"
        }
      },
      DutyID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        references: {
          model: "Duty",
          key: "DutyID"
        }
      },
      SoldierCategory: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      SoldierLevel: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      RecuRegion: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      KnowledgeLevel: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      SoldierEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      RecuStage: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuTreat: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      MissingTime: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      RecuEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      SoldierStatus: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Status: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      EndingCause: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      IdentityNo: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      BirthDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      College: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Specialization: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      CityID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "City",
          key: "CityID"
        }
      },
      CentreID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Centre",
          key: "CentreID"
        }
      },
      SoldierTELE: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      RelevantTELE: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      Job: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Religion: {
        type: DataTypes.STRING(5),
        allowNull: true
      },
      BloodType: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      Direction: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      Directionforunit: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      ArrivalDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      Notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Alhaq: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      TahtEltawze3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      Revision: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      BrotherID: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      ServiceType: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      GHA: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      DriverLevel: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Treatment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
        MartialStatus: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      isPrinted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: new Date()
      },
      SecurityExcludedFromPackaging: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "Soldier",
      schema: "dbo",
      timestamps: false
    }
  );
};
