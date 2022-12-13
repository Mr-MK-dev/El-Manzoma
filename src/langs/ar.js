"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  /*
        General
      */
  title: {
    first: "السجلات",
    second: "العسكرية"
  },
  badge: "",
  account: {
    login: "تسجيل الدخول",
    register: "التسجيل",
    email: "الإيميل",
    phone: "الهاتف",
    create: "إنشاء",
    account: "حساب",
    my_account: "حسابي",
    password: "كلمة المرور",
    verification: "التحقق",
    code: "رمز",
    verification_code: "رمز التحقق"
  },
  dir: {
    next: "التالي",
    prev: "السابق",
    up: "أعلى",
    down: "أسفل",
    left: "يسار",
    right: "يمين",
    toward: "للأمام",
    backward: "للخلف"
  },
  langs: {
    langs: "اللغات",
    ar: "العربية",
    en: "الإنجليزية"
  },
  themes: {
    themes: "السمات",
    light: "النهار",
    dark: "الليل"
  },
  or: "أو",
  close: "إغلاق",
  dataIterator: {
    pageText: "{0}-{1} من {2}",
    noResultsText: "لا توجد سجلات مطابقة",
    loadingText: "تحميل العناصر ..."
  },
  dataTable: {
    itemsPerPageText: "العناصر لكل صفحة:",
    ariaLabel: {
      sortDescending: ": ترتيب تنازلي . إضغط لإلغاء الترتيب.",
      sortAscending: ": ترتيب تصاعدي . إضغط للترتيب التنازلي.",
      sortNone: ": غير مرتب . إضغط للترتيب التصاعدي.",
      activateAscending: "تفعيل التصاعدي",
      activateDescending: "تفعيل التنازلي",
      activateNone: "عدم تفعيل شيء"
    },
    sortBy: "ترتيب حسب"
  },
  dataFooter: {
    itemsPerPageText: "العناصر لكل صفحة:",
    itemsPerPageAll: "الكل",
    nextPage: "الصفحة التالية",
    prevPage: "الصفحة السابقة",
    firstPage: "الصفحة الأولى",
    lastPage: "الصفحة الأخيرة",
    pageText: "{0}-{1} من أصل {2}"
  },
  datePicker: {
    itemsSelected: "{0} المحدد"
  },
  noDataText: "لا توجد بيانات متاحة",
  carousel: {
    prev: "الصورة السابقة",
    next: "البصري التالي"
  },
  calendar: {
    moreEvents: "{0} أكثر من"
  },
  fileInput: {
    counter: "{0} ملفات",
    counterSize: "{0} ملفات ({1} في الإجمالي)"
  },
  /*
        Global Sections
      */
  // 1. Top app bar
  topbar: {
    stats: "الإحصائات",
    settings: "الإعدادات"
  },
  // 2. Side app bar
  sidebar: {
    dbs: {
      // so: {
      // }
    },
    sections: {
      "12": {
        _self: "قسم النظم",
        operations: "عمليات قسم النظم",
        describe_demob_date: "تجربة حساب تاريخ التسريح",
        fix_demob_date: "تصحيح تاريخ التسريح",
        extract_images: "استخراج صور الأفراد",
        control_storage: "التحكم في وحدة التخزين",
        add_periods: "اضافة مرحلة تجنيدية"
      },
      "0": {
        _self: "مدير النظام",
        Colours: "الوان المنظومة",
        changeID: "تغيير الرقم العسكري",
        CorrectWeaponID: "تصحيح السلاح",
        ColorPalette: "مجموعات الالوان",
        SessionTracking: "تتبع التسجيلات",
        replacingDuties: "تبديل الوظائف",
        DevicesManagement: "إدارة الأجهزة",
        SystemControl: "لوحة التحكم",
        followup_admin: "متابعة مدير النظام",
        colleges_management: "إدارة الكليات",
        JobsManagement: "إدارة وظائف الراتب العالي",
        certificator_management: "إدارة المصدقين",
        FittingRuleManagement: "شروط التناسق",
        operations: "عمليات قسم النظم",
        ScrapingOperations: "عمليات تحديث البيانات",
        openDevTools: "openDevTools",
        user_tracking: "تتبع المستخدمين",
        WeaponManagement: "إدارة الأسلحة للجنود",
        RatebWeaponManagement: "إدارة الأسلحة للراتب العالي",
        home: "الصفحة الرئيسية",
        dashboard: "لوحة التحكم",
        verifications: "المراجعة والتصديق",
        dafaterReport: "تقرير الدفاتر",
        s2followup: "متابعة 2 س",
        edit_users: "المستخدمين",
        users_groups: "مجموعات المستخدمين",
        PrivatePages: "ادارة الصفحات الخاصة",
        edit_units: "ادرارة الوحدات والسرايا",
        Specializations: "التخصصات",
        rec_stages: "ادارة مراحل التجنيد",
        Duties: "إدارة الوظائف",
        LevelManagement: "إدارة الدرجات",
        OfficerDuties: "إدارة وظائف الضباط",

        edit_units_passwords: "باسوردات الوحدات",
        admin_stats: "احصائات",
        missed_data: "بيانات ناقصة",
        linked_databases: "الربط بقواعد بيانات أخرى",
        admin_too_late: "المتأخرات المجمعة",
        connected_devices: "الأجهزة المتصلة",
        website_blacklists: "الروابط المحظورة على الشبكة",
        admin_holder: "هولدر رئيس الفرع",
        points: "ادارة النقط",
        points_hubs: "ادارة السرايا",
        sector_management: "القطاعات",
        special_organized_units_management: "التنظيمات الخاصة للوحدات",
        recu_start_dates: "تواريخ التجنيد",
        unit_collections: "تجميعات قتالية",
        review_plan: "خطط المراجعة"
      },
      "1": {
        _self: "قسم التسجيل",
        TestAnalytics: "TestAnalytics",
        tasgeelAdminIndex: "مدير نظام قسم التسجيل",
        new_profile: "البروفايل الجديد",
        unCompletedData: "بيانات غير مكتملة",
        injuries: "الحالات الإصابية / المرضية",
        TaskenStats: "بيان التسكين",
        all_dailes: "اليوميات",
        endSoldiersService: "نقل الى الاحتياط",
        soldier_plus: " المجندين",
        monthly_rev: "المراجعة الشهرية",
        promotion: "مشروع الترقي",
        reports: "التقارير",
        SupportRecommandations: "تقرير الامداد",
        UnitEffects: "تقرير بمؤترات الواحدات",
        injuries_isFollowed: "متابعة المصابين",
        kashf_magles_tebby: "المجلس الطبي",
        penalties: "العقوبات",
        CurrentPower: "يومية القوة المعاشة",
        EfficiencyReport: "تقرير الكفاءة القتالية",
        StageSupportReports: "تقرير امداد المرحلة",
        AllUnitsMawgodDaily: "يومية تمام القائد",
        AllUnitsMawgodDaily2: "يومية تمام القائد2",
        AllUnitsMawgodDailySeparated: "يومية تمام القائد بالتفصيل",
        AllUnitsMawgodDailySeparated2: "يومية تمام القائد بالتفصيل2",
        HighUnitsDaily: "يومية الراتب العالي بوحدات حرس الحدود",
        weapons_daily: "يومية عددية للادارات",
        TheOutageCompleteDaily: "يومية استعواض المسرح",
        TransportLicense: "تراخيص النقل",
        moveSoldiersToServe: "نقل دفعة جديدة للخدمة",
        transportLicenseSM: "ترخيص نقل إدارات تخصصيه",
        UnitAndKnowledgeLevelDaily: "يومية عددية (وحدات - مؤهلات)",
        categories_dailes: "اليومية العددية",
        single_category_daily: "يومية بفئة معينة",
        _360_normal_dailes: "يومية 360 عادة",
        _360_mokrar_dailes: "يومية 360 مكرر",
        mokrar_360_dailes_dynamic: "يومية 360 مكرر بناء علي المرتبات",
        SMYearQuarter: "يومية الربع السنوي",
        internalFollowTasgeel: "متابعة داخلية قسم التسجيل",
        review_plan: "خطط المراجعة"
      },

      "2": {
        _self: "قسم المستجدين",
        addNewcomer: "إضافة فرد",
        EngineersReport: "يومية المهندسين بالتخصصات",
        LeaderTmam: "تمام القائد",
        ArrivalToTrainingCenterDates: "تواريخ ترحيل مركز التدريب",
        SoldiersMedicalSituations: "المواقف الطبية ",
        SoldiersSelectionSituations: "مواقف الانتقاء والتوجيه ",
        SoldiersPhsycoligicalSituations: "المواقف جهاز العمل النفسي",
        SoldierSecuritySituations: "المواقف الأمنيه",
        new_comers_admin: "مدير نظام المستجدين",
        tmam_elwosol: "تمام الوصول",
        distributed_suggest: "خطة التوزيع",
        comparePlanDetailsWithRecommendations: "مقارنة خطة التوزيع",
        tmam_eltasgel: "تمام التسجيل",
        all_situations: "المواقف",
        all_tamam: "التمامات",
        review_stage: "إضافة وحدات ووظائف للمرحلة",
        addNationalIds: "إضافة أرقام قومية للمرحلة",
        all_recommandations: "كل التوصيات",
        recommandations: "توصيات حرس حدود",
        dalies: " اليوميات العددية للمجندين ",
        soliders_brothers: " تسجيل الاشقاء",
        tmam_eltarhel: "تمام الترحيل",
        effects: "مؤثرات المرحلة",
        trained_duty: "حصر الواجب المدرب عليه",
        tmam_elthr7el: "تمام الترحيل",
        selections_soldiers: "انتقاء الجنود",
        SMRecommandations: "توصيات الإدارات",
        CollegeDaily: "يومية عددية بالكليات",
        RecommendationAndSelections: "توصيات إنتقاءات",
        OfficerSoldierRecommendation: "توصيات ظابط/جندي",
        RecommendationAndSelectionsEdit: "تسجيل نتيجة الانتقاء",
        RecommendationAndSelectionsFollows: "متابعة توصيات الظباط",
        newComersTransportLicense: "تراخيص نقل المستجدين",
        internalFollowNewComers: "متابعة داخلية قسم المستجدين"
      },
      "3": {
        _self: "فرع تنظيم المرتبات",
        AddUnits: "إدارة الوحدات",
        drivers_support: "سياسة إمداد السائقين",
        supplying_regions: "جهات الإمداد",
        Duties: "إدارة الوظائف",
        OfficerDuties: "إدارة وظائف الضباط",
        command_regions: "المستوى الأعلى",
        mortabat_duties: "بيان المرتبات والسياسات ونسبة الإستكمال",
        mortabat_duties_per_unit: "بيان وظائف وحدة",
        MortbatAndMwgodatDaily: "يومية المرتبات والموجودات",
        add_weapon_duty: "إضافة وظائف الى جهة إمداد",
        following_areas: "جهة التابعية",
        pattern: "النمط",
        unit_managment: "اداراة الوحدات",
        stats: "احصاءات بيانية",
        internalFollowSalaries: "متابعة داخلية قسم المرتبات",
        review_plan: "خطط المراجعة"
      },
      "4": {
        _self: "قسم النظم",
        fugitives: "الهاربين",
        advanced_search: "البحث المتقدم",
        stats: "احصاءات",
        late_stuff: "المتأخرات",
        name_change_requests: "طلبات تعديل الأسماء",
        print_reports: "طباعة تقارير",
        missed_data: "استعلام عن بيانات ناقصة"
      },
      haseb: {
        _self: "الحاسب"
      },
      gate: {
        _self: "البوابة",
        today: "اليوم",
        archive: "أرشيف البوابة",
        followup: "المتابع",
        black_list: "القائمة السوداء"
      },
      "5": {
        _self: "الميكروفيلم",
        all_microfilm: "الميكروفيلم",
        ignorants: "محو الأمية"
      },
      "6": {
        _self: "نشرة تنقالات الراتب العالي",
        high_level_admin: "مدير نظام الراتب العالي"
      },
      "14": {
        _self: "قسم الشئون الشخصية",
        vaccination_admin: "مدير نظام",
        IdealSoldier: "الجندي المثالي",
        Vaccinators: "التطعيمات المعززة",
        all_dailes: "اليوميات العددية",
        ExcellentParentDaily: "يومية عددية الأم المثالية و الأب المثالي",
        AcademicallyExcellenceDaily: "يومية عددية متفوقين دراسيا",
        GroupedHonors: "التكرييمات الجماعية",
        personal_affairs_admin: "مدير نظام الشئون الشخصية",
        PublicNameReports: "تقارير اطلاق اسم شهيد",
        AcademicallyExcellence: "المتفوقين دراسيا",
        ExcellentParent: "الأب و الأم المثاليين",
        reports: "التقارير",
        HonorsReports: "تقارير التكريمات",
        HousingReports: "تقارير الإسكان",
        EmploymentReports: "تقارير التوظيف",
        WivesAndSonsReports: "تقارير الأقارب",
        HajjReports: "تقارير الحج والعمرة",
        DemandsReports: "تقارير التواصل والمطالب",
        martyrs: "الشهداء",
        Death: "الوفاه مادة 31",
        officers: "الضباط ",
        Injured: "المصابين",
        InjuredAndHospital: "كشف المرضي و المصابين بالمستشفيات",
        MedicalRequests: "الالتماسات الطبية",
        GeneralRequests: "الالتماسات العامة",
        PsychologicalRequests: "الحالات النفسية"
      },
      "15": {
        _self: "المتابعة",
        Follow: "البوسطة",
        InternalFollowup: "المتابعة الداخلية"
      },
      "16": {
        _self: "فرع التسليح",
        arming_admin: "مدير نظام فرع التسليح",
        unitsSystemsReport: "بيان منظومات الكهروبصري",
        UnitsCars: "مركبات الوحدات",
        UnitsBoats: "لنشات الوحدات",
        UnitSignals: "أجهزة إشارة الوحدات",
        UnitsSystems: "منظومات الوحدات"
      },
      "18": {
        _self: "قسم التعبئة",
        packaging_admin: "مدير نظام قسم التعبئة",
        package_plan: "خطط التعبئة",
        packageUnCompletedData: "بيانات غير مكتملة",
        SecurityExcluded: "المستبعدين أمنيا"
      },
      "19": {
        _self: "قسم التحقيقات",
        investigations: "التحقيقات",
        Complaints: "الشكاوي والإلتماسات",
        appeals: "الطعون",
        Causations: "السببيات",
        investigations_admin: "مدير نظام قسم التحقيقات",
        Custodies: "العهد"
      },
      "20": {
        _self: "فرع الادارة العسكرية",
        officersManagementTitle: " قسم تمام الظباط",
        Accidents: "الحوادث",
        Arrears: "المتأخرات",
        accidentsManagementTitle: " قسم الحوادث",
        officersManagementAdminIndex: "مدير نظام قسم تمام الظباط",
        accidentsManagementAdminIndex: "مدير نظام قسم الحوادث",
        officersManagement: "شعب وأفرع",
        OfficerMissionsManagement: "بحث/إضافة مأموريات",
        OfficerVacationManagement: "بحث/إضافة أجازة",
        Obligations: "بحث/إضافة إلتزامات",
        OfficerCoursesManagement: "بحث/إضافة دورات أو فرق",
        OfficersWithBranchesDaily: "يومية عددية بقوة كل شعبة او فرع",
        UnitsOfficers: "تمام قادة وحدات حرس الحدود",
        FullOfficersDaily: "يومية عددية بتمامات ضباط القيادة",
        VacationsReports: "بيان لضباط الأجازات",
        officerVacationBalanceReport: "تمام أجازات الضباط",
        BranchOfficersReport: "تمام ضباط الشعب والافرع",
        BranchLeadersReport: "تمام رؤساء ونواب الشعب والافرع",
        CoursesReports: "بيان لضباط الدورات والفرق",
        MissionsReports: "بيان لضباط المأموريات",
        BattalionSpeech: "خطاب إلى كتيبة المقر",
        officersReports: "اليوميات"
      },

      "7": {
        // قسم الملحقين
        _self: " قسم الملحقين",
        enrollers_admin: "مدير نظام قسم الملحقيين",
        NamesAndReports: "اليوميات والأسماء",
        soldiersNotifications: "إشعارات المجندين الملحقين",
        StagesWork: "المراحل التجنيدية",
        enrollersAdvancedSearch: "بحث متقدم فالملحقين",
        trainingOrderAdvancedSearch: "أمر مهمة تدريبية",
        SituationsAndEffects: "المواقف والمؤثرات",
        LeaderCertificationReport: "يومية تصديق القائد",
        ratebsNotifications: "إشعارات الراتب العالي الملحقين",
        malaheq_suggest: "مقترح ملاحق المرحلة",
        FollowersArchiveFiles: "ملفات المؤيدات",
        enrollers_plan: "مخطط الإلحاق",
        enrollersEffects: "المؤثرات",
        followingRigion: "أماكن الإلحاق ",
        enrollersWorkPlace: "أماكن العمل",
        workPlaceAddition: "الزيادة في أماكن العمل",
        AdditionsWorkPlacesFollowersDaily:
          "يومية بالأفراد الزيادة في أماكن العمل",
        all_dailes: "اليوميات",
        enrollersStats: " يوميات الملحقين باماكن العمل",
        enrollersUnitWithWorkplaces: "يوميات الوحدات بأماكن العمل",
        TrainingOrderUnitWithWorkplaces:
          "يوميات المهمة التدريبية الوحدات بأماكن العمل",
        PrimaryPower: "القوة الأساسية لأماكن العمل",
        WorkPlacesAllData: "القوة  الكلية لأماكن العمل",
        // PrimaryPowerDaily: "يومية القوة الأساسية",
        enrollersUnitWithCategories: "يومية فئات وحدات",
        enrollersCategoriesWithWorkplaces: "يومية فئات أماكن عمل",
        enrollers_Recu_Dialies: "يومية ملاحق المرحلة",
        enrollers_Recu_Dialies_By_Unit: "يومية ملاحق المرحلة بالوحدة",
        internalFollowEnrollers: "متابعة داخلية لقسم الملحقين",
        review_plan: "خطط المراجعة"
      },
      "8": {
        _self: "الراتب العالي",
        RatebsPhsycoligicalSituations: "المواقف النفسية للراتب العالي",
        high_level_admin: "مدير نظام الراتب العالي",
        ratebUnCompletedData: "بيانات غير مكتملة",
        ratebRates: "تقييمات الراتب العالي",
        transfer_news: "نشرة التنقلات",
        RatebTraineeShip: "الفرق",
        RatebPunishment: "عقوبات وجرائم الراتب العالي",
        TraineeShip: "أسماء الفرق",
        LowLevel: "المستوى الأدنى",
        highLevelDaily: "يومية عددية بالراتب العالي",
        highLevelCategoriesDailies: "يومية فئات الراتب العالي",
        allHighLevelDaily: "يومية عددية المعاشة للراتب العالي",
        courts_punshmentes: "المحاكم والعقوبات",
        security_situations: "المواقف الامنية",
        single_job_daily: "يومية خاصة بوظائف معينة",
        problems_petitions: "الشكاوي و الالتماسات",
        travels: "تسجيل السفر",
        RenewNew: "نشرة التجديدات",
        pre_unites: "الواحدت السابقة",
        inventory: "احداث المخزن",
        RatebPenalities: "عقوبات الراتب العالي من الشبكة العسكرية",
        OutOfRenew: "من لديهم موانع لدخول نشرة التجديدات",
        RenewSuccessDaily: "تقرير نجاح نشرة التجديد",
        UnitsDaily: "يومية عددية بالوحدات",
        RatebLevelDaily: "يومية عددية بالدرجات",
        all_dailies_renew: "اليوميات العددية",
        OtherRenewCandidates: "المرشحين للتجديد إدارات تخصصية",
        RenewAdminIndex: "مدير نظام الراتب العالي للتجديدات",
        TransferAllocation: "توزيعة نشرة الأنتقالات",
        RequestManagement: "إدارة الألتماسات",
        grades: "تقرير الكفاءة",
        Neshan: "النياشين والانواط",
        inventoryLevelup: "المخزن",
        VolunteeringTimePlan: "الخطة الزمنية للتطوع",
        VolunteeringRecommendation: "توصيات التطوع",
        tahel: "التأهيل",
        RatebRecommendation: "التوصيات",
        FutureRecommendations: "توصيات ما بعد النشرة",
        FutureRequests: "إلتماسات ما بعد النشرة",
        TransferIntelligence: "تنقلات المخابرات",
        RatebsMedicalSituations: "المواقف الطبية للراتب العالي",
        AddTransfer: "أضافة نشرة نقل",
        level_up: "الترقيات",
        fitting: "التناسق",
        AdminFittings: "التناسق الخاص بمدير النظام",
        RatebGeneralKnowledge: "معلومات عامة للراتب العالي",
        Promote: "الترقي",
        ReNew: "التجديد",
        RenewFuturePlan: "مخطط التجديد المستقبلي",
        internalFollowHigh: "متابعة داخلية قسم الراتب العالي",
        review_plan: "خطط المراجعة",
        TransferAllocationSnapshoot: "الخطط المحفوظة"
      },
      "9": {
        _self: "نشرة تجديد الراتب العالي"
      },
      "10": {
        // cards in_service and out_service
        _self: "البطاقات العلاجية",
        cards_in_service: "البطاقات العلاجية بالخدمة",
        cards_out_service: "البطاقات العلاجية المنتهية",
        cards_search: "بحث متقدم للبطاقات"
      },
      "11": {
        // cards in_service and out_service
        _self: "أسئلة",
        gate_services: "أسئلة البوابة",
        tsgel: "أسئلة التسجيل",
        anhaa: "أسئلة الانهاء",
        hasb: "أسئلة الحاسب"
      }
      // ! You can't use '12' because it's for nozom
    },
    language: "اللغة",
    theme: "السمات",
    langs: {
      ar: "العربية",
      en: "الإنجليزية"
    },
    themes: {
      light: "النهار",
      dark: "الليل"
    },
    install_app: "تثبيت التطبيق",
    changelog: "سجل الإصدارات",
    segelat_website: "موقع السجلات الإلكتروني",
    e7tyat_docs: "دفاتر الإحتياط",
    tasadek: "الإلتماسات",
    calendar: "التقويم",
    messenger: "الماسنجر",
    change_log: "حول المنظومة",
    followup: "المتابعة",
    changePassword: "تغيير كلمة المرور",
    websites: "الشبكة العسكرية",
    logout: "تسجيل الخروج"
  },
  // 3. Footer
  footer: {},
  /*
        Pages
      */
  // 1. Home
  home: {
    settings: {
      _pending: "الخاصية تحت الإنشاء",
      themes: "السمات",
      themes_desc: "ضبط الألوان للسمات.",
      _themes: {
        primary: "اللون الأساسي",
        secondary: "اللون الثانوي",
        girly: "لون الإناث",
        accent: "لون النبرة",
        error: "لون الخطأ",
        info: "لون المعلومات",
        success: "لون النجاح",
        warning: "لون التحذير",
        white: "لون الخط تحت الخلفية الأساسية"
      },
      admins: "Admins",
      admins_desc: "Configure allowed people to access Diabates Clinic.",
      patients: "Patients",
      patients_desc: "Customize patients activity on Diabates Clinic."
    }
  },
  // 2. Gallery
  gallery: {
    "1": "Select Label",
    "2": "No labels found",
    "3": "Images Selected", // 3 Images Selected
    "4":
      "Select label and images to upload ( Only JPG and PNG files are supported ).",
    "5": "Select Images",
    "6": "Upload Images",
    "7": "<span class=''>Diabetes </span> <span class=''> Gallery</span>",
    "8": "Add Label",
    "9": "No label selected",
    "10": "Please select a label to view images.",
    "11": "Edit Label",
    "12": "Images",
    "13": "Delete Image",
    "14": "View Image",
    "15": "No images in this label",
    "16": "Please add images to show",
    "17": "No labels yet",
    "18": "Click on",
    "19": "Add Label",
    "20": "icon to create a new label",
    "21": "Delete",
    "22": "Image",
    "23": "Close",
    "24": "Are you sure to delete image?",
    "25": "Cancel",
    "26": "Delete Image",
    "27": "Label",
    "28": "Close",
    "29": "",
    "30": ""
  },
  /**
     Errors
     */
  errors: {
    "1": "فيه مشكلة في الشبكة, اعمل إعادة تحميل للصفحة وجرب تاني.",
    "2": "<b>فيه خطأ ما حصل</b>, من فضلك اعمل إعادة تحميل للصفحة وجرب تاني",
    "3":
      "لو فيه مشكلة بتواجهك, كلمني على الرقم <a href='tel:+201113429944'>+201113429944</a>",
    "4": "<b>الكود غلط</b>, من فضلك تحقق من كتابة الكود صحيح.",
    "5":
      "<b>انتهت صلاحية الكود</b>. انت تقدر تجرب الكود مرتين بس. من فضلك اعمل إعادة تحميل للصفحة وجرب تاني.",
    "6":
      "<b>انتهت صلاحية الريكابتشا</b>. من فضلك اعمل إعادة تحميل للصفحة وجرب تاني.",
    "7": "الإسم مينفعش يكون أقل من 4 حروف",
    "8": "فيه حقول مينفعش تسيبها فاضية.",
    "9": "الكومنت مينفعش يكون فاضي.",
    "10":
      "فيه مشكلة في إضافة المريض ده, من فضلك اعمل إعادة تحميل للصفحة وجرب مرة تاني.",
    "11": "الإسم والنوع مطلوبين.",
    "12": "الحقل المخصص اللي بتحاول تمسحه ده, ممسوح بالفعل.",
    "13": "من فضلك املئ الحقول المطلوبة",
    "14":
      "فيه مشكلة في الإنترنت حصلت أثناء التحقق من المستخدم ده, من فضلك اعمل إعادة تحميل للصفحة وجرب تاني.",
    "15":
      "<b>حضرتك طلبت عدد أكواد كتير في دقائق قليلة</b>: الهوست عمل بلوك للجهاز ده من تسجيل الدخول لمدة بضع ساعات لإن مش مضمون اللي بيحاول يسجل الدخول ده هو صاحب التطبيق ولا حد بيحاول يخترقه . من فضلك المرة الجاية انتظر الكود يوصلك حتى لو تأخر دقائق.",
    "16":
      "<b>خطأ</b>: فيه مشكلة في الإنترنت حصلت, من فضلك اعمل إعادة تحميل وجرب تاني.",
    "17": "<b>الدخول مرفوض:</b> رقم التليفون ده مش مسموح ليه يدخل التطبيق.",
    "18": "<b>رقم التليفون مش مظبوط:</b> غالباً ده مش رقم تليفون مصري.",
    "19":
      "<b>فيه مشكلة في تحميل الريكابتشا</b>, هل حضرتك متصل بالإنترنت؟ من فضلك اعمل إعادة تحميل للصفحة وجرب تاني.",
    "20":
      "<b>الريكابتشا متحلتش صح</b>, من فضلك حل الريكابتشا الأول قبل تسجيل الدخول.",
    "21":
      "<b>فيه مشكلة في الإنترنت</b>, من فضلك اعمل إعادة تحميل للصفحة وجرب تاني, أو تحقق من اتصالك بالإنترنت.",
    "22": "حضرتك حاولت بدون قصد توصل لداتا مش مسموح الوصول ليها.",
    "23":
      "الصورة اللي بتحاول تعرضها التطبيق مش قادر يوصلها. من فضلك تحقق من اتصالك بالإنترنت",
    "24": "حضرتك حاولت بدون قصد توصل لداتا مش مسموح الوصول ليها.",
    "25": "",
    "26": "",
    "27": "",
    "28": "",
    "29": "",
    "30": "",
    "31": "",
    "32": "",
    "33": "",
    "34": "",
    "35": ""
  }
};
exports.default = _default;
// export default _default;
