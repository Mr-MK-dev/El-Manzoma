const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "Accidents",
    {
      ID_KEY: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      TypeID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      UnitID: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      // ملخص الحادث
      Summary: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Details: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DecisionMade: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      DateOfAccident: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      DateOfReporting: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      //مذكرة تفصيلة
      isDetailedNote: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //محضر شرطة عسكرية
      isMilitaryPoliceRecord: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //محضر شرطة مدنية
      isCivilPoliceRecord: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //التصرف النهائي
      isFinalActOfJustice: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //إهطار لهيئة التنظيم والإدارة
      isOrganizationReported: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //مجلس تحقيق
      isInvestigationCouncil: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //امر تنفيذ الحكم
      isJudgmentOrderDone: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //إعلان الحكم
      isJudgmentPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //مستخرج الحكم
      isJudgmentOutput: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      // 161 س
      S161: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      // المتابعة
      //أبرز الحوادث
      isNotableAccident: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //الحادث متابع
      isFollowed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      },
      //تاريخ اخر متابعة
      DateOfLastFollow: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      //تاريخ اخر رد
      DateOfLastReply: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: "Accidents",
      schema: "dbo",
      timestamps: false
    }
  );
};
