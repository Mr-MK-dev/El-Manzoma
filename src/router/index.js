import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import NProgress from "nprogress";
import "nprogress/nprogress.css";

const mix = require("@/mixin/fun.js");
const routes = [
  {
    path: "*",
    name: "error_404",
    component: mix.fun.loadView("errors/e404"),
    meta: {
      title: "لم يتم العثور على الصفحة المطلوبة",
      ok: true
    }
  },
  {
    path: "/no_tab_error",
    name: "no_tab_error",
    component: mix.fun.loadView("errors/no-tab"),
    meta: {
      title: "صفحة غير محددة",
      ok: true
    }
  },
  {
    path: "/eauth",
    name: "eauth",
    component: mix.fun.loadView("errors/eauth"),
    meta: {
      title: "ليس لديك الصلاحية لعرض هذه الصفحة",
      ok: true
    }
  },
  {
    path: "/",
    name: "home",
    component: mix.fun.loadView("Home"),
    // component: () => import("@/views/Home.vue"),
    meta: {
      title: "الصفحة الرئيسية",
      ok: true
    }
  },
  {
    path: "/home_counters/:section?",
    name: "home_counters",
    component: mix.fun.loadView("Global/Footer/HomeCounters"),
    meta: {
      title: "متابعات القسم",
      ok: true
    }
  },
  {
    path: "/distributed_suggest",
    name: "distributed_suggest",
    component: mix.fun.loadView("new_comers/distributed_suggest"),
    meta: {
      title: "مقترح التوزيع",
      ok: true
    }
  },
  {
    path: "/newComersAdminIndex",
    name: "new_comers_admin",
    component: mix.fun.loadView(
      "new_comers/newComersAdmin/newComersAdminIndex"
    ),
    meta: {
      title: "مدير نظام المستجدين",
      ok: true
    }
  },
  {
    path: "/tmam_elwosol",
    name: "tmam_elwosol",
    component: mix.fun.loadView("new_comers/new_comers"),
    meta: {
      title: "تمام الوصول",
      ok: true
    }
  },
  {
    path: "/EngineersReport",
    name: "EngineersReport",
    component: mix.fun.loadView("new_comers/EngineersReport"),
    meta: {
      title: "يومية المهندسين بالتخصصات",
      ok: true
    }
  },
  {
    path: "/SoldierSecuritySituations",
    name: "SoldierSecuritySituations",
    component: mix.fun.loadView("new_comers/SoldierSecuritySituations"),
    meta: {
      title: "المواقف الأمنيه للمجندين",
      ok: true
    }
  },
  {
    path: "/SoldiersMedicalSituations",
    name: "SoldiersMedicalSituations",
    component: mix.fun.loadView("new_comers/SoldiersMedicalSituations"),
    meta: {
      title: "المواقف الطبية للمجندين",
      ok: true
    }
  },
  {
    path: "/SoldiersPhsycoligicalSituations",
    name: "SoldiersPhsycoligicalSituations",
    component: mix.fun.loadView("new_comers/SoldiersPhsycoligicalSituations"),
    meta: {
      title: "المواقف النفسية للمجندين",
      ok: true
    }
  },
  {
    path: "/SoldiersSelectionSituations",
    name: "SoldiersSelectionSituations",
    component: mix.fun.loadView("new_comers/SoldiersSelectionSituations"),
    meta: {
      title: "مواقف الانتقاء والتوجيه للمجندين",
      ok: true
    }
  },
  {
    path: "/RecommendationAndSelections",
    name: "RecommendationAndSelections",
    component: mix.fun.loadView("new_comers/RecommendationAndSelections"),
    meta: {
      title: "توصيات الانتقاءات",
      ok: true
    }
  },
  {
    path: "/RecommendationAndSelectionsEdit",
    name: "RecommendationAndSelectionsEdit",
    component: mix.fun.loadView("new_comers/RecommendationAndSelectionsEdit"),
    meta: {
      title: "تسجيل نتيجة الانتقاء",
      ok: true
    }
  },
  // {
  //   path: "/ArrivalToTrainingCenterDates",
  //   name: "ArrivalToTrainingCenterDates",
  //   component: mix.fun.loadView("new_comers/ArrivalToTrainingCenterDates"),
  //   meta: {
  //     title: "تواريخ ترحيل مركز التدريب",
  //     ok: true
  //   }
  // },
  {
    path: "/LeaderTmam",
    name: "LeaderTmam",
    component: mix.fun.loadView("new_comers/LeaderTmam"),
    meta: {
      title: "تمام القائد",
      ok: true
    }
  },
  {
    path: "/DistriputionComparison/:id?/:RecuStage?",
    name: "DistriputionComparison",
    component: mix.fun.loadView("new_comers/DistriputionComparison"),
    meta: {
      title: "مقارنة المخطط بموجودات المرحلة",
      ok: true
    }
  },
  {
    path: "/UsersGroups",
    name: "UsersGroups",
    component: mix.fun.loadView("Admin/UsersGroups"),
    meta: {
      title: "إدارة مجموعات المستخدمين",
      ok: true
    }
  },
  {
    path: "/LevelManagement",
    name: "LevelManagement",
    component: mix.fun.loadView("Admin/LevelManagement"),
    meta: {
      title: "إدارة الدرجات",
      ok: true
    }
  },
  {
    path: "/WeaponManagement",
    name: "WeaponManagement",
    component: mix.fun.loadView("Admin/WeaponManagement"),
    meta: {
      title: "إدارةالأسلحة للجنود",
      ok: true
    }
  },
  {
    path: "/RatebWeaponManagement",
    name: "RatebWeaponManagement",
    component: mix.fun.loadView("Admin/RatebWeaponManagement"),
    meta: {
      title: "إدارةالأسلحة للراتب العالي",
      ok: true
    }
  },
  {
    path: "/tmam_eltasgel",
    name: "tmam_eltasgel",
    component: mix.fun.loadView("new_comers/tmam_eltasgel"),
    meta: {
      title: "تمام التسجيل",
      ok: true
    }
  },
  {
    path: "/openDevTools",
    name: "openDevTools",
    component: mix.fun.loadView("openDevTools"),
    meta: {
      title: "",
      ok: true
    }
  },
  {
    path: "/OfficerSoldierRecommendation",
    name: "OfficerSoldierRecommendation",
    component: mix.fun.loadView("new_comers/OfficerSoldierRecommendation"),
    meta: {
      title: "توصيات جندي/ظابط ",
      ok: true
    }
  },
  {
    path: "/tmam_eltarhel",
    name: "tmam_eltarhel",
    component: mix.fun.loadView("new_comers/tmam_eltarhel"),
    meta: {
      title: "تمام التسجيل",
      ok: true
    }
  },
  {
    path: "/malaheq_suggest",
    name: "malaheq_suggest",
    component: mix.fun.loadView("enrollers/malaheq_suggest"),
    meta: {
      title: "مقترح الملاحق المرحلة",
      ok: true
    }
  },
  {
    path: "/LeaderCertificationReport",
    name: "LeaderCertificationReport",
    component: mix.fun.loadView("enrollers/LeaderCertificationReport"),
    meta: {
      title: "يومية تصديق القائد",
      ok: true
    }
  },
  {
    path: "/enrollersEffects",
    name: "enrollersEffects",
    component: mix.fun.loadView("enrollers/enrollersEffects"),
    meta: {
      title: "المؤثرات",
      ok: true
    }
  },
  {
    path: "/SystemControl",
    name: "SystemControl",
    component: mix.fun.loadView("Admin/SystemControl"),
    meta: {
      title: "لوحة التحكم",
      ok: true
    }
  },
  {
    path: "/soldiersNotifications",
    name: "soldiersNotifications",
    component: mix.fun.loadView("enrollers/soldiersNotifications"),
    meta: {
      title: "إشعارات المجندين الملحقين",
      ok: true
    }
  },
  {
    path: "/ratebsNotifications",
    name: "ratebsNotifications",
    component: mix.fun.loadView("enrollers/ratebsNotifications"),
    meta: {
      title: "إشعارات الراتب العالي الملحقين",
      ok: true
    }
  },
  {
    path: "/enrollers_plan",
    name: "enrollers_plan",
    component: mix.fun.loadView("enrollers/enrollers_plan"),
    meta: {
      title: "مخطط ملاحق المرحلة",
      ok: true
    }
  },
  {
    path: "/addNewcomer",
    name: "addNewcomer",
    component: mix.fun.loadView("new_comers/addNewcomer"),
    meta: {
      title: "إضافة فرد",
      ok: true
    }
  },
  {
    path: "/recommandations",
    name: "recommandations",
    component: mix.fun.loadView("new_comers/recommandations"),
    meta: {
      title: "التوصيات",
      ok: true
    }
  },
  // {
  //   path: "/effects",
  //   name: "effects",
  //   component: mix.fun.loadView("new_comers/effects"),
  //   meta: {
  //     title: "مؤثرات المرحلة",
  //     ok: true
  //   }
  // },
  {
    path: "/tmam_elthr7el",
    name: "tmam_elthr7el",
    component: mix.fun.loadView("new_comers/tmam_elthr7el"),
    meta: {
      title: "تمام الترحيل",
      ok: true
    }
  },
  {
    path: "/categories_dailes",
    name: "categories_dailes",
    component: mix.fun.loadView("tasgeel/categories_dailes"),
    meta: {
      title: "اليومية العديدة",
      ok: true
    }
  },
  {
    path: "/UnitAndKnowledgeLevelDaily",
    name: "UnitAndKnowledgeLevelDaily",
    component: mix.fun.loadView("tasgeel/UnitAndKnowledgeLevelDaily"),
    meta: {
      title: "يومية عددية بالوحدات والمؤهلات",
      ok: true
    }
  },
  {
    path: "/TheOutageCompleteDaily",
    name: "TheOutageCompleteDaily",
    component: mix.fun.loadView("tasgeel/TheOutageCompleteDaily"),
    meta: {
      title: "يومية استعواض المسرح",
      ok: true
    }
  },
  {
    path: "/TaskenStats",
    name: "TaskenStats",
    component: mix.fun.loadView("tasgeel/TaskenStats"),
    meta: {
      title: "بيان التسكين",
      ok: true
    }
  },
  {
    path: "/unCompletedData",
    name: "unCompletedData",
    component: mix.fun.loadView("tasgeel/unCompletedData"),
    meta: {
      title: "بيانات غير مكتملة",
      ok: true
    }
  },
  {
    path: "/SupportRecommandations",
    name: "SupportRecommandations",
    component: mix.fun.loadView("tasgeel/SupportRecommandations"),
    meta: {
      title: "تقرير الامداد ",
      ok: true
    }
  },

  {
    path: "/UnitEffects",
    name: "UnitEffects",
    component: mix.fun.loadView("tasgeel/UnitEffects"),
    meta: {
      title: "تقرير بمؤترات الواحدات",
      ok: true
    }
  },
  {
    path: "/SMYearQuarter",
    name: "SMYearQuarter",
    component: mix.fun.loadView("tasgeel/SMYearQuarter"),
    meta: {
      title: "يومية الربع السنوي",
      ok: true
    }
  },
  {
    path: "/single_category_daily",
    name: "single_category_daily",
    component: mix.fun.loadView("tasgeel/single_category_daily"),
    meta: {
      title: "يومية خاصة بفئة",
      ok: true
    }
  },
  {
    path: "/weapons_daily",
    name: "weapons_daily",
    component: mix.fun.loadView("tasgeel/weapons_daily"),
    meta: {
      title: "يومية عددية للادارات",
      ok: true
    }
  },
  {
    path: "/HighUnitsDaily",
    name: "HighUnitsDaily",
    component: mix.fun.loadView("tasgeel/HighUnitsDaily"),
    meta: {
      title: "يوميات الراتب العالي بوحدات حرس الحدود",
      ok: true
    }
  },
  {
    path: "/moveSoldiersToServe",
    name: "moveSoldiersToServe",
    component: mix.fun.loadView("tasgeel/moveSoldiersToServe"),
    meta: {
      title: "نقل الدفعة للخدمة",
      ok: true
    }
  },
  {
    path: "/endSoldiersService",
    name: "endSoldiersService",
    component: mix.fun.loadView("tasgeel/endSoldiersService"),
    meta: {
      title: "نقل الدفعة للإحتياط",
      ok: true
    }
  },
  {
    path: "/360_normal_dailes",
    name: "360_normal_dailes",
    component: mix.fun.loadView("tasgeel/360_normal_dailes"),
    meta: {
      title: "يومية 360 عادة",
      ok: true
    }
  },
  {
    path: "/transportLicenseSM",
    name: "transportLicenseSM",
    component: mix.fun.loadView("tasgeel/transportLicenseSM"),
    meta: {
      title: "تراخيص نقل إدارات تخصصيه",
      ok: true
    }
  },
  {
    path: "/unit_managment",
    name: "unit_managment",
    component: mix.fun.loadView("salaries/unit_managment"),
    meta: {
      title: "ادارة الواحدات",
      ok: true
    }
  },
  {
    path: "/drivers_support",
    name: "drivers_support",
    component: mix.fun.loadView("salaries/drivers_support"),
    meta: {
      title: "امداد السائقين",
      ok: true
    }
  },
  {
    path: "/Duties",
    name: "Duties",
    component: mix.fun.loadView("salaries/Duties"),
    meta: {
      title: "ادارة الوظائف",
      ok: true
    }
  },
  {
    path: "/OfficerDuties",
    name: "OfficerDuties",
    component: mix.fun.loadView("salaries/OfficerDuties"),
    meta: {
      title: "ادارة وظائف الضباط",
      ok: true
    }
  },
  {
    path: "/sector_management",
    name: "sector_management",
    component: mix.fun.loadView("Admin/sector_management"),
    meta: {
      title: "القطاعات",
      ok: true
    }
  },
  {
    path: "/special_organized_units_management",
    name: "special_organized_units_management",
    component: mix.fun.loadView("Admin/special_organized_units_management"),
    meta: {
      title: "التنظيمات الخاصة للوحدات",
      ok: true
    }
  },
  {
    path: "/UnitCollections",
    name: "UnitCollections",
    component: mix.fun.loadView("Admin/UnitCollections"),
    meta: {
      title: "التجميعات القتالية",
      ok: true
    }
  },
  {
    path: "/points",
    name: "points",
    component: mix.fun.loadView("Admin/Points"),
    meta: {
      title: "ادارة النقط",
      ok: true
    }
  },
  {
    path: "/points_hubs",
    name: "points_hubs",
    component: mix.fun.loadView("Admin/PointsHubs"),
    meta: {
      title: "ادارة السرايا",
      ok: true
    }
  },
  {
    path: "/supplying_regions",
    name: "supplying_regions",
    component: mix.fun.loadView("salaries/supplying_regions"),
    meta: {
      title: "ادارة جهات الإمداد",
      ok: true
    }
  },
  {
    path: "/AddUnits",
    name: "AddUnits",
    component: mix.fun.loadView("salaries/AddUnits"),
    meta: {
      title: "ادارة الواحدات",
      ok: true
    }
  },

  {
    path: "/command_regions",
    name: "command_regions",
    component: mix.fun.loadView("salaries/command_regions"),
    meta: {
      title: "المستويات الأعلى",
      ok: true
    }
  },
  {
    path: "/following_areas",
    name: "following_areas",
    component: mix.fun.loadView("salaries/following_areas"),
    meta: {
      title: "الجهات التبعية",
      ok: true
    }
  },
  {
    path: "/pattern",
    name: "pattern",
    component: mix.fun.loadView("salaries/pattern"),
    meta: {
      title: "الأنماط",
      ok: true
    }
  },
  {
    path: "/add_weapon_duty",
    name: "add_weapon_duty",
    component: mix.fun.loadView("salaries/add_weapon_duty"),
    meta: {
      title: "إضافة وظائف لجهات الالحاق",
      ok: true
    }
  },
  {
    path: "/mortabat_duties",
    name: "mortabat_duties",
    component: mix.fun.loadView("salaries/mortabat_duties"),
    meta: {
      title: "بيان المرتبات والسياسات ونسبة الإستكمال",
      ok: true
    }
  },
  {
    path: "/mortabat_duties_per_unit",
    name: "mortabat_duties_per_unit",
    component: mix.fun.loadView("salaries/mortabat_duties_per_unit"),
    meta: {
      title: "بيان وظائف وحدة ",
      ok: true
    }
  },
  {
    path: "/soldiers_plus/advanced_search/MortbatAndMwgodatDaily",
    name: "MortbatAndMwgodatDaily",
    component: mix.fun.loadView("salaries/MortbatAndMwgodatDaily"),
    meta: {
      title: "يومية المرتبات والموجودات",
      ok: true
    }
  },
  {
    path: "/360_mokrar_dailes",
    name: "360_mokrar_dailes",
    component: mix.fun.loadView("tasgeel/360_mokrar_dailes"),
    meta: {
      title: "يومية 360 مكرر",
      ok: true
    }
  },
  {
    path: "/360_mokrar_dailes_dynamic",
    name: "360_mokrar_dailes_dynamic",
    component: mix.fun.loadView("tasgeel/360_mokrar_dailes_dynamic"),
    meta: {
      title: "يومية 360 مكرر بناء علي المرتبات",
      ok: true
    }
  },

  {
    path: "/TransportLicense",
    name: "TransportLicense",
    component: mix.fun.loadView("tasgeel/TransportLicense"),
    meta: {
      title: "تراخيص النقل ",
      ok: true
    }
  },
  {
    path: "/review-stage",
    name: "review-stage",
    component: mix.fun.loadView("new_comers/reviewStage"),
    meta: {
      title: "تسجيل الوحدات للمرحلة",
      ok: true
    }
  },
  {
    path: "/addNationalIds",
    name: "addNationalIds",
    component: mix.fun.loadView("new_comers/addNationalIds"),
    meta: {
      title: "إضافة أرفام قومية للمرحلة",
      ok: true
    }
  },
  {
    path: "/CollegeDaily",
    name: "CollegeDaily",
    component: mix.fun.loadView("new_comers/CollegeDaily"),
    meta: {
      title: "يومية عددية بالكليات",
      ok: true
    }
  },
  {
    path: "/dalies",
    name: "dalies",
    component: mix.fun.loadView("new_comers/dalies"),
    meta: {
      title: "اليوميات العديدة",
      ok: true
    }
  },
  {
    path: "/MartyrsProfileIndex/:id?/:type?/:militaryType?",
    name: "MartyrsProfileIndex",
    component: mix.fun.loadView(
      "personal_affairs/MartyrsData/MartyrsProfileIndex"
    ),
    meta: {
      title: "كارت البيانات",
      ok: true
    }
  },

  {
    path: "/InjuredAndHospital",
    name: "InjuredAndHospital",
    component: mix.fun.loadView("personal_affairs/InjuredAndHospital"),
    meta: {
      title: "كشف المرضي و المصابين بالمستشفيات",
      ok: true
    }
  },

  {
    path: "/VaccinationAdminIndex",
    name: "VaccinationAdminIndex",
    component: mix.fun.loadView(
      "personal_affairs/vaccination_admin/VaccinationAdminIndex"
    ),
    meta: {
      title: "مدير نظام الشئون الشخصية",
      ok: true
    }
  },
  {
    path: "/brothers",
    name: "v",
    component: mix.fun.loadView("new_comers/brothers/Brothers"),
    meta: {
      title: "الاشقاء",
      ok: true
    }
  },
  {
    path: "/SearchBrothers",
    name: "SearchBrothers",
    component: mix.fun.loadView("new_comers/brothers/SearchBrothers"),
    meta: {
      title: "بحث تشابه الأسماء",
      ok: true
    }
  },
  {
    path: "/newComersTransportLicense",
    name: "v",
    component: mix.fun.loadView("new_comers/newComersTransportLicense"),
    meta: {
      title: "تراخيص نقل المستجدين",
      ok: true
    }
  },
  {
    path: "/followup",
    name: "followup",
    component: mix.fun.loadView("Shared/follow/Followup"),
    meta: {
      title: "البوسطة",
      ok: true
    }
  },
  {
    path: "/changePassword",
    name: "changePassword",
    component: mix.fun.loadView("changePassword"),
    meta: {
      title: "تغيير كلمة المرور",
      ok: true
    }
  },
  {
    path: "/InternalFollowup",
    name: "InternalFollowup",
    component: mix.fun.loadView("Shared/follow/InternalFollowup"),
    meta: {
      title: "المتابعة الداخلية",
      ok: true
    }
  },
  {
    path: "/enrollersAdvancedSearch",
    name: "enrollersAdvancedSearch",
    component: mix.fun.loadView("enrollers/enrollersAdvancedSearch"),
    meta: {
      title: "بحث متقدم للملحقين",
      ok: true
    }
  },
  {
    path: "/DepartmentsInternalFollow/:departmentType?",
    name: "DepartmentsInternalFollow",
    component: mix.fun.loadView("Shared/DepartmentsInternalFollow"),
    meta: {
      title: "متابعة داخلية للقسم",
      ok: true
    }
  },
  {
    path: "/review_plan/:departmentType?",
    name: "review_plan",
    component: mix.fun.loadView("Shared/review_plan"),
    meta: {
      title: "خطط المراجعة",
      ok: true
    }
  },
  {
    path: "/review_plan_list_details/:id?/:departmentType?",
    name: "review_plan_list_details",
    component: mix.fun.loadView("Shared/review_plan_list_details"),
    meta: {
      title: "خطط المراجعة",
      ok: true
    }
  },
  // {
  //   path: "/enrollersSoldiersEffects",
  //   name: "enrollersSoldiersEffects",
  //   component: mix.fun.loadView("enrollers/enrollersSoldiersEffects"),
  //   meta: {
  //     title: "مؤثرات الملحقين جنود",
  //     ok: true
  //   }
  // },

  // {
  //   path: "/enrollersRatebsEffects",
  //   name: "enrollersRatebsEffects",
  //   component: mix.fun.loadView("enrollers/enrollersRatebsEffects"),
  //   meta: {
  //     title: "مؤثرات الملحقين الراتب العالي",
  //     ok: true
  //   }
  // },
  {
    path: "/enrollers_Recu_Dialies",
    name: "enrollers_Recu_Dialies",
    component: mix.fun.loadView("enrollers/enrollers_Recu_Dialies"),
    meta: {
      title: "يومية ملاحق المرحلة",
      ok: true
    }
  },
  {
    path: "/enrollers_Recu_Dialies_By_Unit",
    name: "enrollers_Recu_Dialies_By_Unit",
    component: mix.fun.loadView("enrollers/enrollers_Recu_Dialies_By_Unit"),
    meta: {
      title: "يومية ملاحق المرحلة حسب الوحدة",
      ok: true
    }
  },
  {
    path: "/enrollersUnitWithCategories",
    name: "enrollersUnitWithCategories",
    component: mix.fun.loadView("enrollers/enrollersUnitWithCategories"),
    meta: {
      title: "يومية وحدات فئات",
      ok: true
    }
  },
  {
    path: "/enrollersCategoriesWithWorkplaces",
    name: "enrollersCategoriesWithWorkplaces",
    component: mix.fun.loadView("enrollers/enrollersCategoriesWithWorkplaces"),
    meta: {
      title: "يومية أماكن عمل فئات",
      ok: true
    }
  },
  {
    path: "/RecommendationAndSelectionsFollows",
    name: "RecommendationAndSelectionsFollows",
    component: mix.fun.loadView(
      "new_comers/RecommendationAndSelectionsFollows"
    ),
    meta: {
      title: "متابعة توصيات الظباط",
      ok: true
    }
  },

  {
    path: "/highLevelDistAdminIndex",
    name: "highLevelDistAdminIndex",
    component: mix.fun.loadView("highLevelDist/Admin/index"),
    meta: {
      title: "مدير نظام",
      ok: true
    }
  },

  {
    path: "/highLevelAdminIndex",
    name: "high_level_admin",
    component: mix.fun.loadView(
      "high_level/highLevelAdmin/highLevelAdminIndex"
    ),
    meta: {
      title: "مدير نظام الراتب العالي",
      ok: true
    }
  },

  {
    path: "/packagingAdminIndex",
    name: "packaging_admin",
    component: mix.fun.loadView("packaging/packagingAdmin/packagingAdminIndex"),
    meta: {
      title: "مدير نظام التعبئة",
      ok: true
    }
  },
  {
    path: "/investigationsAdminIndex",
    name: "investigations_admin",
    component: mix.fun.loadView(
      "investigations/investigationsAdmin/investigationsAdminIndex"
    ),
    meta: {
      title: "مدير نظام قسم التحقيقات",
      ok: true
    }
  },
  {
    path: "/packagePlan",
    name: "package_plan",
    component: mix.fun.loadView("packaging/packagePlan"),
    meta: {
      title: "خطط التعبئة",
      ok: true
    }
  },

  {
    path: "/transferNews",
    name: "transfer_news",
    component: mix.fun.loadView("high_level/transfer_news/TransferNews"),
    meta: {
      title: "نشرات التنقلات",
      ok: true
    }
  },
  {
    path: "/RatebsPhsycoligicalSituations",
    name: "RatebsPhsycoligicalSituations",
    component: mix.fun.loadView("high_level/RatebsPhsycoligicalSituations"),
    meta: {
      title: "المواقف النفسية للراتب العالي",
      ok: true
    }
  },
  {
    path:
      "/TransferListBalancer/:id?/:category?/:DateOfTransferList?/:TimeFirstSergant?/:type?",
    name: "TransferListBalancer",
    component: mix.fun.loadView(
      "high_level/transfer_news/TransferListBalancer"
    ),
    meta: {
      title: "ميزان النشرة",
      ok: true
    }
  },

  {
    path: "/TransferListJobBalancer/:id?/:type?",
    name: "TransferListJobBalancer",
    component: mix.fun.loadView("high_level/transfer_news/JobBlanacer"),
    meta: {
      title: "ميزان الوظائف",
      ok: true
    }
  },
  {
    path: "/AdditionsWorkPlacesFollowers/:id?/",
    name: "AdditionsWorkPlacesFollowers",
    component: mix.fun.loadView("enrollers/AdditionsWorkPlacesFollowers"),
    meta: {
      title: "يومية الأفراد الزائدة",
      ok: true
    }
  },
  {
    path: "/ArchiveFileFollowers/:id?/",
    name: "ArchiveFileFollowers",
    component: mix.fun.loadView("enrollers/ArchiveFileFollowers"),
    meta: {
      title: "الافراد الملحقين بالمؤيد",
      ok: true
    }
  },
  {
    path: "/travels",
    name: "travels",
    component: mix.fun.loadView("high_level/travels"),
    meta: {
      title: "تسجيل سفر راتب عالي",
      ok: true
    }
  },
  {
    path: "/RatebGeneralKnowledge",
    name: "RatebGeneralKnowledge",
    component: mix.fun.loadView("high_level/RatebGeneralKnowledge"),
    meta: {
      title: "معلومات عامة للراتب العالي",
      ok: true
    }
  },
  {
    path: "/ratebRates",
    name: "ratebRates",
    component: mix.fun.loadView("high_level/ratebRates"),
    meta: {
      title: "تقييمات الراتب العالي",
      ok: true
    }
  },
  {
    path: "/inventory",
    name: "inventory",
    component: mix.fun.loadView("high_level/inventory"),
    meta: {
      title: "احداث مخزن كروت راتب عالي",
      ok: true
    }
  },
  {
    path: "/RatebPunishment",
    name: "RatebPunishment",
    component: mix.fun.loadView("high_level/RatebPunishment"),
    meta: {
      title: "عقوبات وجرائم الراتب العالي",
      ok: true
    }
  },
  {
    path: "/Promote",
    name: "Promote",
    component: mix.fun.loadView("high_level/Promote"),
    meta: {
      title: "الترقي",
      ok: true
    }
  },
  {
    path: "/AddTransfer",
    name: "AddTransfer",
    component: mix.fun.loadView("high_level/AddTransfer"),
    meta: {
      title: "أضافة نشرة نقل",
      ok: true
    }
  },
  {
    path: "/ReNew",
    name: "ReNew",
    component: mix.fun.loadView("high_level/ReNew"),
    meta: {
      title: "الترقي",
      ok: true
    }
  },
  {
    path: "/ratebUnCompletedData",
    name: "ratebUnCompletedData",
    component: mix.fun.loadView("high_level/ratebUnCompletedData"),
    meta: {
      title: "بيانات غير متكملة",
      ok: true
    }
  },
  {
    path: "/inventoryLevelup",
    name: "inventoryLevelup",
    component: mix.fun.loadView("high_level/inventoryLevelup"),
    meta: {
      title: "مخزن كروت راتب عالي",
      ok: true
    }
  },
  {
    path: "/tahel",
    name: "tahel",
    component: mix.fun.loadView("high_level/tahel"),
    meta: {
      title: "تأهيل الراتب العالي",
      ok: true
    }
  },
  {
    path: "/RatebTraineeShip",
    name: "RatebTraineeShip",
    component: mix.fun.loadView("high_level/RatebTraineeShip"),
    meta: {
      title: "فرق الراتب العالي",
      ok: true
    }
  },
  {
    path: "/TraineeShip",
    name: "TraineeShip",
    component: mix.fun.loadView("high_level/TraineeShip"),
    meta: {
      title: "إدارة الفرق",
      ok: true
    }
  },
  {
    path: "/level_up",
    name: "level_up",
    component: mix.fun.loadView("high_level/level_up"),
    meta: {
      title: "ترقيات الراتب العالي",
      ok: true
    }
  },
  {
    path: "/Fittings",
    name: "fitting",
    component: mix.fun.loadView("high_level/Fittings"),
    meta: {
      title: "التناسق",
      ok: true
    }
  },
  {
    path: "/pre_unites",
    name: "pre_unites",
    component: mix.fun.loadView("high_level/pre_unites"),
    meta: {
      title: "تسجيل الواحدات السابقة للراتب العالي",
      ok: true
    }
  },

  {
    path: "/followingRigion",
    name: "followingRigion",
    component: mix.fun.loadView("enrollers/followingRigion"),
    meta: {
      title: "مكان الإلحاق",
      ok: true
    }
  },
  {
    path: "/enrollersWorkPlace",
    name: "enrollersWorkPlace",
    component: mix.fun.loadView("enrollers/enrollersWorkPlace"),
    meta: {
      title: "مكان العمل",
      ok: true
    }
  },
  {
    path: "/enrollersStats",
    name: "enrollersStats",
    component: mix.fun.loadView("enrollers/enrollersStats"),
    meta: {
      title: "يوميات الملحقين  ",
      ok: true
    }
  },
  {
    path: "/PrimaryPower",
    name: "PrimaryPower",
    component: mix.fun.loadView("enrollers/PrimaryPower"),
    meta: {
      title: "القوة الأساسية لأماكن العمل",
      ok: true
    }
  },
  {
    path: "/WorkPlacesAllData",
    name: "WorkPlacesAllData",
    component: mix.fun.loadView("enrollers/WorkPlacesAllData"),
    meta: {
      title: "القوة  الكلية لأماكن العمل",
      ok: true
    }
  },
  // {
  //   path: "/PrimaryPowerDaily",
  //   name: "PrimaryPowerDaily",
  //   component: mix.fun.loadView("enrollers/PrimaryPowerDaily"),
  //   meta: {
  //     title: " يومية القوة الأساسية لأماكن العمل",
  //     ok: true
  //   }
  // },
  {
    path: "/enrollersUnitWithWorkplaces",
    name: "enrollersUnitWithWorkplaces",
    component: mix.fun.loadView("enrollers/enrollersUnitWithWorkplaces"),
    meta: {
      title: "يوميات الملحقين باماكن العمل والوحدات  ",
      ok: true
    }
  },
  {
    path: "/followup_admin",
    name: "followup_admin",
    component: mix.fun.loadView("Admin/Followup"),
    meta: {
      title: "متابعة مدير الفرع",
      ok: true
    }
  },
  {
    path: "/mokatabat_wared",
    name: "mokatabat_wared",
    component: mix.fun.loadView("Global/Footer/Mokatabat/Wared"),
    meta: {
      title: "أرشيف المكاتبات - وارد",
      ok: true
    }
  },
  {
    path: "/mokatabat_sader",
    name: "mokatabat_sader",
    component: mix.fun.loadView("Global/Footer/Mokatabat/Sader"),
    meta: {
      title: "أرشيف المكاتبات - صادر",
      ok: true
    }
  },
  {
    path: "/dafater_management",
    name: "dafater_management",
    component: mix.fun.loadView("Dafater/DafaterManage"),
    meta: {
      title: "ادارة الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_stats",
    name: "dafater_stats",
    component: mix.fun.loadView("Dafater/DafaterStats"),
    meta: {
      title: "احصائيات / الافراد بالدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_cons/:imgId?",
    name: "dafater_cons",
    component: mix.fun.loadView("Dafater/DafaterCons"),
    meta: {
      title: "اضافة/ تعديل الافراد بالدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_view",
    name: "dafater_view",
    component: mix.fun.loadView("Dafater/DafaterView"),
    meta: {
      title: "عرض الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_import",
    name: "dafater_import",
    component: mix.fun.loadView("Dafater/Import"),
    meta: {
      title: "تصدير الدفاتر",
      ok: true
    }
  },
  {
    path: "/dafater_statistics",
    name: "dafater_statistics",
    component: mix.fun.loadView("Dafater/DafaterStatistics"),
    meta: {
      title: "احصاءات الدفاتر",
      ok: true
    }
  },
  {
    path: "/calendar/:id?",
    name: "calendar",
    component: mix.fun.loadView("Global/Footer/Calendar"),
    meta: {
      title: "التقويم",
      ok: true
    }
  },
  {
    path: "/messenger",
    name: "messenger",
    component: mix.fun.loadView("Global/Footer/Messenger"),
    meta: {
      title: "الماسنجر",
      ok: true
    }
  },
  {
    path: "/tasadek",
    name: "tasadek",
    component: mix.fun.loadView("Global/Footer/Tasadek"),
    meta: {
      title: "الإلتماسات",
      ok: true
    }
  },
  {
    path: "/change_log",
    name: "change_log",
    component: mix.fun.loadView("Global/Footer/ChangeLog"),
    meta: {
      title: "حول المنظومة",
      ok: true
    }
  },
  {
    path: "/segelat_website",
    name: "segelat_website",
    component: mix.fun.loadView("Global/Footer/SegelatWebsite"),
    meta: {
      title: "موقع السجلات الإلكتروني",
      ok: true
    }
  },
  {
    path: "/all_microfilm/:advanced_search?",
    name: "all_microfilm",
    component: mix.fun.loadView("Global/Footer/Microfilm"),
    meta: {
      title: "الميكروفيلم",
      ok: true
    }
  },
  // قسم النظم
  {
    path: "/nozom_operations/:section?/:id?",
    name: "nozom_operations",
    component: mix.fun.loadView("Nozom/Operations"),
    meta: {
      title: "العمليات الخاصة بالنظم",
      ok: true
    }
  },
  {
    path: "/control_storage",
    name: "control_storage",
    component: mix.fun.loadView("Nozom/ControlStorage"),
    meta: {
      title: "التحكم في وحدة التخزين",
      ok: true
    }
  },
  {
    path: "/add_periods",
    name: "add_periods",
    component: mix.fun.loadView("Nozom/add_periods"),
    meta: {
      title: "اضافة مرحلة تجنيدية",
      ok: true
    }
  },
  // ../قسم النظم
  // الأدمن
  {
    path: "/replacingDuties",
    name: "replacingDuties",
    component: mix.fun.loadView("Nozom/replacingDuties"),
    meta: {
      title: "تبديل الوظائف",
      ok: true
    }
  },
  {
    path: "/admin_operations/:section?/:id?",
    name: "admin_operations",
    component: mix.fun.loadView("Nozom/newOperations"),
    meta: {
      title: "عمليات مدير النظام",
      ok: true
    }
  },
  {
    path: "/scraping_operations/:section?/:id?",
    name: "scraping_operations",
    component: mix.fun.loadView("Nozom/ScrapingOperations"),
    meta: {
      title: "عمليات تحديث البيانات",
      ok: true
    }
  },
  {
    path: "/admin_verifications",
    name: "admin_verifications",
    component: mix.fun.loadView("Admin/Verifications"),
    meta: {
      title: "المراجعة والتصديق",
      ok: true
    }
  },
  {
    path: "/website_blacklists",
    name: "websiteBlacklists",
    component: mix.fun.loadView("Admin/WebsiteBlacklists"),
    meta: {
      title: "الروابط المحظورة",
      ok: true
    }
  },
  {
    path: "/dafater_report",
    name: "dafater_report",
    component: mix.fun.loadView("Admin/DafaterReport"),
    meta: {
      title: "تقرير الدفاتر",
      ok: true
    }
  },
  {
    path: "/s2followup/:ctype?",
    name: "s2followup",
    component: mix.fun.loadView("Admin/S2FolllowUp"),
    meta: {
      title: "متابعة 2 س",
      ok: true
    }
  },
  {
    path: "/edit_units",
    name: "edit_units",
    component: mix.fun.loadView("Admin/EditUnits"),
    meta: {
      title: "الوحدات",
      ok: true
    }
  },
  {
    path: "/Specializations",
    name: "Specializations",
    component: mix.fun.loadView("Admin/Specializations"),
    meta: {
      title: "التخصصات",
      ok: true
    }
  },
  {
    path: "/RecStages",
    name: "RecStages",
    component: mix.fun.loadView("Admin/RecStages"),
    meta: {
      title: "ادارة مراحل التجنيد",
      ok: true
    }
  },
  {
    path: "/Duties",
    name: "Duties",
    component: mix.fun.loadView("Admin/Duties"),
    meta: {
      title: "الوظائف",
      ok: true
    }
  },
  {
    path: "/units_passwords",
    name: "edit_units_passwords",
    component: mix.fun.loadView("Admin/EditUnitsPasswords"),
    meta: {
      title: "باسوردات الوحدات",
      ok: true
    }
  },
  {
    path: "/edit_users",
    name: "edit_users",
    component: mix.fun.loadView("Admin/EditUsers"),
    meta: {
      title: "المستخدمين",
      ok: true
    }
  },
  {
    path: "/admin_stats",
    name: "admin_stats",
    component: mix.fun.loadView("Admin/Stats"),
    meta: {
      title: "احصائات مدير النظام",
      ok: true
    }
  },
  {
    path: "/admin_holder/:id?",
    name: "admin_holder",
    component: mix.fun.loadView("Admin/Holder"),
    meta: {
      title: "هولدر رئيس الفرع",
      ok: true
    }
  },
  {
    path: "/missed_data_admin",
    name: "missed_data_admin",
    component: mix.fun.loadView("Admin/MissedData"),
    meta: {
      title: "أفراد لهم بيانات ناقصة",
      ok: true
    }
  },
  {
    path: "/linked_databases",
    name: "linked_databases",
    component: mix.fun.loadView("Admin/LinkedDatabases"),
    meta: {
      title: "الربط بقواعد بيانات أخرى",
      ok: true
    }
  },
  {
    path: "/describe_demob_date",
    name: "describe_demob_date",
    component: mix.fun.loadView("Admin/DescribeDemobDate"),
    meta: {
      title: "تجربة حساب تاريخ التسريح",
      ok: true
    }
  },
  {
    path: "/fix_demob_date",
    name: "fix_demob_date",
    component: mix.fun.loadView("Admin/FixDemobDate"),
    meta: {
      title: "تصحيح تاريخ التسريح",
      ok: true
    }
  },
  {
    path: "/extract_images",
    name: "extract_images",
    component: mix.fun.loadView("Admin/ExtractImages"),
    meta: {
      title: "استخراج صور الأفراد",
      ok: true
    }
  },
  {
    path: "/admin_too_late",
    name: "admin_too_late",
    component: mix.fun.loadView("Admin/TooLate"),
    meta: {
      title: "المتأخرات المجمعة",
      ok: true
    }
  },
  {
    path: "/connected_devices",
    name: "connected_devices",
    component: mix.fun.loadView("Admin/ConnectedDevices"),
    meta: {
      title: "الأجهزة المتصلة",
      ok: true
    }
  },
  {
    path: "/DevicesManagement",
    name: "DevicesManagement",
    component: mix.fun.loadView("Admin/DevicesManagement"),
    meta: {
      title: "تعريف الأجهزة",
      ok: true
    }
  },
  {
    path: "/user_tracking",
    name: "user_tracking",
    component: mix.fun.loadView("Admin/UserTracking"),
    meta: {
      title: "تتبع المستخدمين",
      ok: true
    }
  },
  {
    path: "/SessionTracking",
    name: "SessionTracking",
    component: mix.fun.loadView("Admin/SessionTracking"),
    meta: {
      title: "تتبع التسجيلات",
      ok: true
    }
  },
  {
    path: "/colleges_management",
    name: "colleges_management",
    component: mix.fun.loadView("Admin/colleges_management"),
    meta: {
      title: "إدارة الكليات",
      ok: true
    }
  },
  {
    path: "/Colours",
    name: "Colours",
    component: mix.fun.loadView("Admin/Colours"),
    meta: {
      title: "إدارة الألوان",
      ok: true
    }
  },
  {
    path: "/changeID",
    name: "changeID",
    component: mix.fun.loadView("Admin/changeID"),
    meta: {
      title: "تغيير الرقم العسكري",
      ok: true
    }
  },
  {
    path: "/CorrectWeaponID",
    name: "CorrectWeaponID",
    component: mix.fun.loadView("Admin/CorrectWeaponID"),
    meta: {
      title: "تصحيح السلاح",
      ok: true
    }
  },
  {
    path: "/ColorPalette",
    name: "ColorPalette",
    component: mix.fun.loadView("Admin/ColorPalette"),
    meta: {
      title: "إدارة مجموعات الألوان",
      ok: true
    }
  },
  {
    path: "/JobsManagement",
    name: "JobsManagement",
    component: mix.fun.loadView("Admin/JobsManagement"),
    meta: {
      title: "إدارة وظائف الراتب العالي",
      ok: true
    }
  },
  {
    path: "/certificator_management",
    name: "certificator_management",
    component: mix.fun.loadView("Admin/certificator_management"),
    meta: {
      title: "إدارة المصدقين",
      ok: true
    }
  },
  {
    path: "/FittingRuleManagement",
    name: "FittingRuleManagement",
    component: mix.fun.loadView("Admin/FittingRuleManagement"),
    meta: {
      title: "شروط التناسق",
      ok: true
    }
  },
  // ../الأدمن
  // قسم التسجيل
  {
    path: "/social_profile/:id?/:section?",
    name: "social_profile",
    component: mix.fun.loadView("tasgeel/SocialProfile"),
    meta: {
      title: "الملف الشخصي",
      ok: true
    }
  },
  {
    path: "/soldiers_plus/:id?/:section?",
    name: "soldiers_plus",
    component: mix.fun.loadView("tasgeel/SoldiersPlus"),
    meta: {
      title: "الراتب العالي والمجندين",
      ok: true
    }
  },
  {
    path: "/TransferListDetails/:id?/:type?",
    name: "TransferListDetails",
    component: mix.fun.loadView("high_level/transfer_news/TransferListDetails"),
    meta: {
      title: "تفاصيل النشرة",
      ok: true
    }
  },
  {
    path: "/PackageCandidates/:id?",
    name: "PackageCandidates",
    component: mix.fun.loadView("packaging/PackageCandidates"),
    meta: {
      title: "تفاصيل الخطة",
      ok: true
    }
  },
  {
    path: "/removedCandidates/:id?",
    name: "removedCandidates",
    component: mix.fun.loadView("packaging/removedCandidates"),
    meta: {
      title: "المشطوبين",
      ok: true
    }
  },
  {
    path: "/packageUnCompletedData",
    name: "packageUnCompletedData",
    component: mix.fun.loadView("packaging/packageUnCompletedData"),
    meta: {
      title: "بيانات غير مكتملة",
      ok: true
    }
  },
  {
    path: "/AddedCandidates/:id?",
    name: "AddedCandidates",
    component: mix.fun.loadView("packaging/AddedCandidates"),
    meta: {
      title: "المضافين",
      ok: true
    }
  },
  {
    path: "/unitDetails/:id?/:PackagedUnitID?",
    name: "unitDetails",
    component: mix.fun.loadView("packaging/unitDetails"),
    meta: {
      title: "تفاصيل الوحدة",
      ok: true
    }
  },
  {
    path: "/UnitJobs/:id?/:PackagedUnitID?/:DailyType?",
    name: "UnitJobs",
    component: mix.fun.loadView("packaging/UnitJobs"),
    meta: {
      title: "وظائف الوحدة",
      ok: true
    }
  },
  {
    path: "/PackagingPlanReports/:id?/:DailyType?",
    name: "PackagingPlanReports",
    component: mix.fun.loadView("packaging/PackagingPlanReports"),
    meta: {
      title: "تقرير الخطط",
      ok: true
    }
  },
  {
    path: "/AllJobsReport/:id?/:DailyType?",
    name: "AllJobsReport",
    component: mix.fun.loadView("packaging/AllJobsReport"),
    meta: {
      title: "تقرير الوظائف",
      ok: true
    }
  },
  {
    path: "/organizationPlanDetails/:id?/:PackagedUnitID?",
    name: "organizationPlanDetails",
    component: mix.fun.loadView("packaging/organizationPlanDetails"),
    meta: {
      title: "تفاصيل خطة رئيس الهيئة 1",
      ok: true
    }
  },
  {
    path: "/CompensationPlanDetails/:id?/:LossGroupID?",
    name: "CompensationPlanDetails",
    component: mix.fun.loadView("packaging/CompensationPlanDetails"),
    meta: {
      title: "تفاصيل مجموعات استعواض الخسائر",
      ok: true
    }
  },
  {
    path: "/CityDaily/:id?/:type?",
    name: "CityDaily",
    component: mix.fun.loadView("packaging/CityDaily"),
    meta: {
      title: "يومية بالمحافظات",
      ok: true
    }
  },
  {
    path: "/RecuRegionDaily/:id?/:type?",
    name: "RecuRegionDaily",
    component: mix.fun.loadView("packaging/RecuRegionDaily"),
    meta: {
      title: "يومية بمناطق التجنيد",
      ok: true
    }
  },
  {
    path: "/RecuEndDatesDaily/:id?/:type?",
    name: "RecuEndDatesDaily",
    component: mix.fun.loadView("packaging/RecuEndDatesDaily"),
    meta: {
      title: "يومية بدفعات الرديف",
      ok: true
    }
  },
  {
    path: "/JobReport/:id?/:DailyType?",
    name: "JobReport",
    component: mix.fun.loadView("packaging/JobReport"),
    meta: {
      title: "تقرير الوظائف للوحدة",
      ok: true
    }
  },
  {
    path: "/PackagePlanDates/:id?",
    name: "PackagePlanDates",
    component: mix.fun.loadView("packaging/PackagePlanDates"),
    meta: {
      title: "دفعات رديف الخطة",
      ok: true
    }
  },
  {
    path: "/CompletePlanDetails/:id?/:PackagedUnitID?",
    name: "CompletePlanDetails",
    component: mix.fun.loadView("packaging/CompletePlanDetails"),
    meta: {
      title: "تفاصيل خطة الاستكمال",
      ok: true
    }
  },
  {
    path: "/PlanCategoryDaily/:id?/:type?",
    name: "PlanCategoryDaily",
    component: mix.fun.loadView("packaging/PlanCategoryDaily"),
    meta: {
      title: "يومية بالتخصصات  ",
      ok: true
    }
  },
  {
    path: "/distriputionpPlanDetails/:id?",
    name: "distriputionpPlanDetails",
    component: mix.fun.loadView("new_comers/distriputionpPlanDetails"),
    meta: {
      title: "عرض خطة التوزيع",
      ok: true
    }
  },
  {
    path: "/comparePlanDetailsWithRecommendations",
    name: "comparePlanDetailsWithRecommendations",
    component: mix.fun.loadView(
      "new_comers/comparePlanDetailsWithRecommendations"
    ),
    meta: {
      title: "مقارنة خطة التوزيع",
      ok: true
    }
  },
  {
    path: "/enrollers_plan_details/:id?",
    name: "enrollers_plan_details",
    component: mix.fun.loadView("enrollers/enrollers_plan_details"),
    meta: {
      title: "عرض خطة الإلحاق",
      ok: true
    }
  },
  {
    path: "/tasgeelAdminIndex",
    name: "tasgeelAdminIndex",
    component: mix.fun.loadView("tasgeel/tasgeelAdmin/tasgeelAdminIndex"),
    meta: {
      title: "مدير نظام قسم التسجيل",
      ok: true
    }
  },
  {
    path: "/RatebRecommendation",
    name: "RatebRecommendation",
    component: mix.fun.loadView("high_level/transfer_news/RatebRecommendation"),
    meta: {
      title: "التوصيات",
      ok: true
    }
  },
  {
    path: "/FutureRecommendations",
    name: "FutureRecommendations",
    component: mix.fun.loadView(
      "high_level/transfer_news/FutureRecommendations"
    ),
    meta: {
      title: "توصيات ما بعد النشرة",
      ok: true
    }
  },
  {
    path: "/FutureRequests",
    name: "FutureRequests",
    component: mix.fun.loadView("high_level/transfer_news/FutureRequests"),
    meta: {
      title: "إلتماسات ما بعد النشرة",
      ok: true
    }
  },
  {
    path: "/RequestManagement",
    name: "RequestManagement",
    component: mix.fun.loadView("high_level/transfer_news/RequestManagement"),
    meta: {
      title: "الألتماسات",
      ok: true
    }
  },
  {
    path: "/TransferIntelligence",
    name: "TransferIntelligence",
    component: mix.fun.loadView(
      "high_level/transfer_news/TransferIntelligence"
    ),
    meta: {
      title: "تنقلات المخابرات",
      ok: true
    }
  },
  {
    path: "/highLevelDaily",
    name: "highLevelDaily",
    component: mix.fun.loadView("high_level/highLevelDaily"),
    meta: {
      title: "يومية عددية بالراتب العالي",
      ok: true
    }
  },
  {
    path: "/LowLevel",
    name: "LowLevel",
    component: mix.fun.loadView("high_level/LowLevel"),
    meta: {
      title: "المستوى الأدنى",
      ok: true
    }
  },
  {
    path: "/highLevelCategoriesDailies",
    name: "highLevelCategoriesDailies",
    component: mix.fun.loadView("high_level/highLevelCategoriesDailies"),
    meta: {
      title: "يومية فئات الراتب العالي",
      ok: true
    }
  },
  {
    path: "/allHighLevelDaily",
    name: "allHighLevelDaily",
    component: mix.fun.loadView("high_level/allHighLevelDaily"),
    meta: {
      title: "يومية عددية المعاشة للراتب العالي",
      ok: true
    }
  },
  {
    path: "/RatebPenalities",
    name: "RatebPenalities",
    component: mix.fun.loadView("high_level/RatebPenalities"),
    meta: {
      title: "عقوبات الراتب العالي من الشبكة العسكرية",
      ok: true
    }
  },
  {
    path: "/OutOfRenew",
    name: "OutOfRenew",
    component: mix.fun.loadView("high_level/renew_new/OutOfRenew"),
    meta: {
      title: "من لديهم موانع لدخول نشرة التجديدات",
      ok: true
    }
  },
  {
    path: "/UnitsDaily",
    name: "UnitsDaily",
    component: mix.fun.loadView("high_level/renew_new/UnitsDaily"),
    meta: {
      title: "يومية عددية بالوحدات",
      ok: true
    }
  },
  {
    path: "/RatebLevelDaily",
    name: "RatebLevelDaily",
    component: mix.fun.loadView("high_level/renew_new/RatebLevelDaily"),
    meta: {
      title: "يومية عددية بالدرجات",
      ok: true
    }
  },
  {
    path: "/OtherRenewCandidates",
    name: "OtherRenewCandidates",
    component: mix.fun.loadView("high_level/renew_new/OtherRenewCandidates"),
    meta: {
      title: "المرشحين للتجديد خارج صلاحية النشرة",
      ok: true
    }
  },
  {
    path: "/RenewAdminIndex",
    name: "RenewAdminIndex",
    component: mix.fun.loadView("high_level/renew_new/RenewAdminIndex"),
    meta: {
      title: "مدير نظام الراتب العالي للتجديدات",
      ok: true
    }
  },
  {
    path: "/RenewListDetails/:id?/:type?",
    name: "RenewListDetails",
    component: mix.fun.loadView("high_level/renew_new/RenewListDetails"),
    meta: {
      title: "تفاصيل النشرة",
      ok: true
    }
  },
  {
    path: "/TransferAllocation/:id?/:type?/:listType?",
    name: "TransferAllocation",
    component: mix.fun.loadView("high_level/transfer_news/TransferAllocation"),
    meta: {
      title: "عرض التوزيعة",
      ok: true
    }
  },
  {
    path: "/TransferAllocationStats/:ID?/:Name?",
    name: "TransferAllocation",
    component: mix.fun.loadView(
      "high_level/transfer_news/TransferAllocationStats/index"
    ),
    meta: {
      title: "احصائيات التوزيعة",
      ok: true
    }
  },
  {
    path: "/RenewFuturePlan",
    name: "RenewFuturePlan",
    component: mix.fun.loadView("high_level/renew_new/RenewFuturePlan"),
    meta: {
      title: "مخطط التجديد المستقبلي",
      ok: true
    }
  },

  {
    path: "/TransferAllocationSnapshoot/",
    name: "TransferAllocationSnapshoot",
    component: mix.fun.loadView(
      "high_level/transfer_news/TransferAllocationSnapshoot"
    ),
    meta: {
      title: "التوزيعات المحفوظة",
      ok: true
    }
  },
  {
    path: "/AllocationComparison/:id?/:type?",
    name: "AllocationComparison",
    component: mix.fun.loadView(
      "high_level/transfer_news/AllocationComparison"
    ),
    meta: {
      title: "مقارنة التوزيعة",
      ok: true
    }
  },
  {
    path: "/LossCompensation/:id?",
    name: "LossCompensation",
    component: mix.fun.loadView("packaging/LossCompensation"),
    meta: {
      title: "تقرير مجموعات إستعواض الخسائر",
      ok: true
    }
  },
  {
    path: "/raisingEfficiency/:id?/:type?",
    name: "raisingEfficiency",
    component: mix.fun.loadView("high_level/transfer_news/raisingEfficiency"),
    meta: {
      title: "رفع كفائة الوحدات",
      ok: true
    }
  },
  {
    path: "/selections_soldiers",
    name: "selections_soldiers",
    component: mix.fun.loadView("new_comers/Selections/SelectionsSoldiers"),
    meta: {
      title: "إنتقاء الجنود",
      ok: true
    }
  },
  {
    path: "/SMRecommandations",
    name: "SMRecommandations",
    component: mix.fun.loadView("new_comers/Selections/SMRecommandations"),
    meta: {
      title: "توصيات الادرات",
      ok: true
    }
  },
  {
    path: "/current_power",
    name: "current_power",
    component: mix.fun.loadView("tasgeel/CurrentPower"),
    meta: {
      title: "تقرير القوة المعاشة",
      ok: true
    }
  },
  {
    path: "/EfficiencyReport",
    name: "EfficiencyReport",
    component: mix.fun.loadView("tasgeel/EfficiencyReport"),
    meta: {
      title: "تقرير الكفاءة القتالية",
      ok: true
    }
  },
  {
    path: "/AllUnitsMawgodDaily",
    name: "AllUnitsMawgodDaily",
    component: mix.fun.loadView("tasgeel/AllUnitsMawgodDaily"),
    meta: {
      title: "يومية تمام القائد ",
      ok: true
    }
  },
  {
    path: "/AllUnitsMawgodDailySeparated",
    name: "AllUnitsMawgodDailySeparated",
    component: mix.fun.loadView("tasgeel/AllUnitsMawgodDailySeparated"),
    meta: {
      title: "يومية تمام القائد بالتفصيل",
      ok: true
    }
  },
  {
    path: "/AllUnitsMawgodDaily2",
    name: "AllUnitsMawgodDaily2",
    component: mix.fun.loadView("tasgeel/AllUnitsMawgodDaily2"),
    meta: {
      title: "يومية تمام القائد 2",
      ok: true
    }
  },
  {
    path: "/AllUnitsMawgodDailySeparated2",
    name: "AllUnitsMawgodDailySeparated2",
    component: mix.fun.loadView("tasgeel/AllUnitsMawgodDailySeparated2"),
    meta: {
      title: "يومية تمام القائد بالتفصيل 2",
      ok: true
    }
  },
  {
    path: "/selections_rateb3ali",
    name: "selections_rateb3ali",
    component: mix.fun.loadView("Selections/SelectionsRateb3ali"),
    meta: {
      title: "إنتقاء الراتب العالي",
      sections: [0, 12, 1, 2, 3, 4, 5, 6],
      ok: true
    }
  },
  {
    path: "/penalties",
    name: "penalties",
    component: mix.fun.loadView("tasgeel/Penalties"),
    meta: {
      title: "العقوبات",
      ok: true
    }
  },
  {
    path: "/AdminFittings",
    name: "AdminFittings",
    component: mix.fun.loadView("high_level/AdminFittings"),
    meta: {
      title: "التناسق الخاص بمدير النظام",
      ok: true
    }
  },
  {
    path: "/add_conscripte/:id?/:type?",
    name: "add_conscripte",
    component: mix.fun.loadView("tasgeel/AddConscripte"),
    meta: {
      title: "إضافة / تعديل فرد",
      ok: true
    }
  },
  {
    path: "/monthly_rev/:section/:unit?",
    name: "monthly_rev",
    component: mix.fun.loadView("tasgeel/MonthlyRev"),
    meta: {
      title: "المراجعة الشهرية",
      ok: true
    }
  },
  {
    path: "/courts_punshmentes",
    name: "courts_punshmentes",
    component: mix.fun.loadView("high_level/courts_punshmentes"),
    meta: {
      title: "المحاكم والعقوبات",
      ok: true
    }
  },
  {
    path: "/VolunteeringTimePlan",
    name: "VolunteeringTimeLinePlan",
    component: mix.fun.loadView("high_level/VolunteeringTimePlan"),
    meta: {
      title:  "الخطة الزمنية للتطوع",
      ok: true
    }
  },
  {
    path: "/VolunteeringRecommendation",
    name: "VolunteeringRecommendation",
    component: mix.fun.loadView("high_level/VolunteeringRecommendation"),
    meta: {
      title:  "توصيات التطوع",
      ok: true
    }
  },
  {
    path: "/grades",
    name: "grades",
    component: mix.fun.loadView("high_level/grades"),
    meta: {
      title: "تقرير الكفاءة",
      ok: true
    }
  },
  {
    path: "/RatebsMedicalSituations",
    name: "RatebsMedicalSituations",
    component: mix.fun.loadView("high_level/RatebsMedicalSituations"),
    meta: {
      title: "المواقف الطبية للراتب العالي",
      ok: true
    }
  },
  {
    path: "/Neshan",
    name: "Neshan",
    component: mix.fun.loadView("high_level/Neshan"),
    meta: {
      title: "النياشين والانواط",
      ok: true
    }
  },
  {
    path: "/RenewNew",
    name: "RenewNew",
    component: mix.fun.loadView("high_level/renew_new/RenewNew"),
    meta: {
      title: "نشرة التجديدات",
      ok: true
    }
  },
  {
    path: "/RenewSuccessDaily",
    name: "RenewSuccessDaily",
    component: mix.fun.loadView("high_level/renew_new/RenewSuccessDaily"),
    meta: {
      title: "تقرير نجاح نشرة تجديد",
      ok: true
    }
  },
  {
    path: "/security_situations",
    name: "security_situations",
    component: mix.fun.loadView("high_level/security_situations"),
    meta: {
      title: "المواقف الامنية",
      ok: true
    }
  },
  {
    path: "/single_job_daily",
    name: "single_job_daily",
    component: mix.fun.loadView("high_level/single_job_daily"),
    meta: {
      title: "يومية خاصة بوظائف معينة",
      ok: true
    }
  },
  {
    path: "/problems_petitions",
    name: "problems_petitions",
    component: mix.fun.loadView("high_level/problems_petitions"),
    meta: {
      title: "الشكاوي و الالتماسات",
      ok: true
    }
  },
  {
    path: "/bulk_promotion",
    name: "bulk_promotion",
    component: mix.fun.loadView("tasgeel/BulkPromotion"),
    meta: {
      title: "إعداد مشروع الترقي",
      ok: true
    }
  },
  {
    path: "/tasgeel_reports",
    name: "tasgeel_reports",
    component: mix.fun.loadView("Tasgeel/Reports"),
    meta: {
      title: "تقارير قسم التسجيل",
      ok: true
    }
  },

  {
    path: "/Martyrs",
    name: "Martyrs",
    component: mix.fun.loadView("personal_affairs/Martyrs"),
    meta: {
      title: "الشهداء",
      ok: true
    }
  },
  {
    path: "/ExcellentParentDaily",
    name: "ExcellentParentDaily",
    component: mix.fun.loadView("personal_affairs/ExcellentParentDaily"),
    meta: {
      title: "يومية عددية الأم المثالية و الأب المثالي",
      ok: true
    }
  },
  {
    path: "/AcademicallyExcellenceDaily",
    name: "AcademicallyExcellenceDaily",
    component: mix.fun.loadView("personal_affairs/AcademicallyExcellenceDaily"),
    meta: {
      title: "يومية عددية متفوقين دراسيا",
      ok: true
    }
  },
  {
    path: "/Death",
    name: "Death",
    component: mix.fun.loadView("personal_affairs/Death"),
    meta: {
      title: "المتوفيين مادة 31",
      ok: true
    }
  },
  {
    path: "/Injured",
    name: "Injured",
    component: mix.fun.loadView("personal_affairs/Injured"),
    meta: {
      title: "المصابين",
      ok: true
    }
  },
  {
    path: "/IdealSoldier",
    name: "IdealSoldier",
    component: mix.fun.loadView("personal_affairs/IdealSoldier"),
    meta: {
      title: "الجندي المثالي",
      ok: true
    }
  },
  {
    path: "/GroupedHonors",
    name: "GroupedHonors",
    component: mix.fun.loadView("personal_affairs/GroupedHonors"),
    meta: {
      title: "التكرييمات الجماعيه",
      ok: true
    }
  },
  {
    path: "/hospital_management",
    name: "hospital_management",
    component: mix.fun.loadView("personal_affairs/hospital_management"),
    meta: {
      title: "ادارة المستشفيات",
      ok: true
    }
  },
  {
    path: "/MedicalRequests",
    name: "MedicalRequests",
    component: mix.fun.loadView("personal_affairs/MedicalRequests"),
    meta: {
      title: "الالتماسات الطبية",
      ok: true
    }
  },
  {
    path: "/GeneralRequests",
    name: "GeneralRequests",
    component: mix.fun.loadView("personal_affairs/GeneralRequests"),
    meta: {
      title: "الالتماسات العامة",
      ok: true
    }
  },
  {
    path: "/AcademicallyExcellence",
    name: "AcademicallyExcellence",
    component: mix.fun.loadView("personal_affairs/AcademicallyExcellence"),
    meta: {
      title: "المتفوقين دراسيا",
      ok: true
    }
  },
  {
    path: "/ExcellentParent",
    name: "ExcellentParent",
    component: mix.fun.loadView("personal_affairs/ExcellentParent"),
    meta: {
      title: "الاب والام المثاليين",
      ok: true
    }
  },
  {
    path: "/officers",
    name: "officers",
    component: mix.fun.loadView("personal_affairs/officers"),
    meta: {
      title: "الضباط",
      ok: true
    }
  },
  {
    path: "/PsychologicalRequests",
    name: "PsychologicalRequests",
    component: mix.fun.loadView("personal_affairs/PsychologicalRequests"),
    meta: {
      title: "الحالات النفسية",
      ok: true
    }
  },
  {
    path: "/MartyrsWifeAndSons/:id?",
    name: "MartyrsWifeAndSons",
    component: mix.fun.loadView(
      "personal_affairs/MartyrsData/MartyrsWifeAndSons"
    ),
    meta: {
      title: "الزوجات والابناء",
      ok: true
    }
  },
  {
    path: "/ParentsAndBrothers/:id?",
    name: "ParentsAndBrothers",
    component: mix.fun.loadView(
      "personal_affairs/MartyrsData/ParentsAndBrothers"
    ),
    meta: {
      title: "الوالدين والاشقاء",
      ok: true
    }
  },
  {
    path: "/Hajj/:id?",
    name: "Hajj",
    component: mix.fun.loadView("personal_affairs/MartyrsData/Hajj"),
    meta: {
      title: "الحج والعمرة",
      ok: true
    }
  },
  {
    path: "/PublicName/:id?",
    name: "PublicName",
    component: mix.fun.loadView("personal_affairs/MartyrsData/PublicName"),
    meta: {
      title: "إطلاق اسم شهيد",
      ok: true
    }
  },
  {
    path: "/Employment/:id?",
    name: "Employment",
    component: mix.fun.loadView("personal_affairs/MartyrsData/Employment"),
    meta: {
      title: "التوظيف",
      ok: true
    }
  },
  {
    path: "/Honors/:id?",
    name: "Honors",
    component: mix.fun.loadView("personal_affairs/MartyrsData/Honors"),
    meta: {
      title: "التكريم",
      ok: true
    }
  },
  {
    path: "/Vaccinators",
    name: "Vaccinators",
    component: mix.fun.loadView("personal_affairs/Vaccinators"),
    meta: {
      title: "التطعيمات المعززة",
      ok: true
    }
  },
  {
    path: "/Demands/:id?",
    name: "Demands",
    component: mix.fun.loadView("personal_affairs/MartyrsData/Demands"),
    meta: {
      title: "التواصل والمطالب",
      ok: true
    }
  },
  {
    path: "/FinancialDues/:id?",
    name: "FinancialDues",
    component: mix.fun.loadView("personal_affairs/MartyrsData/FinancialDues"),
    meta: {
      title: "المستحقات",
      ok: true
    }
  },
  {
    path: "/armingAdminIndex",
    name: "armingAdminIndex",
    component: mix.fun.loadView("arming/armingAdmin/armingAdminIndex"),
    meta: {
      title: "مدير نظام فرع التسليح",
      ok: true
    }
  },
  {
    path: "/UnitsCars",
    name: "UnitsCars",
    component: mix.fun.loadView("arming/UnitsCars"),
    meta: {
      title: "مركبات الوحدات",
      ok: true
    }
  },
  {
    path: "/UnitsBoats",
    name: "UnitsBoats",
    component: mix.fun.loadView("arming/UnitsBoats"),
    meta: {
      title: "لنشات الوحدات",
      ok: true
    }
  },
  {
    path: "/UnitsSystems",
    name: "UnitsSystems",
    component: mix.fun.loadView("arming/UnitsSystems"),
    meta: {
      title: "منظومات الوحدات",
      ok: true
    }
  },
  {
    path: "/officersManagement",
    name: "officersManagement",
    component: mix.fun.loadView(
      "military_management/officers_management/officersManagement"
    ),
    meta: {
      title: "بحث/إضافة ضباط",
      ok: true
    }
  },
  {
    path: "/officerVacationBalanceReport",
    name: "officerVacationBalanceReport",
    component: mix.fun.loadView(
      "military_management/officers_management/officerVacationBalanceReport"
    ),
    meta: {
      title: "تمام أجازات ضباط",
      ok: true
    }
  },
  {
    path: "/OfficerMissionsManagement",
    name: "OfficerMissionsManagement",
    component: mix.fun.loadView(
      "military_management/officers_management/OfficerMissionsManagement"
    ),
    meta: {
      title: "بحث/إضافة مأمورية",
      ok: true
    }
  },
  {
    path: "/FullOfficersDaily",
    name: "FullOfficersDaily",
    component: mix.fun.loadView(
      "military_management/officers_management/FullOfficersDaily"
    ),
    meta: {
      title: "يومية عددية بتمامات ضباط القيادة",
      ok: true
    }
  },
  {
    path: "/OfficerVacationManagement",
    name: "OfficerVacationManagement",
    component: mix.fun.loadView(
      "military_management/officers_management/OfficerVacationManagement"
    ),
    meta: {
      title: "بحث/إضافة أجازة",
      ok: true
    }
  },
  {
    path: "/Obligations",
    name: "Obligations",
    component: mix.fun.loadView(
      "military_management/officers_management/Obligations"
    ),
    meta: {
      title: "بحث/إضافة إلتزام",
      ok: true
    }
  },
  {
    path: "/OfficerCoursesManagement",
    name: "OfficerCoursesManagement",
    component: mix.fun.loadView(
      "military_management/officers_management/OfficerCoursesManagement"
    ),
    meta: {
      title: "بحث/إضافة دورة أو فرقة",
      ok: true
    }
  },
  {
    path: "/OfficersWithBranchesDaily",
    name: "OfficersWithBranchesDaily",
    component: mix.fun.loadView(
      "military_management/officers_management/OfficersWithBranchesDaily"
    ),
    meta: {
      title: "يومية عددية بقوة كل شعبة او فرع",
      ok: true
    }
  },
  {
    path: "/VacationsReports",
    name: "VacationsReports",
    component: mix.fun.loadView(
      "military_management/officers_management/VacationsReports"
    ),
    meta: {
      title: "بيان لضباط الأجازات",
      ok: true
    }
  },
  {
    path: "/BranchOfficersReport",
    name: "BranchOfficersReport",
    component: mix.fun.loadView(
      "military_management/officers_management/BranchOfficersReport"
    ),
    meta: {
      title: "تمام ضباط الشعب والافرع",
      ok: true
    }
  },
  {
    path: "/BranchLeadersReport",
    name: "BranchLeadersReport",
    component: mix.fun.loadView(
      "military_management/officers_management/BranchLeadersReport"
    ),
    meta: {
      title: "تمام رؤساء/نواب الشعب والافرع",
      ok: true
    }
  },
  {
    path: "/CoursesReports",
    name: "CoursesReports",
    component: mix.fun.loadView(
      "military_management/officers_management/CoursesReports"
    ),
    meta: {
      title: "بيان لضباط الدورات والفرق",
      ok: true
    }
  },
  {
    path: "/MissionsReports",
    name: "MissionsReports",
    component: mix.fun.loadView(
      "military_management/officers_management/MissionsReports"
    ),
    meta: {
      title: "بيان لضباط المأموريات",
      ok: true
    }
  },
  {
    path: "/BattalionSpeech",
    name: "BattalionSpeech",
    component: mix.fun.loadView(
      "military_management/officers_management/BattalionSpeech"
    ),
    meta: {
      title: "خطاب إلى كتيبة المقر.",
      ok: true
    }
  },
  {
    path: "/UnitsOfficers",
    name: "UnitsOfficers",
    component: mix.fun.loadView(
      "military_management/officers_management/UnitsOfficers"
    ),
    meta: {
      title: "تمام قادة وحدات حرس الحدود",
      ok: true
    }
  },
  {
    path: "/officersManagementAdminIndex",
    name: "officersManagementAdminIndex",
    component: mix.fun.loadView(
      "military_management/officers_management/officersManagementAdmin/officersManagementAdminIndex"
    ),
    meta: {
      title: "مدير نظام قسم تمام الظباط",
      ok: true
    }
  },
  {
    path: "/AccidentsAdminIndex",
    name: "AccidentsAdminIndex",
    component: mix.fun.loadView(
      "military_management/accidents/accidentsAdmin/AccidentsAdminIndex"
    ),
    meta: {
      title: "مدير نظام قسم الحوادث",
      ok: true
    }
  },
  {
    path: "/Accidents",
    name: "Accidents",
    component: mix.fun.loadView("military_management/accidents/Accidents"),
    meta: {
      title: "الحوادث",
      ok: true
    }
  },
  {
    path: "/Arrears",
    name: "Arrears",
    component: mix.fun.loadView("military_management/accidents/Arrears"),
    meta: {
      title: "المتأخرات",
      ok: true
    }
  },
  {
    path: "/investigations",
    name: "investigations",
    component: mix.fun.loadView("investigations/investigations"),
    meta: {
      title: "بحث/إضافة تحقيقات",
      ok: true
    }
  },
  {
    path: "/Custodies",
    name: "Custodies",
    component: mix.fun.loadView("investigations/Custodies"),
    meta: {
      title: "بحث/إضافة العهد",
      ok: true
    }
  },
  {
    path: "/Complaints",
    name: "Complaints",
    component: mix.fun.loadView("investigations/Complaints"),
    meta: {
      title: "بحث/إضافة الشكاوي والإلتماسات",
      ok: true
    }
  },
  {
    path: "/appeals",
    name: "appeals",
    component: mix.fun.loadView("investigations/appeals"),
    meta: {
      title: "بحث/إضافة طعون",
      ok: true
    }
  },
  {
    path: "/UnitsSignals",
    name: "UnitsSignals",
    component: mix.fun.loadView("arming/UnitsSignals"),
    meta: {
      title: "أجهزة إشارة الوحدات",
      ok: true
    }
  },
  {
    path: "/unitsSystemsReport",
    name: "unitsSystemsReport",
    component: mix.fun.loadView("arming/unitsSystemsReport"),
    meta: {
      title: "بيان منظومات الكهروبصري",
      ok: true
    }
  },

  {
    path: "/too_late/:section",
    name: "too_late",
    component: mix.fun.loadView("Tasgeel/TooLate"),
    meta: {
      title: "المتأخرات",
      ok: true
    }
  },
  {
    path: "/injuries_isFollowed",
    name: "injuries_isFollowed",
    component: mix.fun.loadView("Tasgeel/injuries_isFollowed"),
    meta: {
      title: "متابعة المصابين",
      ok: true
    }
  },
  {
    path: "/ignorants/:search?",
    name: "ignorants",
    component: mix.fun.loadView("Tasgeel/Ignorants"),
    meta: {
      title: "محو الأمية",
      ok: true
    }
  },
  // ../قسم التسجيل
  // قسم الإحتياط
  {
    path: "/e7tyat_files",
    name: "e7tyat_files",
    component: mix.fun.loadView("Admin/E7tyat_Files"),
    meta: {
      title: "دفاتر الإحتياط",
      ok: true
    }
  },
  {
    path: "/radeef",
    name: "radeef",
    component: mix.fun.loadView("E7tyat/Radeef"),
    meta: {
      title: "كشف دفعة رديف",
      ok: true
    }
  },
  {
    path: "/dof3aStatistics",
    name: "dof3aStatistics",
    component: mix.fun.loadView("E7tyat/Dof3aStatistics"),
    meta: {
      title: "كشف احصائية دفعة",
      ok: true
    }
  },
  {
    path: "/report_radeef",
    name: "report_radeef",
    component: mix.fun.loadView("E7tyat/RadeefReport"),
    meta: {
      title: "تقرير دفعة رديف",
      ok: true
    }
  },
  {
    path: "/other_edarat_radeef",
    name: "other_edarat_radeef",
    component: mix.fun.loadView("E7tyat/RadeefReportOthers"),
    meta: {
      title: "رديف الإدارات الآخرى",
      ok: true
    }
  },
  {
    path: "/late_radeef",
    name: "late_radeef",
    component: mix.fun.loadView("E7tyat/LateRadeef"),
    meta: {
      title: "كشف المتأخرين عن التسريح",
      ok: true
    }
  },
  {
    path: "/lates_reserve/:section",
    name: "lates_reserve",
    component: mix.fun.loadView("E7tyat/Lates"),
    meta: {
      title: "المتأخرات",
      ok: true
    }
  },
  {
    path: "/following_reserved_injuries",
    name: "following_reserved_injuries",
    component: mix.fun.loadView("E7tyat/FollowingReservedInjuries"),
    meta: {
      title: "مصابي النقل على الإحتياط",
      ok: true
    }
  },
  {
    path: "/trained_duty",
    name: "trained_duty",
    component: mix.fun.loadView("E7tyat/TrainedDuty"),
    meta: {
      title: "حصر الواجب المدرب عليه",
      ok: true
    }
  },
  // ../قسم الإحتياط
  // قسم الإنهاء
  {
    path: "/kashf_magles_tebby",
    name: "kashf_magles_tebby",
    component: mix.fun.loadView("Enhaa/KashfMaglesTebby"),
    meta: {
      title: "كشف بالعرض على المجلس الطبي",
      ok: true
    }
  },
  {
    path: "/ended_duty_main_data/:id?",
    name: "ended_duty_main_data",
    component: mix.fun.loadView("Enhaa/EndedDutyMainData"),
    meta: {
      title: "البيانات الأساسية للمنتهي خدمتهم",
      ok: true
    }
  },
  {
    path: "/search_enhaa/:todo",
    name: "advanced_search_enhaa",
    component: mix.fun.loadView("Enhaa/AdvancedSearchEnhaa"),
    meta: {
      title: "المنتهي خدمتهم",
      ok: true
    }
  },
  {
    path: "/kashf_40",
    name: "kashf_40",
    component: mix.fun.loadView("Enhaa/Kashf_40"),
    meta: {
      title: "كشف الأربعين",
      ok: true
    }
  },
  {
    path: "/kashf_bologSen",
    name: "kashf_bologSen",
    component: mix.fun.loadView("Enhaa/Kashf_BologSen"),
    meta: {
      title: "كشف بلوغ السن",
      ok: true
    }
  },
  {
    path: "/missed_161s",
    name: "missed_161s",
    component: mix.fun.loadView("Enhaa/Missed161s"),
    meta: {
      title: "منتظر الـ 161 س",
      ok: true
    }
  },
  {
    path: "/military_orders",
    name: "military_orders",
    component: mix.fun.loadView("Enhaa/MilitaryOrders"),
    meta: {
      title: "نشرة الأوامر العسكرية",
      ok: true
    }
  },
  {
    path: "/enhaa_stats",
    name: "enhaa_stats",
    component: mix.fun.loadView("Enhaa/Stats"),
    meta: {
      title: "احصائات بيانية - الإنهاء",
      ok: true
    }
  },
  {
    path: "/websites",
    name: "websites",
    component: mix.fun.loadView("Websites/index"),
    meta: {
      title: "الشبكة العسكرية",
      ok: true
    }
  },
  {
    path: "/TestAnalytics",
    name: "TestAnalytics",
    component: mix.fun.loadView("tasgeel/TestAnalytics"),
    meta: {
      title: "TestAnalytics",
      ok: true
    }
  },

  // ../البوابة
  // استقبال المواطنين
  {
    path: "/db_so/:section?",
    name: "db_so",
    component: mix.fun.loadView("dbs/so/index"),
    meta: {
      title: "استقبال المواطنين",
      ok: true
    }
  },
  {
    path: "/UnitEffectsDetails/:unitID?",
    name: "UnitEffectsDetails",
    component: mix.fun.loadView("tasgeel/UnitEffectsDetails"),
    meta: {
      title: "تفاصيل مؤثرات الوحدة",
      ok: true
    }
  },
  {
    path: "/StageSupportReports",
    name: "StageSupportReports",
    component: mix.fun.loadView("tasgeel/StageSupportReports"),
    meta: {
      title: "تفاصيل امداد المرحلة",
      ok: true
    }
  },
  {
    path: "/CompletePackagePlan/:id?",
    name: "CompletePackagePlan",
    component: mix.fun.loadView("packaging/CompletePackagePlan"),
    meta: {
      title: "خطة الاستكمال",
      ok: true
    }
  },
  {
    path: "/OrganizationPackagePlan/:id?",
    name: "OrganizationPackagePlan",
    component: mix.fun.loadView("packaging/OrganizationPackagePlan"),
    meta: {
      title: "خطة رئيس الهيئة 1",
      ok: true
    }
  },
  {
    path: "/SecurityExcluded",
    name: "SecurityExcluded",
    component: mix.fun.loadView("packaging/SecurityExcluded"),
    meta: {
      title: "المستبعدين أمنيا",
      ok: true
    }
  },
  {
    path: "/HonorsReports",
    name: "HonorsReports",
    component: mix.fun.loadView("personal_affairs/reports/HonorsReports"),
    meta: {
      title: "تقارير التكريمات",
      ok: true
    }
  },
  {
    path: "/PublicNameReports",
    name: "PublicNameReports",
    component: mix.fun.loadView("personal_affairs/reports/PublicNameReports"),
    meta: {
      title: "تقارير اطلاق اسم شهيد",
      ok: true
    }
  },
  {
    path: "/HousingReports",
    name: "HousingReports",
    component: mix.fun.loadView("personal_affairs/reports/HousingReports"),
    meta: {
      title: "تقارير الإسكان",
      ok: true
    }
  },
  {
    path: "/EmploymentReports",
    name: "EmploymentReports",
    component: mix.fun.loadView("personal_affairs/reports/EmploymentReports"),
    meta: {
      title: "تقارير التوظيف",
      ok: true
    }
  },
  {
    path: "/WivesAndSonsReports",
    name: "WivesAndSonsReports",
    component: mix.fun.loadView("personal_affairs/reports/WivesAndSonsReports"),
    meta: {
      title: "تقارير الأقارب",
      ok: true
    }
  },
  {
    path: "/HajjReports",
    name: "HajjReports",
    component: mix.fun.loadView("personal_affairs/reports/HajjReports"),
    meta: {
      title: "تقارير الحج والعمرة",
      ok: true
    }
  },
  {
    path: "/DemandsReports",
    name: "DemandsReports",
    component: mix.fun.loadView("personal_affairs/reports/DemandsReports"),
    meta: {
      title: "تقارير التواصل والمطالب",
      ok: true
    }
  },
  {
    path: "/WorkPlacesAdditions",
    name: "WorkPlacesAdditions",
    component: mix.fun.loadView("enrollers/WorkPlacesAdditions"),
    meta: {
      title: "أماكن العمل للزيادة",
      ok: true
    }
  },
  {
    path: "/trainingOrderAdvancedSearch",
    name: "trainingOrderAdvancedSearch",
    component: mix.fun.loadView("enrollers/trainingOrderAdvancedSearch"),
    meta: {
      title: "أمر مهمة تدريبية",
      ok: true
    }
  },
  {
    path: "/TrainingOrderUnitWithWorkplaces",
    name: "TrainingOrderUnitWithWorkplaces",
    component: mix.fun.loadView("enrollers/TrainingOrderUnitWithWorkplaces"),
    meta: {
      title: "يوميات المهمة التدريبية الوحدات بأماكن العمل",
      ok: true
    }
  },
  {
    path: "/EnrollersAdminIndex",
    name: "EnrollersAdminIndex",
    component: mix.fun.loadView("enrollers/EnrollersAdminIndex"),
    meta: {
      title: "مدير نظام قسم الملحقيين",
      ok: true
    }
  },
  {
    path: "/AdditionsWorkPlacesFollowersDaily",
    name: "AdditionsWorkPlacesFollowersDaily",
    component: mix.fun.loadView("enrollers/AdditionsWorkPlacesFollowersDaily"),
    meta: {
      title: "يومية أماكن العمل للزيادة",
      ok: true
    }
  },
  {
    path: "/PrivatePages",
    name: "PrivatePages",
    component: mix.fun.loadView("Admin/PrivatePages"),
    meta: {
      title: "إدارة الصفحات الخاصة",
      ok: true
    }
  },
  {
    path: "/Causations",
    name: "Causations",
    component: mix.fun.loadView("investigations/Causations"),
    meta: {
      title: "السببيات",
      ok: true
    }
  },
  {
    path: "/FollowersArchiveFiles",
    name: "FollowersArchiveFiles",
    component: mix.fun.loadView("enrollers/FollowersArchiveFiles"),
    meta: {
      title: "ملفات المؤيدات",
      ok: true
    }
  },
  {
    path: "/WorkPlacePrimaryPowerConscriptes/:id?",
    name: "WorkPlacePrimaryPowerConscriptes",
    component: mix.fun.loadView("enrollers/WorkPlacePrimaryPowerConscriptes"),
    meta: {
      title: "افراد القوة الأساسية في مكان العمل",
      ok: true
    }
  },
  {
    path: "/WorkPlaceAllDataConscriptes/:id?",
    name: "WorkPlaceAllDataConscriptes",
    component: mix.fun.loadView("enrollers/WorkPlaceAllDataConscriptes"),
    meta: {
      title: "افراد  مكان العمل",
      ok: true
    }
  },
  {
    path: "/OtherLoss/:id?",
    name: "OtherLoss",
    component: mix.fun.loadView("military_management/accidents/loss/OtherLoss"),
    meta: {
      title: "الخسائر الأخرى الخاصة بالحادثة",
      ok: true
    }
  },
  {
    path: "/HumanLoss/:id?",
    name: "HumanLoss",
    component: mix.fun.loadView("military_management/accidents/loss/HumanLoss"),
    meta: {
      title: "الخسائر البشرية الخاصة بالحادثة",
      ok: true
    }
  }
];

routes.forEach((r, i) => {
  let c = r.component;
  if (!r.meta) {
    r.meta = {};
  }
  r.meta.component = c;
});

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  routes
});

let appStarted = false;

router.beforeEach((to, from, next) => {
  // NProgress.start();
  // mix.fun.setRouter(to);
  // next();
  console.log(to.fullPath);
  if (!appStarted) {
    appStarted = true;
    if (!to.fullPath.includes("websites")) {
      console.log(to.fullPath);
      next("/");
      //next("cards/profile/1988311034851");
      return;
    }
  }
  if (to && to.meta && to.meta.ok) {
    mix.fun.setRouterObj(to.fullPath, from.fullPath);
    mix.fun.setNewRoute(to);
    if (to.name) {
      NProgress.start();
      if (to.meta.title) {
        document.title = to.meta.title + " - " + mix.vars.app_title;
        mix.fun.commit("setRouterTitle", to.meta.title);
      } else {
        mix.fun.return_defaults();
      }
    } else {
      mix.fun.return_defaults();
    }
    let toNext,
      noAuthPath = "/eauth",
      authPath = "/dashboard",
      indexPath = "/index.html";
    const requiresAuth = to.matched.some(x => x.meta.requiresAuth);
    const requiresNoAuth = to.matched.some(x => x.meta.requiresNoAuth);
    const allowed_sections = to.meta.sections;
    const currentUser = mix.fun.currentUser();
    const user_section = currentUser ? currentUser.section : null;
    if (
      currentUser &&
      allowed_sections &&
      allowed_sections.length > 0 &&
      !allowed_sections.includes(user_section)
    ) {
      toNext = noAuthPath;
    }
    if (from.path == noAuthPath && to.meta.requiresAuth) {
      // Do nothing
    } else if (from.path == authPath && to.meta.requiresNoAuth) {
      // Do nothing
    } else {
      if (requiresAuth && !currentUser) {
        toNext = noAuthPath;
      } else if (requiresNoAuth && currentUser) {
        toNext = authPath;
      } else {
        // Do nothing
      }

      if (to.fullPath == indexPath) {
        toNext = "/";
      }
      next(toNext);
    }
  } else {
    let toSplitter =
        to && to.fullPath
          ? to.fullPath.split("segelat/resources/app.asar")
          : "/",
      customTo = toSplitter[1] ? toSplitter[1] : "/";
    next(customTo);
  }
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
