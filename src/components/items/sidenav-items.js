let nozom = function(t) {
    return "sections.12." + t;
  },
  // مدير النظام
  admin = function(t) {
    return "sections.0." + t;
  },
  // التسجيل
  tas = function(t) {
    return "sections.1." + t;
  },
  // الإحتياط
  new_comers = function(t) {
    return "sections.2." + t;
  },
  // الإنهاء
  salaries = function(t) {
    return "sections.3." + t;
  },
  // الملحقين
  enrollers = function(t) {
    return "sections.7." + t;
  },
  // الحاسب
  haseb = function(t) {
    return "section.haseb." + t;
  },
  // البوابة
  gate = function(t) {
    return "sections.gate." + t;
  },
  mic = function(t) {
    return "sections.5." + t;
  },
  high_level = function(t) {
    return "sections.8." + t;
  },
  high_level_distrbuiton = function(t) {
    return "sections.6." + t;
  },
  follow = function(t) {
    return "sections.15." + t;
  },
  high_level_renew = function(t) {
    return "sections.9." + t;
  },
  dafater = function(t) {
    // دفاتر الافراد
    return "sections.9." + t;
  },
  cards = function(t) {
    //البطايق العلاجيه
    return "sections.10." + t;
  },
  help = function(t) {
    // المساعدة
    return "sections.17." + t;
  },
  selections = function(t) {
    // الانتقاء
    return "sections.13." + t;
  },
  arming = function(t) {
    // فرع التسليح
    return "sections.16." + t;
  },
  personal_affairs = function(t) {
    // الشئون الشخصية
    return "sections.14." + t;
  },
  packaging = function(t) {
    // قسم التعبئة
    return "sections.18." + t;
  },
  investigations = function(t) {
    // قسم التعبئة
    return "sections.19." + t;
  },
  military_management = function(t) {
    // قسم تمام الظباط
    return "sections.20." + t;
  },
  /*
       ! You can't use '12' - because it's for nozom ( see first 2 lines in this file )
      */
  rand_id = () => Math.random(111111111, 999999999),
  seperator = function(i) {
    return { type: "divider", text: `just_a_divider_${i}` };
  },
  items = {
    // Header
    header: [
      // {
      //   type: "single",
      //   icon: "mdi-view-dashboard-outline",
      //   text: admin("dashboard"),
      //   href: "/"
      // },
      {
        type: "single",
        icon: "mdi-earth",
        text: admin("home"),
        href: "/"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: tas("soldier_plus"),
        desc: "[ بحث - تعديل - حذف ]",
        href: "/soldiers_plus"
      }
    ],
    // ../Header
    // Footer
    footer: [
      // {
      //   type: "single",
      //   icon: "mdi-web",
      //   text: "websites",
      //   href: "/websites",
      //   targetBlank: true,
      //   onlySegelat: true
      // },
      // {
      //   type: "single",
      //   icon: "mdi-eye-outline",
      //   text: "followup",
      //   href: "/followup"
      // },
      {
        type: "single",
        icon: "mdi-key-outline",
        text: "changePassword",
        href: "/changePassword"
      },
      // // {
      // //   type: "single",
      // //   icon: "mdi-file-document-multiple",
      // //   text: "new_comerstyat_docs",
      // //   href: "/new_comerstyat_docs"
      // // },
      // {
      //   type: "single",
      //   icon: "mdi-collage",
      //   text: "tasadek",
      //   href: "/tasadek",
      //   onlySegelat: true
      // },
      {
        type: "single",
        icon: "mdi-calendar",
        text: "calendar",
        desc: "مفكرة لمهام الأقسام",
        href: "/calendar"
      },
      {
        type: "single",
        icon: "mdi-facebook-messenger",
        text: "messenger",
        href: "/messenger",
        onlySegelat: true
      },
      // {
      //   type: "single",
      //   icon: "mdi-dresser-outline",
      //   text: "change_log",
      //   href: "/change_log"
      // },
      {
        type: "single",
        icon: "mdi-power",
        text: "logout",
        href: "",
        click: "request_logout"
      }
    ],
    nozom: [
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: admin("operations"),
        href: "/admin_operations"
      },
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: admin("ScrapingOperations"),
        href: "/scraping_operations"
      },
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: admin("replacingDuties"),
        href: "/replacingDuties"
      },
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: admin("openDevTools"),
        href: "/openDevTools"
      }
    ],
    admin: [
      // {
      //   type: "block",
      //   text: admin("connected_devices"),
      // },
      {
        type: "single",
        icon: " ",
        text: admin("connected_devices"),
        href: "/connected_devices",
        onlySegelat: true
      },
      {
        type: "single",
        icon: " ",
        text: admin("Colours"),
        href: "/Colours",
        onlySegelat: true
      },
      {
        type: "single",
        icon: " ",
        text: admin("ColorPalette"),
        href: "/ColorPalette",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("users_groups"),
        href: "/UsersGroups"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("PrivatePages"),
        href: "/PrivatePages"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("edit_users"),
        href: "/edit_users"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("SystemControl"),
        href: "/SystemControl"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("WeaponManagement"),
        href: "/WeaponManagement"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("RatebWeaponManagement"),
        href: "/RatebWeaponManagement"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("LevelManagement"),
        href: "/LevelManagement"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("Duties"),
        href: "/Duties"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: admin("sector_management"),
        href: "/sector_management"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: admin("special_organized_units_management"),
        href: "/special_organized_units_management"
      },
      {
        type: "single",
        icon: " ",
        text: admin("changeID"),
        href: "/changeID",
        onlySegelat: true
      },
      {
        type: "single",
        icon: " ",
        text: admin("CorrectWeaponID"),
        href: "/CorrectWeaponID",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: admin("unit_collections"),
        href: "/UnitCollections"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("edit_units"),
        href: "/edit_units"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("certificator_management"),
        href: "/certificator_management",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("user_tracking"),
        href: "/user_tracking"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("SessionTracking"),
        href: "/SessionTracking"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("DevicesManagement"),
        href: "/DevicesManagement"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: admin("review_plan"),
        href: "/review_plan/Admin"
      }
    ],
    tas: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: tas("tasgeelAdminIndex"),
        href: "/tasgeelAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("TaskenStats"),
        href: "/TaskenStats"
      },
      {
        type: "internalGroup",
        icon: "mdi-account-outline",
        text: tas("all_dailes"),
        children: [
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("CurrentPower"),
            href: "/current_power"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("EfficiencyReport"),
            href: "/EfficiencyReport"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("AllUnitsMawgodDaily"),
            href: "/AllUnitsMawgodDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("AllUnitsMawgodDaily2"),
            href: "/AllUnitsMawgodDaily2"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("AllUnitsMawgodDailySeparated"),
            href: "/AllUnitsMawgodDailySeparated"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("AllUnitsMawgodDailySeparated2"),
            href: "/AllUnitsMawgodDailySeparated2"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("UnitAndKnowledgeLevelDaily"),
            href: "/UnitAndKnowledgeLevelDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("HighUnitsDaily"),
            href: "/HighUnitsDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("weapons_daily"),
            href: "/weapons_daily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("categories_dailes"),
            href: "/categories_dailes"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("single_category_daily"),
            href: "/single_category_daily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("_360_normal_dailes"),
            href: "/360_normal_dailes"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("_360_mokrar_dailes"),
            href: "/360_mokrar_dailes"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("mokrar_360_dailes_dynamic"),
            href: "/360_mokrar_dailes_dynamic"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("SMYearQuarter"),
            href: "/SMYearQuarter"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("TheOutageCompleteDaily"),
            href: "/TheOutageCompleteDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: tas("StageSupportReports"),
            href: "/StageSupportReports"
          }
        ]
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("moveSoldiersToServe"),
        href: "/moveSoldiersToServe"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("endSoldiersService"),
        href: "/endSoldiersService"
      },
      // {
      //   type: "single",
      //   icon: "mdi-account-outline",
      //   text: tas("TransportLicense"),
      //   href: "/TransportLicense"
      // },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("SupportRecommandations"),
        href: "/SupportRecommandations"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("UnitEffects"),
        href: "/UnitEffects"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("transportLicenseSM"),
        href: "/transportLicenseSM"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: tas("unCompletedData"),
        href: "/unCompletedData"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: tas("internalFollowTasgeel"),
        href: "/DepartmentsInternalFollow/Tasgeel",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: tas("review_plan"),
        href: "/review_plan/Tasgel"
      }
    ],

    new_comers: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: new_comers("new_comers_admin"),
        href: "/newComersAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: new_comers("addNewcomer"),
        href: "/addNewcomer",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: new_comers("review_stage"),
        href: "/review-stage",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: new_comers("addNationalIds"),
        href: "/addNationalIds",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("soliders_brothers"),
        href: "/brothers",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("distributed_suggest"),
        href: "/distributed_suggest",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("comparePlanDetailsWithRecommendations"),
        href: "/comparePlanDetailsWithRecommendations",
        onlySegelat: true
      },
      {
        type: "internalGroup",
        icon: "mdi-update",
        text: new_comers("all_situations"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: new_comers("SoldiersMedicalSituations"),
            href: "/SoldiersMedicalSituations",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: new_comers("SoldiersSelectionSituations"),
            href: "/SoldiersSelectionSituations",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: new_comers("SoldiersPhsycoligicalSituations"),
            href: "/SoldiersPhsycoligicalSituations",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: new_comers("SoldierSecuritySituations"),
            href: "/SoldierSecuritySituations",
            onlySegelat: true
          }
        ]
      },

      {
        type: "internalGroup",
        icon: "mdi-update",
        text: new_comers("all_recommandations"),
        onlySegelat: true,
        model: false,
        children: [
          {
            type: "single",
            icon: "mdi-update",
            text: new_comers("recommandations"),
            href: "/recommandations",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-view-dashboard-outline",
            text: new_comers("SMRecommandations"),
            href: "/SMRecommandations"
          },
          {
            type: "single",
            icon: "mdi-view-dashboard-outline",
            text: new_comers("RecommendationAndSelections"),
            href: "/RecommendationAndSelections"
          },
          {
            type: "single",
            icon: "mdi-view-dashboard-outline",
            text: new_comers("RecommendationAndSelectionsEdit"),
            href: "/RecommendationAndSelectionsEdit"
          },
          {
            type: "single",
            icon: "mdi-view-dashboard-outline",
            text: new_comers("RecommendationAndSelectionsFollows"),
            href: "/RecommendationAndSelectionsFollows"
          }
        ]
      },

      {
        type: "internalGroup",
        icon: "mdi-view-dashboard-outline",
        text: new_comers("all_tamam"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: new_comers("tmam_elwosol"),
            href: "/tmam_elwosol",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: new_comers("tmam_eltasgel"),
            href: "/tmam_eltasgel",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: new_comers("tmam_elthr7el"),
            href: "/tmam_elthr7el",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: new_comers("LeaderTmam"),
            href: "/LeaderTmam",
            onlySegelat: true
          }
        ]
      },
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: new_comers("newComersTransportLicense"),
        href: "/newComersTransportLicense"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("dalies"),
        href: "/dalies",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("EngineersReport"),
        href: "/EngineersReport",
        onlySegelat: true
      },
      // {
      //   type: "single",
      //   icon: "mdi-update",
      //   text: new_comers("ArrivalToTrainingCenterDates"),
      //   href: "/ArrivalToTrainingCenterDates",
      //   onlySegelat: true
      // },
      {
        type: "single",
        icon: "mdi-view-dashboard-outline",
        text: new_comers("CollegeDaily"),
        href: "/CollegeDaily"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: new_comers("internalFollowNewComers"),
        href: "/DepartmentsInternalFollow/NewComers",
        onlySegelat: true
      }
    ],

    enrollers: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: enrollers("enrollers_admin"),
        href: "/EnrollersAdminIndex",
        onlySegelat: true
      },
      // {
      //   type: "single",
      //   icon: "mdi-new-box",
      //   text: enrollers("enrollersWorkPlace"),
      //   href: "/enrollersWorkPlace",
      //   onlySegelat: true
      // },
      {
        type: "internalGroup",
        icon: "mdi-update",
        text: enrollers("NamesAndReports"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersAdvancedSearch"),
            href: "/enrollersAdvancedSearch",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("trainingOrderAdvancedSearch"),
            href: "/trainingOrderAdvancedSearch",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: enrollers("FollowersArchiveFiles"),
            href: "/FollowersArchiveFiles",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersStats"),
            href: "/enrollersStats",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersUnitWithWorkplaces"),
            href: "/enrollersUnitWithWorkplaces",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("TrainingOrderUnitWithWorkplaces"),
            href: "/TrainingOrderUnitWithWorkplaces",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersUnitWithCategories"),
            href: "/enrollersUnitWithCategories",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersCategoriesWithWorkplaces"),
            href: "/enrollersCategoriesWithWorkplaces",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("PrimaryPower"),
            href: "/PrimaryPower",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("WorkPlacesAllData"),
            href: "/WorkPlacesAllData",
            onlySegelat: true
          },
          // {
          //   type: "single",
          //   icon: "mdi-new-box",
          //   text: enrollers("PrimaryPowerDaily"),
          //   href: "/PrimaryPowerDaily",
          //   onlySegelat: true
          // },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("LeaderCertificationReport"),
            href: "/LeaderCertificationReport",
            onlySegelat: true
          }
        ]
      },
      {
        type: "internalGroup",
        icon: "mdi-new-box",
        text: enrollers("SituationsAndEffects"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("soldiersNotifications"),
            href: "/soldiersNotifications",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("ratebsNotifications"),
            href: "/ratebsNotifications",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("enrollersEffects"),
            href: "/enrollersEffects",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("workPlaceAddition"),
            href: "/WorkPlacesAdditions",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: enrollers("AdditionsWorkPlacesFollowersDaily"),
            href: "/AdditionsWorkPlacesFollowersDaily",
            onlySegelat: true
          }
        ]
      },
      {
        type: "internalGroup",
        icon: "mdi-new-box",
        text: enrollers("StagesWork"),
        children: [
          {
            type: "single",
            icon: "mdi-update",
            text: enrollers("enrollers_Recu_Dialies"),
            href: "/enrollers_Recu_Dialies",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: enrollers("enrollers_Recu_Dialies_By_Unit"),
            href: "/enrollers_Recu_Dialies_By_Unit",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: enrollers("malaheq_suggest"),
            href: "/malaheq_suggest",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-update",
            text: enrollers("enrollers_plan"),
            href: "/enrollers_plan",
            onlySegelat: true
          }
        ]
      },

      {
        type: "single",
        icon: "mdi-update",
        text: enrollers("internalFollowEnrollers"),
        href: "/DepartmentsInternalFollow/Enrollers",
        onlySegelat: true
      },

      {
        type: "single",
        icon: "mdi-update",
        text: enrollers("review_plan"),
        href: "/review_plan/Enrollers"
      }
    ],
    salaries: [
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("Duties"),
        href: "/Duties"
      },
      {
        type: "single",
        icon: "mdi-account-group-outline",
        text: admin("OfficerDuties"),
        href: "/OfficerDuties"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("command_regions"),
        href: "/command_regions"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("following_areas"),
        href: "/following_areas"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("pattern"),
        href: "/pattern"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("supplying_regions"),
        href: "/supplying_regions"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("mortabat_duties"),
        href: "/mortabat_duties"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("mortabat_duties_per_unit"),
        href: "/mortabat_duties_per_unit"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("AddUnits"),
        href: "/AddUnits"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: salaries("drivers_support"),
        href: "/drivers_support"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: salaries("internalFollowSalaries"),
        href: "/DepartmentsInternalFollow/Salaries",
        onlySegelat: true
      }
    ],

    packaging: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: packaging("packaging_admin"),
        href: "/packagingAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: packaging("package_plan"),
        href: "/packagePlan",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: packaging("packageUnCompletedData"),
        href: "/packageUnCompletedData",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: packaging("SecurityExcluded"),
        href: "/SecurityExcluded",
        onlySegelat: true
      }
    ],
    arming: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("arming_admin"),
        href: "/armingAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("UnitsCars"),
        href: "/UnitsCars"
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("UnitsBoats"),
        href: "/UnitsBoats"
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("UnitSignals"),
        href: "/UnitsSignals"
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("unitsSystemsReport"),
        href: "/unitsSystemsReport"
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: arming("UnitsSystems"),
        href: "/UnitsSystems"
      }
    ],
    investigations: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("investigations_admin"),
        href: "/investigationsAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("officers"),
        href: "/officers",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("investigations"),
        href: "/investigations",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("Custodies"),
        href: "/Custodies",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("appeals"),
        href: "/appeals",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("Complaints"),
        href: "/Complaints",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: investigations("Causations"),
        href: "/Causations",
        onlySegelat: true
      }
    ],
    military_management: [
      {
        type: "internalGroup",
        icon: "mdi-new-box",
        text: military_management("officersManagementTitle"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("officersManagementAdminIndex"),
            href: "/officersManagementAdminIndex",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("officersManagement"),
            href: "/officersManagement",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("OfficerMissionsManagement"),
            href: "/OfficerMissionsManagement",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("OfficerVacationManagement"),
            href: "/OfficerVacationManagement",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("OfficerCoursesManagement"),
            href: "/OfficerCoursesManagement",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("OfficersWithBranchesDaily"),
            href: "/OfficersWithBranchesDaily",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("UnitsOfficers"),
            href: "/UnitsOfficers",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("FullOfficersDaily"),
            href: "/FullOfficersDaily",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("BranchLeadersReport"),
            href: "/BranchLeadersReport",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("Obligations"),
            href: "/Obligations",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("BranchOfficersReport"),
            href: "/BranchOfficersReport",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("VacationsReports"),
            href: "/VacationsReports",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("officerVacationBalanceReport"),
            href: "/officerVacationBalanceReport",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("CoursesReports"),
            href: "/CoursesReports",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("MissionsReports"),
            href: "/MissionsReports",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("BattalionSpeech"),
            href: "/BattalionSpeech",
            onlySegelat: true
          }
        ],
        onlySegelat: true
      },
      {
        type: "internalGroup",
        icon: "mdi-new-box",
        text: military_management("accidentsManagementTitle"),
        onlySegelat: true,
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("accidentsManagementAdminIndex"),
            href: "/AccidentsAdminIndex",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("Accidents"),
            href: "/Accidents",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: military_management("Arrears"),
            href: "/Arrears",
            onlySegelat: true
          }
        ]
      }
    ],

    personal_affairs: [
      // {
      //   type: "single",
      //   icon: "mdi-new-box",
      //   text: personal_affairs("personal_affairs_admin"),
      //   href: "/personalAffairsAdminIndex",
      //   onlySegelat: true
      // },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("vaccination_admin"),
        href: "/VaccinationAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("AcademicallyExcellence"),
        href: "/AcademicallyExcellence",
        onlySegelat: true
      },

      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("ExcellentParent"),
        href: "/ExcellentParent",
        onlySegelat: true
      },
      {
        type: "internalGroup",
        icon: "mdi-update",
        text: personal_affairs("reports"),
        children: [
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("HonorsReports"),
            href: "/HonorsReports",
            onlySegelat: true
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("HousingReports"),
            href: "/HousingReports"
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("EmploymentReports"),
            href: "/EmploymentReports"
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("WivesAndSonsReports"),
            href: "/WivesAndSonsReports"
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("PublicNameReports"),
            href: "/PublicNameReports"
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("HajjReports"),
            href: "/HajjReports"
          },
          {
            type: "single",
            icon: "mdi-new-box",
            text: personal_affairs("DemandsReports"),
            href: "/DemandsReports"
          }
        ]
      },

      {
        type: "internalGroup",
        icon: "mdi-account-outline",
        text: personal_affairs("all_dailes"),
        children: [
          {
            type: "single",
            icon: "mdi-account-outline",
            text: personal_affairs("ExcellentParentDaily"),
            href: "/ExcellentParentDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: personal_affairs("AcademicallyExcellenceDaily"),
            href: "/AcademicallyExcellenceDaily"
          }
        ]
      },

      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("officers"),
        href: "/officers",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("martyrs"),
        href: "/martyrs",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("Death"),
        href: "/Death",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("Injured"),
        href: "/Injured",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("GroupedHonors"),
        href: "/GroupedHonors",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("MedicalRequests"),
        href: "/MedicalRequests",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("GeneralRequests"),
        href: "/GeneralRequests",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("PsychologicalRequests"),
        href: "/PsychologicalRequests",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("InjuredAndHospital"),
        href: "/InjuredAndHospital",
        onlySegelat: true
      },

      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("IdealSoldier"),
        href: "/IdealSoldier",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-new-box",
        text: personal_affairs("Vaccinators"),
        href: "/Vaccinators",
        onlySegelat: true
      }
    ],
    high_level_distrbuiton: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: high_level_distrbuiton("high_level_admin"),
        href: "/highLevelDistAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("transfer_news"),
        href: "/transferNews"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebRecommendation"),
        href: "/RatebRecommendation"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("FutureRecommendations"),
        href: "/FutureRecommendations"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("FutureRequests"),
        href: "/FutureRequests"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RequestManagement"),
        href: "/RequestManagement"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("TransferIntelligence"),
        href: "/TransferIntelligence"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("ratebRates"),
        href: "/ratebRates"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: high_level("RatebGeneralKnowledge"),
        href: "/RatebGeneralKnowledge"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: high_level("TransferAllocationSnapshoot"),
        href: "/TransferAllocationSnapshoot"
      }
    ],
    follow: [
      {
        type: "single",
        icon: "mdi-star-half",
        text: follow("Follow"),
        href: "/followup"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: follow("InternalFollowup"),
        href: "/InternalFollowup"
      }
    ],
    high_level_renew: [
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RenewAdminIndex"),
        href: "/RenewAdminIndex"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RenewNew"),
        href: "/RenewNew"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("OutOfRenew"),
        href: "/OutOfRenew"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("OtherRenewCandidates"),
        href: "/OtherRenewCandidates"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RenewFuturePlan"),
        href: "/RenewFuturePlan"
      },
      {
        type: "internalGroup",
        icon: "mdi-account-outline",
        text: high_level("all_dailies_renew"),
        children: [
          {
            type: "single",
            icon: "mdi-account-outline",
            text: high_level("UnitsDaily"),
            href: "/UnitsDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: high_level("RatebLevelDaily"),
            href: "/RatebLevelDaily"
          },
          {
            type: "single",
            icon: "mdi-account-outline",
            text: high_level("RenewSuccessDaily"),
            href: "/RenewSuccessDaily"
          }
        ]
      }
    ],
    high_level: [
      {
        type: "single",
        icon: "mdi-new-box",
        text: high_level("high_level_admin"),
        href: "/highLevelAdminIndex",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebsMedicalSituations"),
        href: "/RatebsMedicalSituations"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebsPhsycoligicalSituations"),
        href: "/RatebsPhsycoligicalSituations"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("LowLevel"),
        href: "/LowLevel"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("courts_punshmentes"),
        href: "/courts_punshmentes"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebPenalities"),
        href: "/RatebPenalities"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebPunishment"),
        href: "/RatebPunishment"
      },
      // {
      //   type: "single",
      //   icon: "mdi-star-half",
      //   text: high_level("transfer_news"),
      //   href: "/transferNews"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-star-half",
      //   text: high_level("ReNew"),
      //   href: "/ReNew"
      // },
      // {
      //   type: "single",
      //   icon: "mdi-star-half",
      //   text: high_level("Promote"),
      //   href: "/Promote"
      // },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("grades"),
        href: "/grades"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("Neshan"),
        href: "/Neshan"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("security_situations"),
        href: "/security_situations"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("single_job_daily"),
        href: "/single_job_daily"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("problems_petitions"),
        href: "/problems_petitions"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("travels"),
        href: "/travels"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("pre_unites"),
        href: "/pre_unites"
      },

      // {
      //   type: "single",
      //   icon: "mdi-star-half",
      //   text: high_level("TransferAllocation"),
      //   href: "/TransferAllocation"
      // },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("fitting"),
        href: "/Fittings"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("AdminFittings"),
        href: "/AdminFittings"
      },
      // {
      //   type: "single",
      //   icon: "mdi-star-half",
      //   text: high_level("inventory"),
      //   href: "/inventory"
      // },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("inventoryLevelup"),
        href: "/inventoryLevelup"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("VolunteeringTimePlan"),
        href: "/VolunteeringTimePlan"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("VolunteeringRecommendation"),
        href: "/VolunteeringRecommendation"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("tahel"),
        href: "/tahel"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("highLevelDaily"),
        href: "/highLevelDaily"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("highLevelCategoriesDailies"),
        href: "/highLevelCategoriesDailies"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("allHighLevelDaily"),
        href: "/allHighLevelDaily"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("RatebTraineeShip"),
        href: "/RatebTraineeShip"
      },
      {
        type: "single",
        icon: "mdi-star-half",
        text: high_level("level_up"),
        href: "/level_up"
      },
      {
        type: "single",
        icon: "mdi-account-outline",
        text: high_level("ratebUnCompletedData"),
        href: "/ratebUnCompletedData"
      },
      {
        type: "single",
        icon: "mdi-update",
        text: high_level("internalFollowHigh"),
        href: "/DepartmentsInternalFollow/High",
        onlySegelat: true
      },
      {
        type: "single",
        icon: "mdi-update",
        text: high_level("review_plan"),
        href: "/review_plan/High"
      }
    ],
    high_level_dailes: [],
    en: [],
    // ../Enhaa
    // ..Horob
    ho: [],
    // ../Horob
    // Gate
    gate: [],

    // cards in_service and out_service
    cards: [],

    // Microfilm
    mic: [],
    db_so: [
      // {
      //   type: "single",
      //   icon: "mdi-television",
      //   text: db_so("main"),
      //   href: "/db_so",
      //   click: "",
      //   onlySegelat: true
      // }
    ],
    tc: [
      // {
      //   type: "group",
      //   icon: "mdi-credit-card-multiple",
      //   text: tc("_self"),
      //   sections: [0, 1, 3],
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: tc("search"),
      //       sections: [0, 1, 3],
      //       href: "/cards/search/dialogSearch"
      //     }
      //   ]
      // }
    ],
    mokatabat: [
      // {
      //   type: "group",
      //   icon: "mdi-file-document-multiple-outline",
      //   text: moka("mokatabat"),
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: moka("sader"),
      //       href: "/mokatabat_sader"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: moka("wared"),
      //       href: "/mokatabat_wared"
      //     }
      //   ]
      // }
    ],
    dafater: [
      // {
      //   type: "group",
      //   icon: "mdi-image-album",
      //   text: dafater("dafater"),
      //   model: false,
      //   onlySegelat: true,
      //   children: [
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("cons"),
      //       href: "/dafater_cons"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("stats"),
      //       href: "/dafater_stats"
      //     },
      //     {
      //       type: "single",
      //       icon: " ",
      //       text: dafater("view"),
      //       href: "/dafater_view"
      //     }
      //   ]
      // }
    ],
    help: [
      {
        type: "group",
        icon: "mdi-help",
        text: help("_self"),
        model: false,
        onlySegelat: true,
        children: [
          {
            type: "single",
            icon: " ",
            text: help("gate_services"),
            href: "/gate_services"
          },
          {
            type: "single",
            icon: " ",
            text: help("tsgel"),
            href: "/tsgel"
          },
          {
            type: "single",
            icon: " ",
            text: help("anhaa"),
            href: "/anhaa"
          },
          {
            type: "single",
            icon: " ",
            text: help("hasb"),
            href: "/hasb"
          }
        ]
      }
    ]
    // ../Microfilm
    // Ignorants
    // ignorants: [
    //   {
    //     type: "single",
    //     icon: "mdi-account-group",
    //     text: mic("ignorants"),
    //     href: "/ignorants"
    //   }
    // ]
    // ../Ignoratns
  },
  header = [...items.header],
  footer = [
    // ...items.db_so,
    ...items.mic,
    ...items.tc, // Commented to build a new version
    ...items.mokatabat,
    ...items.dafater,
    ...items.gate,
    // ...items.cards,
    // ...items.help,
    ...items.footer
  ],
  _0 = [...items.admin],
  _4 = [...items.nozom],
  _1 = [...items.tas],
  _2 = [...items.new_comers],
  _7 = [...items.enrollers],
  _8 = [...items.high_level],
  _6 = [...items.high_level_distrbuiton],
  _9 = [...items.high_level_renew],
  _3 = [...items.salaries],
  _14 = [...items.personal_affairs],
  _15 = [...items.follow],
  _16 = [...items.arming],
  _17 = [...items.help],
  _18 = [...items.packaging],
  _19 = [...items.investigations],
  _20 = [...items.military_management],
  _12 = [
    ...items.ho
    // {
    //   type: "group",
    //   key: 5,
    //   value: items.mic
    // }
  ];
// _6 = [...items.db_so];
// _5 = [
//   // ميكروفيلم
//   ...items.mic
// ]
export {
  seperator,
  header,
  footer,
  _0
 
  // _6,
  // _12,
  // _1,
  // _2,
  // _3,
  // _4,
  // _7,
  // _8,
  // _15,
  // _14,
  // _16,
  // _17,
  // _18,
  // _19,
  // _20
};
