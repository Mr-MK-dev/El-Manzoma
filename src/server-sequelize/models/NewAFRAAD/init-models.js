var DataTypes = require("sequelize").DataTypes;
var _Brothers = require("./Brothers");
var _DriversPerCar = require("./DriversPerCar");
var _Centre = require("./Centre");
var _Diseases = require("./Diseases");
var _FollowUpParty = require("./FollowUpParty");
var _Vaccine = require("./Vaccine");
var _City = require("./City");
var _Colleges = require("./Colleges");
var _Housing = require("./Housing");
var _Levels = require("./Levels");
var _SystemRules = require("./SystemRules");
var _Branches = require("./Branches");
var _Systems = require("./Systems");
var _VehiclesSiasa = require("./VehiclesSiasa");
var _Vacations = require("./Vacations");
var _UnitsOfficers = require("./UnitsOfficers");
var _Courses = require("./Courses");
var _StageSupportReports = require("./StageSupportReports");
var _Missions = require("./Missions");
var _LowLevels = require("./LowLevels");
var _TrainingSoldier = require("./TrainingSoldier");
var _TrainingRateb = require("./TrainingRateb");
var _MilitaryManagementOfficers = require("./MilitaryManagementOfficers");
var _OfficerMissions = require("./OfficerMissions");
var _JobPackagingDaily = require("./JobPackagingDaily");
var _PunishmentTypes = require("./PunishmentTypes");
var _RenewCandidates = require("./RenewCandidates");
var _OutOfRenew = require("./OutOfRenew");
var _OtherRenewCandidates = require("./OtherRenewCandidates");
var _RenewList = require("./RenewList");
var _TransferIntelligence = require("./TransferIntelligence");
// var _MonthlyReview = require("./MonthlyReview");
// var _MonthlyReviewUnits = require("./MonthlyReviewUnits");
var _TahelCourses = require("./TahelCourses");
var _TransferListEffects = require("./TransferListEffects");
var _RenewRemovePlans = require("./RenewRemovePlans");
var _RenewAddPlans = require("./RenewAddPlans");
var _Direction = require("./Direction");
var _DiscountTime = require("./DiscountTime");
var _DistributionSuggestion = require("./DistributionSuggestion");
var _DepartmentsInternalFollow = require("./DepartmentsInternalFollow");
var _TraineeShip = require("./TraineeShip");
var _RatebTraineeShip = require("./RatebTraineeShip");
var _RatebPunishments = require("./RatebPunishments");
var _DriversArrival = require("./DriversArrival");
var _MortabatDuties = require("./MortabatDuties");
var _OfficerMortabatDuties = require("./OfficerMortabatDuties");
var _EndingReasons = require("./EndingReasons");
var _TransferAllocation = require("./TransferAllocation");
var _Duty = require("./Duty");
var _OfficerDuty = require("./OfficerDuty");
var _PreviousJobs = require("./PreviousJobs");
var _TransferList = require("./TransferList");
var _TransferCandidates = require("./TransferCandidates");
var _Requests = require("./Requests");
var _AddPlans = require("./AddPlans");
var _RemovePlans = require("./RemovePlans");
var _RatebRecommendations = require("./RatebRecommendations");
var _Employes = require("./Employes");
var _EndingCause = require("./EndingCause");
var _Family = require("./Family");
var _Jobs = require("./Jobs");
var _FittingRules = require("./FittingRules");
var _Certificators = require("./Certificators");
var _EnrollersCertificators = require("./EnrollersCertificators");
var _Sectors = require("./Sectors");
var _SpecialOrganizedUnits = require("./SpecialOrganizedUnits");
var _Followerrateb = require("./Followerrateb");
var _Followers = require("./Followers");
var _OfficerVacations = require("./OfficerVacations");
var _Obligations = require("./Obligations");
var _FollowingNos = require("./FollowingNos");
var _FollowingRigion = require("./FollowingRigion");
var _Grade = require("./Grade");
var _inventoryLevelup = require("./inventoryLevelup");
var _Mosarah = require("./Mosarah");
var _Motabaa = require("./Motabaa");
var _Moving = require("./Moving");
var _MyUsers = require("./MyUsers");
var _Neshan = require("./Neshan");
var _NewComersArrivals = require("./NewComersArrivals");
var _NewComersTimeline = require("./NewComersTimeline");
var _OldFollowersNo = require("./OldFollowersNo");
var _Password = require("./Password");
var _Permissions = require("./Permissions");
var _Rateb = require("./Rateb");
var _Officers = require("./Officers");
var _RatebX = require("./RatebX");
var _Ratebzzz = require("./Ratebzzz");
var _Recommendations = require("./Recommendations");
var _RegisterationEssurance = require("./RegisterationEssurance");
var _SMDriversSuggestion = require("./SMDriversSuggestion");
var _SMSoldier = require("./SMSoldier");
var _SelectionSoldier = require("./SelectionSoldier");
var _SelectionType = require("./SelectionType");
var _SelectionUsers = require("./SelectionUsers");
var _Selections = require("./Selections");
var _SituationDecision = require("./SituationDecision");
var _SituationStates = require("./SituationStates");
var _Situations = require("./Situations");
var _Soldier = require("./Soldier");
var _SpareSoldiers = require("./SpareSoldiers");
var _Tankolat = require("./Tankolat");
var _Tasreeh = require("./Tasreeh");
var _TravalTable = require("./TravalTable");
var _Twsiat = require("./Twsiat");
var _Unit = require("./Unit");
var _UnitEngineersPlan = require("./UnitEngineersPlan");
var _UnitSelect = require("./UnitSelect");
var _Unit_Jobs = require("./Unit_Jobs");
var _UserPermissions = require("./UserPermissions");
var _Users = require("./Users");
var _Weapon = require("./Weapon");
var _HighLevelWeaponManagement = require("./HighLevelWeaponManagement");
var _VicealesManagment = require("./VicealesManagment");
var _VolunteersProcedures = require("./VolunteersProcedures");
var _VolunteeringTimePlan = require("./VolunteeringTimePlan");
var _VolunteeringRecommendation = require("./VolunteeringRecommendation");
var _KsasVolunteeringTimePlan = require("./KsasVolunteeringTimePlan");
var _KsasVolunteeringRecommendation = require("./KsasVolunteeringRecommendation");
var _KsasVolunteersProcedures = require("./KsasVolunteersProcedures");

var _carruntlevel = require("./carruntlevel");
var _chat = require("./chat");
var _followersolider = require("./followersolider");
var _followerwork = require("./followerwork");
var _makhzan = require("./makhzan");
var _preuint = require("./preuint");
var _prevlevelup = require("./prevlevelup");
var _Fittings = require("./Fittings");
var _punshments = require("./punshments");
var _RatebPenalities = require("./RatebPenalities");
var _security = require("./security");
var _shakawi = require("./shakawi");
var _suggest = require("./suggest");
var _tagdidMohab = require("./tagdidMohab");
var _tagdidrevsioin = require("./tagdidrevsioin");
var _tahel = require("./tahel");
var _tasgiltag = require("./tasgiltag");
var _SMGeneral = require("./SMGeneral");
var _userTracking = require("./userTracking");
var _SessionTracking = require("./SessionTracking");
var _correspondences = require("./Correspondences");
var _internalFollowUp = require("./InternalFollowUp");
var _SoldierSecuritySituations = require("./SoldierSecuritySituations");
var _UnitEffecs = require("./UnitEffecs");
var _RatebGeneralKnowledge = require("./RatebGeneralKnowledge");
var _OfficerSoldierRecommendation = require("./OfficerSoldierRecommendation");
var _TransportLicense = require("./TransportLicense");
var _SMRecommandations = require("./SMRecommandations");
var _RecommendationAndSelections = require("./RecommendationAndSelections");
var _Specialization = require("./Specialization");
var _SoldiersMedicalSituations = require("./SoldiersMedicalSituations");
var _SoldiersPhsycoligicalSituations = require("./SoldiersPhsycoligicalSituations");
var _RatebsMedicalSituations = require("./RatebsMedicalSituations");
var _RatebsPhsycoligicalSituations = require("./RatebsPhsycoligicalSituations");
var _SoldiersSelectionSituations = require("./SoldiersSelectionSituations");
var _RatebPromotions = require("./RatebPromotions");
var _Devices = require("./Devices");
var _OfficerCourses = require("./OfficerCourses");
var _WeaponDutyPivot = require("./WeaponDutyPivot");
var _Pattern = require("./Pattern");
var _CommandRegions = require("./CommandRegions");
var _FollowingAreas = require("./FollowingAreas");
var _RecStages = require("./RecStages");
var _Point = require("./Point");
var _PointHub = require("./PointHub");
var _WebUnits = require("./WebUnits");
var _TransferListBalancer = require("./TransferListBalancer");
var _TransferListUnitErrors = require("./TransferListUnitErrors");
var _RecuStartDates = require("./RecuStartDates");
var _TransferListJobBlancer = require("./TransferListJobBlancer");
var _UnitCollectionPivot = require("./UnitCollectionPivot");
var _UnitCollections = require("./UnitCollections");

var _PackagePlan = require("./PackagePlan");
var _PackagePlanDates = require("./PackagePlanDates");
var _CompletePlanUnit = require("./CompletePlanUnit");
var _OrganizationPlanUnit = require("./OrganizationPlanUnit");
var _lossCompensation = require("./lossCompensation");
var _LossGroups = require("./LossGroups");
var _PackageCandidates = require("./PackageCandidates");
var _RemovedPackageCandidates = require("./RemovedPackageCandidates");
var _AddPackageCandidates = require("./AddPackageCandidates");
var _OrganizationPlanCandidates = require("./OrganizationPlanCandidates");
var _CompletePlanCandidates = require("./CompletePlanCandidates");
var _CompensationLossCandidates = require("./CompensationLossCandidates");

var _distriputionPlanList = require("./distriputionPlanList");
var _NewComersRequests = require("./NewComersRequests");
var _ActionsTaken = require("./ActionsTaken");
var _ResponsibleParty = require("./ResponsibleParty");

var _reviewPlanList = require("./reviewPlanList");

var _distriputionPlanStats = require("./distriputionPlanStats");

var _reviewPlanListDetails = require("./reviewPlanListDetails");

var _enrollersPlanList = require("./enrollersPlanList");

var _enrollersPlanDetails = require("./enrollersPlanDetails");
var _MessengerCalls = require("./MessengerCalls");
var _MessengerChats = require("./MessengerChats");
var _EffectSituationStates = require("./EffectSituationStates");

var _ArrivalToTrainingCenterDates = require("./ArrivalToTrainingCenterDates");
var _Colours = require("./Colours");
var _ColorPalettes = require("./ColorPalettes");
var _UsersGroups = require("./UsersGroups");
var _Hospital = require("./Hospital");
var _CarColor = require("./CarColor");
var _CarPreparation = require("./CarPreparation");
var _CarUsage = require("./CarUsage");
var _CarType = require("./CarType");
var _ResponsibleSide = require("./ResponsibleSide");
var _CarCargo = require("./CarCargo");
var _Boats = require("./Boats");
var _SignalWeaponTypes = require("./SignalWeaponTypes");
var _SignalWeapons = require("./SignalWeapons");
var _UnitBoats = require("./UnitBoats");
var _UnitSignals = require("./UnitSignals");
// start personal Affairs
var _MartyrsAndInjured = require("./MartyrsAndInjured");
var _MartyrsAndInjuredAndDeath = require("./MartyrsAndInjuredAndDeath");
var _MedicalRequests = require("./MedicalRequests");
var _AcademicallyExcellence = require("./AcademicallyExcellence");
var _ExcellentParent = require("./ExcellentParent");
var _PsychologicalRequests = require("./PsychologicalRequests");
var _MartyrWifeAndSon = require("./MartyrWifeAndSon");
var _ParentsAndBrothers = require("./ParentsAndBrothers");
var _Hajj = require("./Hajj");
var _UnitSystems = require("./UnitSystems");
var _PublicName = require("./PublicName");
var _Employment = require("./Employment");
var _Honors = require("./Honors");
var _Demands = require("./Demands");
var _FinancialDues = require("./FinancialDues");
var _IdealSoldier = require("./IdealSoldier");
var _Vaccinators = require("./Vaccinators");
var _InjuredHospitals = require("./InjuredHospitals");
var _GeneralRequests = require("./GeneralRequests");
var _Wives = require("./Wives");
var _Kids = require("./Kids");

// end personal Affairs

var _Investigations = require("./Investigations");
var _Appeals = require("./Appeals");
var _Custodies = require("./Custodies");
var _CustodiesType = require("./CustodiesType");
var _AppealType = require("./AppealType");
var _Complaints = require("./Complaints");

var _Calendars = require("./Calendars");
var _CalendarDegrees = require("./CalendarDegrees");
var _CalendarTypes = require("./CalendarTypes");
var _CalendarAlarms = require("./CalendarAlarms");

var _TransferListUnits = require("./TransferListUnits");
var _UnitsCars = require("./UnitsCars");
var _MajorVehicles = require("./MajorVehicles");
var _RecuEndDates = require("./RecuEndDates");
var _CertificatesWithRewards = require("./CertificatesWithRewards");
var _GradesWithRewards = require("./GradesWithRewards");
var _ReasonsDecisions = require("./ReasonsDecisions");
var _Wars = require("./Wars");
var _SoliderTypesWithRewards = require("./SoliderTypesWithRewards");
var _WorkPlacesAdditions = require("./WorkPlacesAdditions");
var _AdditionsWorkPlacesFollowers = require("./AdditionsWorkPlacesFollowers");
var _PrivatePages = require("./PrivatePages");
var _Causations = require("./Causations");
var _FollowerArchiveFiles = require("./FollowerArchiveFiles");
var _ArchiveFileFollowers = require("./ArchiveFileFollowers");

var _TraineeShipCollection = require("./TraineeShipCollection");
var _TraineeShipCollectionPivot = require("./TraineeShipCollectionPivot");
var _TransferAllocationSnapshot = require("./TransferAllocationSnapshot");
var _OtherLossTypes = require("./OtherLossTypes");
var _OtherLoss = require("./OtherLoss");
var _HumanLoss = require("./HumanLoss");
var _accidentTypes = require("./accidentTypes");
var _accidentCategories = require("./accidentCategories");
var _WorkPlaceMainPower = require("./WorkPlaceMainPower");
var _Accidents = require("./Accidents");

function initModels(sequelize) {
  var userTracking = _userTracking(sequelize, DataTypes);
  var DriversPerCar = _DriversPerCar(sequelize, DataTypes);
  var SessionTracking = _SessionTracking(sequelize, DataTypes);
  var SoldierSecuritySituations = _SoldierSecuritySituations(
    sequelize,
    DataTypes
  );
  var VehiclesSiasa = _VehiclesSiasa(sequelize, DataTypes);
  var Devices = _Devices(sequelize, DataTypes);

  var PackagePlan = _PackagePlan(sequelize, DataTypes);
  var PackagePlanDates = _PackagePlanDates(sequelize, DataTypes);
  var lossCompensation = _lossCompensation(sequelize, DataTypes);
  var StageSupportReports = _StageSupportReports(sequelize, DataTypes);
  var LossGroups = _LossGroups(sequelize, DataTypes);
  var PackageCandidates = _PackageCandidates(sequelize, DataTypes);
  var RemovedPackageCandidates = _RemovedPackageCandidates(
    sequelize,
    DataTypes
  );
  var AddPackageCandidates = _AddPackageCandidates(sequelize, DataTypes);
  var Housing = _Housing(sequelize, DataTypes);
  var TrainingRateb = _TrainingRateb(sequelize, DataTypes);
  var OrganizationPlanCandidates = _OrganizationPlanCandidates(
    sequelize,
    DataTypes
  );
  var CompletePlanCandidates = _CompletePlanCandidates(sequelize, DataTypes);
  var LowLevels = _LowLevels(sequelize, DataTypes);
  var CompensationLossCandidates = _CompensationLossCandidates(
    sequelize,
    DataTypes
  );
  var CompletePlanUnit = _CompletePlanUnit(sequelize, DataTypes);
  var OrganizationPlanUnit = _OrganizationPlanUnit(sequelize, DataTypes);
  var MilitaryManagementOfficers = _MilitaryManagementOfficers(
    sequelize,
    DataTypes
  );
  var VicealesManagment = _VicealesManagment(sequelize, DataTypes);
  var Diseases = _Diseases(sequelize, DataTypes);
  var FollowUpParty = _FollowUpParty(sequelize, DataTypes);
  var Vaccine = _Vaccine(sequelize, DataTypes);
  var UnitsOfficers = _UnitsOfficers(sequelize, DataTypes);
  var Vaccinators = _Vaccinators(sequelize, DataTypes);
  var OfficerCourses = _OfficerCourses(sequelize, DataTypes);
  var Colours = _Colours(sequelize, DataTypes);
  var Systems = _Systems(sequelize, DataTypes);
  var Courses = _Courses(sequelize, DataTypes);
  var UnitSystems = _UnitSystems(sequelize, DataTypes);
  var ColorPalettes = _ColorPalettes(sequelize, DataTypes);
  var Levels = _Levels(sequelize, DataTypes);
  var TransferListUnits = _TransferListUnits(sequelize, DataTypes);
  var Jobs = _Jobs(sequelize, DataTypes);
  var TransferIntelligence = _TransferIntelligence(sequelize, DataTypes);
  var OtherRenewCandidates = _OtherRenewCandidates(sequelize, DataTypes);
  var PreviousJobs = _PreviousJobs(sequelize, DataTypes);
  var security = _security(sequelize, DataTypes);
  // var MonthlyReview = _MonthlyReview(sequelize, DataTypes);
  // var MonthlyReviewUnits = _MonthlyReviewUnits(sequelize, DataTypes);
  var OutOfRenew = _OutOfRenew(sequelize, DataTypes);
  var Colleges = _Colleges(sequelize, DataTypes);
  var TransferAllocation = _TransferAllocation(sequelize, DataTypes);
  var RatebRecommendations = _RatebRecommendations(sequelize, DataTypes);
  var FittingRules = _FittingRules(sequelize, DataTypes);
  var PunishmentTypes = _PunishmentTypes(sequelize, DataTypes);
  var Sectors = _Sectors(sequelize, DataTypes);
  var SpecialOrganizedUnits = _SpecialOrganizedUnits(sequelize, DataTypes);
  var TrainingSoldier = _TrainingSoldier(sequelize, DataTypes);
  var EndingReasons = _EndingReasons(sequelize, DataTypes);
  var RatebPunishments = _RatebPunishments(sequelize, DataTypes);
  var RenewList = _RenewList(sequelize, DataTypes);
  var RatebGeneralKnowledge = _RatebGeneralKnowledge(sequelize, DataTypes);
  var RegisterationEssurance = _RegisterationEssurance(sequelize, DataTypes);
  var OfficerVacations = _OfficerVacations(sequelize, DataTypes);
  var Obligations = _Obligations(sequelize, DataTypes);
  var DepartmentsInternalFollow = _DepartmentsInternalFollow(
    sequelize,
    DataTypes
  );
  var RatebsMedicalSituations = _RatebsMedicalSituations(sequelize, DataTypes);
  var RatebsPhsycoligicalSituations = _RatebsPhsycoligicalSituations(
    sequelize,
    DataTypes
  );
  var SoldiersMedicalSituations = _SoldiersMedicalSituations(
    sequelize,
    DataTypes
  );
  var SoldiersPhsycoligicalSituations = _SoldiersPhsycoligicalSituations(
    sequelize,
    DataTypes
  );
  var SoldiersSelectionSituations = _SoldiersSelectionSituations(
    sequelize,
    DataTypes
  );
  var OfficerSoldierRecommendation = _OfficerSoldierRecommendation(
    sequelize,
    DataTypes
  );
  var RecommendationAndSelections = _RecommendationAndSelections(
    sequelize,
    DataTypes
  );
  var WeaponDutyPivot = _WeaponDutyPivot(sequelize, DataTypes);
  var TransferCandidates = _TransferCandidates(sequelize, DataTypes);
  var SystemRules = _SystemRules(sequelize, DataTypes);
  var TransferListEffects = _TransferListEffects(sequelize, DataTypes);
  var MortabatDuties = _MortabatDuties(sequelize, DataTypes);
  var JobPackagingDaily = _JobPackagingDaily(sequelize, DataTypes);
  var OfficerMortabatDuties = _OfficerMortabatDuties(sequelize, DataTypes);
  var CommandRegions = _CommandRegions(sequelize, DataTypes);
  var FollowingAreas = _FollowingAreas(sequelize, DataTypes);
  var TransferList = _TransferList(sequelize, DataTypes);
  var Pattern = _Pattern(sequelize, DataTypes);
  var RenewCandidates = _RenewCandidates(sequelize, DataTypes);
  var RenewAddPlans = _RenewAddPlans(sequelize, DataTypes);
  var RenewRemovePlans = _RenewRemovePlans(sequelize, DataTypes);
  var Certificators = _Certificators(sequelize, DataTypes);
  var EnrollersCertificators = _EnrollersCertificators(sequelize, DataTypes);
  var shakawi = _shakawi(sequelize, DataTypes);
  var TraineeShip = _TraineeShip(sequelize, DataTypes);
  var RatebTraineeShip = _RatebTraineeShip(sequelize, DataTypes);
  var SelectionUsers = _SelectionUsers(sequelize, DataTypes);
  var SelectionType = _SelectionType(sequelize, DataTypes);
  var SelectionSoldier = _SelectionSoldier(sequelize, DataTypes);
  var AddPlans = _AddPlans(sequelize, DataTypes);
  var carruntlevel = _carruntlevel(sequelize, DataTypes);
  var followerwork = _followerwork(sequelize, DataTypes);
  var followersolider = _followersolider(sequelize, DataTypes);
  var NewComersTimeline = _NewComersTimeline(sequelize, DataTypes);
  var NewComersArrivals = _NewComersArrivals(sequelize, DataTypes);
  var Neshan = _Neshan(sequelize, DataTypes);
  var RemovePlans = _RemovePlans(sequelize, DataTypes);
  var MyUsers = _MyUsers(sequelize, DataTypes);
  var Recommendations = _Recommendations(sequelize, DataTypes);
  var Ratebzzz = _Ratebzzz(sequelize, DataTypes);

  var MessengerCalls = _MessengerCalls(sequelize, DataTypes);
  var MessengerChats = _MessengerChats(sequelize, DataTypes);

  var Calendars = _Calendars(sequelize, DataTypes);
  var CalendarDegrees = _CalendarDegrees(sequelize, DataTypes);
  var CalendarTypes = _CalendarTypes(sequelize, DataTypes);
  var CalendarAlarms = _CalendarAlarms(sequelize, DataTypes);

  var RatebX = _RatebX(sequelize, DataTypes);
  var Rateb = _Rateb(sequelize, DataTypes);
  var Officers = _Officers(sequelize, DataTypes);
  var punshments = _punshments(sequelize, DataTypes);
  var RatebPenalities = _RatebPenalities(sequelize, DataTypes);
  var prevlevelup = _prevlevelup(sequelize, DataTypes);
  var preuint = _preuint(sequelize, DataTypes);
  var Fittings = _Fittings(sequelize, DataTypes);
  var Permissions = _Permissions(sequelize, DataTypes);
  var Password = _Password(sequelize, DataTypes);
  var Followerrateb = _Followerrateb(sequelize, DataTypes);
  var Family = _Family(sequelize, DataTypes);
  var EndingCause = _EndingCause(sequelize, DataTypes);
  var Employes = _Employes(sequelize, DataTypes);
  var Duty = _Duty(sequelize, DataTypes);
  var OfficerDuty = _OfficerDuty(sequelize, DataTypes);
  var Requests = _Requests(sequelize, DataTypes);
  var DriversArrival = _DriversArrival(sequelize, DataTypes);
  var Motabaa = _Motabaa(sequelize, DataTypes);
  var Mosarah = _Mosarah(sequelize, DataTypes);
  var inventoryLevelup = _inventoryLevelup(sequelize, DataTypes);
  var makhzan = _makhzan(sequelize, DataTypes);
  var Grade = _Grade(sequelize, DataTypes);
  var FollowingRigion = _FollowingRigion(sequelize, DataTypes);
  var DiscountTime = _DiscountTime(sequelize, DataTypes);
  var TahelCourses = _TahelCourses(sequelize, DataTypes);
  var Direction = _Direction(sequelize, DataTypes);

  var distriputionPlanList = _distriputionPlanList(sequelize, DataTypes);
  var reviewPlanList = _reviewPlanList(sequelize, DataTypes);
  var distriputionPlanStats = _distriputionPlanStats(sequelize, DataTypes);
  var reviewPlanListDetails = _reviewPlanListDetails(sequelize, DataTypes);

  var enrollersPlanList = _enrollersPlanList(sequelize, DataTypes);
  var enrollersPlanDetails = _enrollersPlanDetails(sequelize, DataTypes);

  var City = _City(sequelize, DataTypes);
  var NewComersRequests = _NewComersRequests(sequelize, DataTypes);
  var ActionsTaken = _ActionsTaken(sequelize, DataTypes);
  var chat = _chat(sequelize, DataTypes);
  var Weapon = _Weapon(sequelize, DataTypes);
  var Users = _Users(sequelize, DataTypes);
  var UnitSelect = _UnitSelect(sequelize, DataTypes);
  var UnitEngineersPlan = _UnitEngineersPlan(sequelize, DataTypes);
  var Unit_Jobs = _Unit_Jobs(sequelize, DataTypes);
  var Unit = _Unit(sequelize, DataTypes);
  var SpareSoldiers = _SpareSoldiers(sequelize, DataTypes);
  var SMDriversSuggestion = _SMDriversSuggestion(sequelize, DataTypes);
  var SituationStates = _SituationStates(sequelize, DataTypes);
  var TravalTable = _TravalTable(sequelize, DataTypes);
  var Tasreeh = _Tasreeh(sequelize, DataTypes);
  var tasgiltag = _tasgiltag(sequelize, DataTypes);
  var Tankolat = _Tankolat(sequelize, DataTypes);
  var tahel = _tahel(sequelize, DataTypes);
  var tagdidrevsioin = _tagdidrevsioin(sequelize, DataTypes);
  var tagdidMohab = _tagdidMohab(sequelize, DataTypes);
  var suggest = _suggest(sequelize, DataTypes);
  var UserPermissions = _UserPermissions(sequelize, DataTypes);

  var Centre = _Centre(sequelize, DataTypes);
  var FollowingNos = _FollowingNos(sequelize, DataTypes);
  var OldFollowersNo = _OldFollowersNo(sequelize, DataTypes);
  var Selections = _Selections(sequelize, DataTypes);
  var SMRecommandations = _SMRecommandations(sequelize, DataTypes);
  var Soldier = _Soldier(sequelize, DataTypes);
  var SMSoldier = _SMSoldier(sequelize, DataTypes);
  var SMGeneral = _SMGeneral(sequelize, DataTypes);

  var Followers = _Followers(sequelize, DataTypes);
  var UnitEffecs = _UnitEffecs(sequelize, DataTypes);

  var Investigations = _Investigations(sequelize, DataTypes);
  var Appeals = _Appeals(sequelize, DataTypes);
  var Custodies = _Custodies(sequelize, DataTypes);
  var CustodiesType = _CustodiesType(sequelize, DataTypes);
  var AppealType = _AppealType(sequelize, DataTypes);
  var Branches = _Branches(sequelize, DataTypes);
  var Vacations = _Vacations(sequelize, DataTypes);
  var OfficerMissions = _OfficerMissions(sequelize, DataTypes);
  var Missions = _Missions(sequelize, DataTypes);
  var Complaints = _Complaints(sequelize, DataTypes);

  var Brothers = _Brothers(sequelize, DataTypes);
  var Twsiat = _Twsiat(sequelize, DataTypes);
  var Situations = _Situations(sequelize, DataTypes);
  var SituationDecision = _SituationDecision(sequelize, DataTypes);
  var DistributionSuggestion = _DistributionSuggestion(sequelize, DataTypes);
  var Moving = _Moving(sequelize, DataTypes);
  var Correspondences = _correspondences(sequelize, DataTypes);
  var InternalFollowUp = _internalFollowUp(sequelize, DataTypes);
  var TransportLicense = _TransportLicense(sequelize, DataTypes);
  var Specialization = _Specialization(sequelize, DataTypes);
  var RatebPromotions = _RatebPromotions(sequelize, DataTypes);
  var RecStages = _RecStages(sequelize, DataTypes);
  var EffectSituationStates = _EffectSituationStates(sequelize, DataTypes);

  var TransferListJobBlancer = _TransferListJobBlancer(sequelize, DataTypes);

  var Point = _Point(sequelize, DataTypes);
  var UsersGroups = _UsersGroups(sequelize, DataTypes);
  var Hospital = _Hospital(sequelize, DataTypes);
  var CarColor = _CarColor(sequelize, DataTypes);
  var CarType = _CarType(sequelize, DataTypes);
  var ResponsibleSide = _ResponsibleSide(sequelize, DataTypes);
  var ResponsibleParty = _ResponsibleParty(sequelize, DataTypes);
  var CarCargo = _CarCargo(sequelize, DataTypes);
  var CarPreparation = _CarPreparation(sequelize, DataTypes);
  var CarUsage = _CarUsage(sequelize, DataTypes);
  var Boats = _Boats(sequelize, DataTypes);
  var SignalWeaponTypes = _SignalWeaponTypes(sequelize, DataTypes);
  var SignalWeapons = _SignalWeapons(sequelize, DataTypes);
  var UnitBoats = _UnitBoats(sequelize, DataTypes);
  var UnitSignals = _UnitSignals(sequelize, DataTypes);
  var PointHub = _PointHub(sequelize, DataTypes);
  var WebUnits = _WebUnits(sequelize, DataTypes);
  var TransferListBalancer = _TransferListBalancer(sequelize, DataTypes);
  var TransferListUnitErrors = _TransferListUnitErrors(sequelize, DataTypes);

  var RecuStartDates = _RecuStartDates(sequelize, DataTypes);
  var UnitCollectionPivot = _UnitCollectionPivot(sequelize, DataTypes);
  var UnitCollections = _UnitCollections(sequelize, DataTypes);
  var ArrivalToTrainingCenterDates = _ArrivalToTrainingCenterDates(
    sequelize,
    DataTypes
  );
  var IdealSoldier = _IdealSoldier(sequelize, DataTypes);

  var Wives = _Wives(sequelize, DataTypes);
  var Kids = _Kids(sequelize, DataTypes);
  var MartyrsAndInjured = _MartyrsAndInjured(sequelize, DataTypes);
  var MartyrsAndInjuredAndDeath = _MartyrsAndInjuredAndDeath(
    sequelize,
    DataTypes
  );
  var MedicalRequests = _MedicalRequests(sequelize, DataTypes);
  var AcademicallyExcellence = _AcademicallyExcellence(sequelize, DataTypes);
  var ExcellentParent = _ExcellentParent(sequelize, DataTypes);
  var PsychologicalRequests = _PsychologicalRequests(sequelize, DataTypes);
  var MartyrWifeAndSon = _MartyrWifeAndSon(sequelize, DataTypes);
  var ParentsAndBrothers = _ParentsAndBrothers(sequelize, DataTypes);
  var Hajj = _Hajj(sequelize, DataTypes);
  var PublicName = _PublicName(sequelize, DataTypes);
  var Employment = _Employment(sequelize, DataTypes);
  var Honors = _Honors(sequelize, DataTypes);
  var Demands = _Demands(sequelize, DataTypes);
  var FinancialDues = _FinancialDues(sequelize, DataTypes);
  var UnitsCars = _UnitsCars(sequelize, DataTypes);
  var MajorVehicles = _MajorVehicles(sequelize, DataTypes);
  var InjuredHospitals = _InjuredHospitals(sequelize, DataTypes);
  var GeneralRequests = _GeneralRequests(sequelize, DataTypes);
  var RecuEndDates = _RecuEndDates(sequelize, DataTypes);
  var CertificatesWithRewards = _CertificatesWithRewards(sequelize, DataTypes);
  var GradesWithRewards = _GradesWithRewards(sequelize, DataTypes);
  var ReasonsDecisions = _ReasonsDecisions(sequelize, DataTypes);
  var Wars = _Wars(sequelize, DataTypes);
  var SoliderTypesWithRewards = _SoliderTypesWithRewards(sequelize, DataTypes);
  var WorkPlacesAdditions = _WorkPlacesAdditions(sequelize, DataTypes);
  var AdditionsWorkPlacesFollowers = _AdditionsWorkPlacesFollowers(
    sequelize,
    DataTypes
  );
  var PrivatePages = _PrivatePages(sequelize, DataTypes);
  var Causations = _Causations(sequelize, DataTypes);
  var FollowerArchiveFiles = _FollowerArchiveFiles(sequelize, DataTypes);
  var ArchiveFileFollowers = _ArchiveFileFollowers(sequelize, DataTypes);

  var TraineeShipCollection = _TraineeShipCollection(sequelize, DataTypes);
  var TraineeShipCollectionPivot = _TraineeShipCollectionPivot(
    sequelize,
    DataTypes
  );
  var TransferAllocationSnapshot = _TransferAllocationSnapshot(
    sequelize,
    DataTypes
  );

  var OtherLossTypes = _OtherLossTypes(sequelize, DataTypes);
  var OtherLoss = _OtherLoss(sequelize, DataTypes);
  var HumanLoss = _HumanLoss(sequelize, DataTypes);

  var accidentTypes = _accidentTypes(sequelize, DataTypes);
  var accidentCategories = _accidentCategories(sequelize, DataTypes);
  var WorkPlaceMainPower = _WorkPlaceMainPower(sequelize, DataTypes);
  var Accidents = _Accidents(sequelize, DataTypes);
  var HighLevelWeaponManagement = _HighLevelWeaponManagement(
    sequelize,
    DataTypes
  );
  var VolunteeringTimePlan = _VolunteeringTimePlan(sequelize, DataTypes);
  var KsasVolunteeringRecommendation = _KsasVolunteeringRecommendation(
    sequelize,
    DataTypes
  );
  var KsasVolunteeringTimePlan = _KsasVolunteeringTimePlan(
    sequelize,
    DataTypes
  );
  var KsasVolunteersProcedures = _KsasVolunteersProcedures(
    sequelize,
    DataTypes
  );
  var VolunteeringRecommendation = _VolunteeringRecommendation(
    sequelize,
    DataTypes
  );
  var VolunteersProcedures = _VolunteersProcedures(sequelize, DataTypes);

  SituationStates.belongsToMany(Soldier, {
    through: SituationDecision,
    foreignKey: "SituationID",
    otherKey: "ID"
  });
  SituationStates.belongsToMany(Soldier, {
    through: Situations,
    foreignKey: "SituationID",
    otherKey: "ID"
  });

  Soldier.belongsToMany(SituationStates, {
    through: SituationDecision,
    foreignKey: "ID",
    otherKey: "SituationID"
  });
  Soldier.belongsToMany(SituationStates, {
    through: Situations,
    foreignKey: "ID",
    otherKey: "SituationID"
  });
  SMSoldier.belongsTo(Centre, { foreignKey: "CentreID" });
  Centre.hasMany(SMSoldier, { foreignKey: "CentreID" });
  Soldier.belongsTo(Centre, { foreignKey: "CentreID" });
  Centre.hasMany(Soldier, { foreignKey: "CentreID" });
  Centre.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(Centre, { foreignKey: "CityID" });
  SMSoldier.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(SMSoldier, { foreignKey: "CityID" });
  Soldier.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(Soldier, { foreignKey: "CityID" });
  SelectionSoldier.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(SelectionSoldier, { foreignKey: "CityID" });
  Soldier.belongsTo(Duty, { foreignKey: "DutyID" });
  Duty.hasMany(Soldier, { foreignKey: "DutyID" });

  Unit.belongsTo(Sectors, { foreignKey: "SectorID" });
  Sectors.hasMany(Unit, { foreignKey: "SectorID" });

  Unit.belongsTo(SpecialOrganizedUnits, {
    foreignKey: "SpecialOrganizationID"
  });
  SpecialOrganizedUnits.hasMany(Unit, { foreignKey: "SpecialOrganizationID" });

  Soldier.hasMany(Recommendations, { foreignKey: "ID" });
  Recommendations.belongsTo(Soldier, { foreignKey: "ID" });

  Followers.belongsTo(followerwork, {
    foreignKey: "WorkPlaceID"
  });
  followerwork.hasMany(Followers, {
    foreignKey: "WorkPlaceID"
  });

  Selections.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(Selections, { foreignKey: "CityID" });

  Fittings.belongsTo(Rateb, { foreignKey: "RATEB_ID" });
  Rateb.hasMany(Fittings, { foreignKey: "RATEB_ID" });

  TransferCandidates.belongsTo(TransferList, { foreignKey: "TransferListID" });
  TransferList.hasMany(TransferCandidates, { foreignKey: "TransferListID" });

  distriputionPlanStats.belongsTo(distriputionPlanList, {
    foreignKey: "distriputionPlanID"
  });

  distriputionPlanList.hasMany(distriputionPlanStats, {
    foreignKey: "distriputionPlanID"
  });

  reviewPlanListDetails.belongsTo(reviewPlanList, {
    foreignKey: "reviewPlanID"
  });

  reviewPlanList.hasMany(reviewPlanListDetails, {
    foreignKey: "reviewPlanID"
  });

  ActionsTaken.belongsTo(NewComersRequests, {
    foreignKey: "actionsTakenID"
  });

  NewComersRequests.hasMany(ActionsTaken, {
    foreignKey: "actionsTakenID"
  });
  enrollersPlanDetails.belongsTo(enrollersPlanList, {
    foreignKey: "EnrollersPlanID"
  });
  enrollersPlanList.hasMany(enrollersPlanDetails, {
    foreignKey: "EnrollersPlanID"
  });

  enrollersPlanDetails.belongsTo(followerwork, { foreignKey: "WorkPlaceID" });
  followerwork.hasMany(enrollersPlanDetails, { foreignKey: "WorkPlaceID" });

  distriputionPlanStats.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(distriputionPlanStats, { foreignKey: "UnitID" });

  NewComersRequests.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(NewComersRequests, { foreignKey: "ID" });

  reviewPlanListDetails.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(reviewPlanListDetails, { foreignKey: "UnitID" });

  NewComersRequests.belongsTo(ResponsibleParty, { foreignKey: "PartyID" });
  ResponsibleParty.hasMany(NewComersRequests, { foreignKey: "PartyID" });

  TransferCandidates.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(TransferCandidates, { foreignKey: "RatebID" });

  PackageCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(PackageCandidates, { foreignKey: "SoldierID" });

  RemovedPackageCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(RemovedPackageCandidates, { foreignKey: "SoldierID" });

  RenewCandidates.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(RenewCandidates, { foreignKey: "RatebID" });

  Requests.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(Requests, { foreignKey: "RatebID" });

  AddPlans.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(AddPlans, { foreignKey: "RatebID" });

  RenewAddPlans.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(RenewAddPlans, { foreignKey: "RatebID" });

  RemovePlans.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(RemovePlans, { foreignKey: "RatebID" });

  RenewRemovePlans.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(RenewRemovePlans, { foreignKey: "RatebID" });

  FollowingNos.belongsTo(FollowingRigion, {
    foreignKey: "FollowRigionID"
  });
  FollowingRigion.hasMany(FollowingNos, {
    foreignKey: "FollowRigionID"
  });

  UserPermissions.belongsTo(MyUsers, { foreignKey: "UserId" });

  MyUsers.hasMany(UserPermissions, {
    foreignKey: "UserId"
  });

  // UsersGroups.hasMany(Users, {
  //   foreignKey: "GroupId"
  // });
  // Users.belongsTo(UsersGroups, { foreignKey: "GroupId" });

  UsersGroups.hasMany(InternalFollowUp, {
    foreignKey: "GroupId"
  });

  InternalFollowUp.belongsTo(UsersGroups, { foreignKey: "GroupId" });

  UserPermissions.belongsTo(Permissions, { foreignKey: "PermId" });
  Permissions.hasMany(UserPermissions, {
    foreignKey: "PermId"
  });
  Selections.belongsTo(SelectionType, {
    foreignKey: "SelectionID"
  });
  SelectionType.hasMany(Selections, {
    foreignKey: "SelectionID"
  });
  SituationDecision.belongsTo(SituationStates, {
    foreignKey: "SituationID"
  });
  SituationStates.hasMany(SituationDecision, {
    foreignKey: "SituationID"
  });
  Situations.belongsTo(SituationStates, {
    foreignKey: "SituationID"
  });

  Brothers.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasOne(Brothers, { foreignKey: "ID" });

  Followers.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(Followers, { foreignKey: "ID" });

  MilitaryManagementOfficers.belongsTo(Branches, { foreignKey: "BranchID" });
  Branches.hasMany(MilitaryManagementOfficers, { foreignKey: "BranchID" });

  OfficerMissions.belongsTo(Missions, { foreignKey: "MissionID" });
  Missions.hasMany(OfficerMissions, { foreignKey: "MissionID" });

  OfficerMissions.belongsTo(MilitaryManagementOfficers, { foreignKey: "ID" });
  MilitaryManagementOfficers.hasMany(OfficerMissions, { foreignKey: "ID" });

  OfficerCourses.belongsTo(Courses, { foreignKey: "CourseID" });
  Courses.hasMany(OfficerCourses, { foreignKey: "CourseID" });

  OfficerCourses.belongsTo(MilitaryManagementOfficers, { foreignKey: "ID" });
  MilitaryManagementOfficers.hasMany(OfficerCourses, { foreignKey: "ID" });

  OfficerVacations.belongsTo(Vacations, { foreignKey: "VacationID" });
  Vacations.hasMany(OfficerVacations, { foreignKey: "VacationID" });

  OfficerVacations.belongsTo(MilitaryManagementOfficers, { foreignKey: "ID" });
  MilitaryManagementOfficers.hasMany(OfficerVacations, { foreignKey: "ID" });

  Obligations.belongsTo(MilitaryManagementOfficers, { foreignKey: "ID" });
  MilitaryManagementOfficers.hasMany(Obligations, { foreignKey: "ID" });

  MilitaryManagementOfficers.belongsTo(City, { foreignKey: "CityID" });
  City.hasMany(MilitaryManagementOfficers, { foreignKey: "CityID" });

  SituationDecision.belongsTo(Soldier, { as: "ID_Soldier", foreignKey: "ID" });
  Soldier.hasMany(SituationDecision, {
    foreignKey: "ID"
  });
  Situations.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(Situations, { foreignKey: "ID" });
  Soldier.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasOne(Soldier, { foreignKey: "ID" });
  Twsiat.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(Twsiat, { foreignKey: "ID" });
  DistributionSuggestion.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(DistributionSuggestion, {
    foreignKey: "UnitID"
  });

  SMDriversSuggestion.belongsTo(Unit, { foreignKey: "UnitID" });

  Unit.hasMany(SMDriversSuggestion, {
    foreignKey: "UnitID"
  });
  UnitsOfficers.belongsTo(Unit, { foreignKey: "UnitID" });

  Unit.hasMany(UnitsOfficers, {
    foreignKey: "UnitID"
  });
  PackageCandidates.belongsTo(Unit, { foreignKey: "PackagedUnitID" });

  Unit.hasMany(PackageCandidates, {
    foreignKey: "PackagedUnitID"
  });
  JobPackagingDaily.belongsTo(Unit, { foreignKey: "UnitID" });

  Unit.hasMany(JobPackagingDaily, {
    foreignKey: "UnitID"
  });

  Moving.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(Moving, { foreignKey: "UnitID" });
  OldFollowersNo.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(OldFollowersNo, { foreignKey: "UnitID" });
  SMSoldier.belongsTo(Unit, { foreignKey: "UnitID" });
  Recommendations.belongsTo(Unit, { foreignKey: "UnitID" });
  Recommendations.belongsTo(City, { foreignKey: "CityID" });
  Unit.hasMany(SMSoldier, { foreignKey: "UnitID" });
  Soldier.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(Soldier, { foreignKey: "UnitID" });
  suggest.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(suggest, { foreignKey: "UnitID" });
  SMSoldier.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(SMSoldier, { foreignKey: "WeaponID" });
  Soldier.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(StageSupportReports, { foreignKey: "WeaponID" });
  StageSupportReports.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(Soldier, { foreignKey: "WeaponID" });

  TransportLicense.belongsTo(Weapon, { foreignKey: "WeaponID" });

  Rateb.belongsTo(Unit, { foreignKey: "UnitID" });
  Rateb.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Rateb.belongsTo(Duty, { foreignKey: "DutyID" });
  Rateb.belongsTo(Centre, { foreignKey: "CentreID" });
  Rateb.belongsTo(City, { foreignKey: "CityID" });

  Officers.belongsTo(Unit, { foreignKey: "UnitID" });
  Officers.belongsTo(Weapon, { foreignKey: "WeaponID" });

  MilitaryManagementOfficers.belongsTo(Unit, { foreignKey: "UnitID" });
  MilitaryManagementOfficers.belongsTo(Weapon, { foreignKey: "WeaponID" });

  TraineeShip.hasMany(RatebTraineeShip, { foreignKey: "TraineeShipID" });
  RatebTraineeShip.belongsTo(TraineeShip, { foreignKey: "TraineeShipID" });

  Unit.hasMany(Rateb, { foreignKey: "UnitID" });
  Weapon.hasMany(Rateb, { foreignKey: "WeaponID" });
  Weapon.hasMany(TransportLicense, { foreignKey: "WeaponID" });
  Duty.hasMany(Rateb, { foreignKey: "DutyID" });
  Centre.hasMany(Rateb, { foreignKey: "CentreID" });
  City.hasMany(Rateb, { foreignKey: "CityID" });

  Unit.hasMany(Officers, { foreignKey: "UnitID" });
  Weapon.hasMany(Officers, { foreignKey: "WeaponID" });

  Unit.hasMany(MilitaryManagementOfficers, { foreignKey: "UnitID" });
  Weapon.hasMany(MilitaryManagementOfficers, { foreignKey: "WeaponID" });

  Rateb.hasMany(punshments, { foreignKey: "ID" });
  punshments.belongsTo(Rateb, { foreignKey: "ID" });

  Rateb.hasMany(RatebPenalities, { foreignKey: "ID" });
  RatebPenalities.belongsTo(Rateb, { foreignKey: "ID" });

  Rateb.hasMany(RatebPunishments, { foreignKey: "ID" });
  RatebPunishments.belongsTo(Rateb, { foreignKey: "ID" });

  RenewList.hasMany(RenewCandidates, { foreignKey: "RenewListID" });
  RenewCandidates.belongsTo(RenewList, { foreignKey: "RenewListID" });

  Rateb.hasMany(RatebPromotions, { foreignKey: "ID" });
  RatebPromotions.belongsTo(Rateb, { foreignKey: "ID" });

  Rateb.hasMany(shakawi, { foreignKey: "ID" });
  shakawi.belongsTo(Rateb, { foreignKey: "ID" });

  Rateb.hasMany(security, { foreignKey: "id" });
  security.belongsTo(Rateb, { foreignKey: "id" });
  followersolider.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(followersolider, { foreignKey: "ID" });

  TrainingSoldier.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(TrainingSoldier, { foreignKey: "ID" });

  IdealSoldier.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(IdealSoldier, { foreignKey: "ID" });

  Followerrateb.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(Followerrateb, { foreignKey: "ID" });

  //
  TrainingRateb.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(TrainingRateb, { foreignKey: "ID" });

  followerwork.hasMany(followersolider, { foreignKey: "workplace" });
  followersolider.belongsTo(followerwork, { foreignKey: "workplace" });

  followerwork.hasMany(TrainingSoldier, { foreignKey: "workplace" });
  TrainingSoldier.belongsTo(followerwork, { foreignKey: "workplace" });

  followerwork.hasMany(Followerrateb, { foreignKey: "workplace" });
  Followerrateb.belongsTo(followerwork, { foreignKey: "workplace" });

  followerwork.hasMany(TrainingRateb, { foreignKey: "workplace" });
  TrainingRateb.belongsTo(followerwork, { foreignKey: "workplace" });

  Weapon.hasMany(Duty, { foreignKey: "WeaponID" });
  Weapon.hasMany(OfficerDuty, { foreignKey: "WeaponID" });
  Duty.belongsTo(Weapon, { foreignKey: "WeaponID" });
  OfficerDuty.belongsTo(Weapon, { foreignKey: "WeaponID" });

  FollowingRigion.hasMany(followersolider, { foreignKey: "followplace" });
  followersolider.belongsTo(FollowingRigion, { foreignKey: "followplace" });
  FollowingRigion.hasMany(TrainingSoldier, { foreignKey: "followplace" });
  TrainingSoldier.belongsTo(FollowingRigion, { foreignKey: "followplace" });

  FollowingRigion.hasMany(Followerrateb, { foreignKey: "followplace" });
  Followerrateb.belongsTo(FollowingRigion, { foreignKey: "followplace" });
  FollowingRigion.hasMany(TrainingRateb, { foreignKey: "followplace" });
  TrainingRateb.belongsTo(FollowingRigion, { foreignKey: "followplace" });

  TravalTable.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(TravalTable, { foreignKey: "ID" });

  preuint.belongsTo(Rateb, { foreignKey: "id" });
  Rateb.hasMany(preuint, { foreignKey: "id" });

  preuint.belongsTo(Unit, { foreignKey: "uintid" });
  Unit.hasMany(preuint, { foreignKey: "uintid" });

  makhzan.belongsTo(Rateb, { foreignKey: "id" });
  Rateb.hasMany(makhzan, { foreignKey: "id" });

  tahel.belongsTo(Rateb, { foreignKey: "id" });
  Rateb.hasMany(tahel, { foreignKey: "id" });

  RatebTraineeShip.belongsTo(Rateb, { foreignKey: "id" });
  Rateb.hasMany(RatebTraineeShip, { foreignKey: "id" });

  prevlevelup.belongsTo(Rateb, { foreignKey: "id" });
  Rateb.hasMany(prevlevelup, { foreignKey: "id" });

  inventoryLevelup.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(inventoryLevelup, { foreignKey: "ID" });

  userTracking.belongsTo(Users, { foreignKey: "userId" });
  Users.hasMany(userTracking, { foreignKey: "userId" });
  SessionTracking.belongsTo(Users, { foreignKey: "userId" });
  Users.hasMany(SessionTracking, { foreignKey: "userId" });

  SessionTracking.belongsTo(Devices, { foreignKey: "MAC" });
  Devices.hasMany(SessionTracking, { foreignKey: "MAC" });

  Recommendations.belongsTo(Users, { foreignKey: "UserId" });
  Users.hasMany(Recommendations, { foreignKey: "UserId" });
  SMRecommandations.belongsTo(Users, { foreignKey: "UserId" });
  Users.hasMany(SMRecommandations, { foreignKey: "UserId" });
  RecommendationAndSelections.belongsTo(Users, { foreignKey: "UserId" });
  Users.hasMany(RecommendationAndSelections, { foreignKey: "UserId" });

  SoldierSecuritySituations.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(SoldierSecuritySituations, { foreignKey: "ID" });

  UnitEffecs.belongsTo(Unit, { foreignKey: "UnitID" });
  UnitEffecs.belongsTo(Soldier, { foreignKey: "ID" });
  UnitEffecs.belongsTo(Rateb, { foreignKey: "ID" });

  RatebGeneralKnowledge.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(RatebGeneralKnowledge, { foreignKey: "ID" });

  Grade.belongsTo(Rateb, { foreignKey: "SoliderID" });
  Rateb.hasMany(Grade, { foreignKey: "SoliderID" });

  SMRecommandations.belongsTo(Weapon, { foreignKey: "RecentWeapon" });
  Weapon.hasMany(SMRecommandations, { foreignKey: "RecentWeapon" });

  PreviousJobs.belongsTo(Rateb, { foreignKey: "RatebID" });
  Rateb.hasMany(PreviousJobs, { foreignKey: "RatebID" });

  PreviousJobs.belongsTo(Jobs, { foreignKey: "JobID" });
  Jobs.hasMany(PreviousJobs, { foreignKey: "JobID" });

  Neshan.belongsTo(Rateb, { foreignKey: "SoilderID" });
  Rateb.hasMany(Neshan, { foreignKey: "SoilderID" });

  RatebsMedicalSituations.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(RatebsMedicalSituations, { foreignKey: "ID" });

  RatebsPhsycoligicalSituations.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(RatebsPhsycoligicalSituations, { foreignKey: "ID" });

  SoldiersMedicalSituations.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(SoldiersMedicalSituations, { foreignKey: "ID" });

  SoldiersPhsycoligicalSituations.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(SoldiersPhsycoligicalSituations, { foreignKey: "ID" });

  SoldiersSelectionSituations.belongsTo(Soldier, { foreignKey: "ID" });
  Soldier.hasMany(SoldiersSelectionSituations, { foreignKey: "ID" });

  // WeaponDutyPivot.belongsTo(MortabatDuties, { foreignKey: "ID_KEY" });
  // MortabatDuties.hasOne(WeaponDutyPivot, { foreignKey: "ID_KEY" });

  Duty.belongsTo(MortabatDuties, { foreignKey: "DutyID" });
  MortabatDuties.hasOne(Duty, { foreignKey: "DutyID", sourceKey: "DutyID" });

  OfficerDuty.belongsTo(OfficerMortabatDuties, { foreignKey: "DutyID" });
  OfficerMortabatDuties.hasOne(OfficerDuty, {
    foreignKey: "DutyID",
    sourceKey: "DutyID"
  });

  Weapon.belongsTo(MortabatDuties, { foreignKey: "WeaponID" });
  MortabatDuties.hasOne(Weapon, {
    foreignKey: "WeaponID",
    sourceKey: "WeaponID"
  });
  Weapon.belongsTo(OfficerMortabatDuties, { foreignKey: "WeaponID" });
  OfficerMortabatDuties.hasOne(Weapon, {
    foreignKey: "WeaponID",
    sourceKey: "WeaponID"
  });

  Hospital.hasMany(InjuredHospitals, {
    foreignKey: "HospitalID"
  });

  InjuredHospitals.belongsTo(Hospital, {
    foreignKey: "HospitalID"
  });

  UnitCollectionPivot.belongsTo(Unit, {
    foreignKey: "UnitID"
  });
  Unit.hasOne(UnitCollectionPivot, {
    foreignKey: "UnitID"
  });
  UnitCollectionPivot.belongsTo(UnitCollections, {
    foreignKey: "CollectionId"
  });
  UnitCollections.hasMany(UnitCollectionPivot, {
    foreignKey: "CollectionId"
  });

  MortabatDuties.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(MortabatDuties, { foreignKey: "UnitID" });
  OfficerMortabatDuties.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(OfficerMortabatDuties, { foreignKey: "UnitID" });

  Rateb.belongsTo(Jobs, { foreignKey: "CurrentJobID" });
  Jobs.hasMany(Rateb, { foreignKey: "CurrentJobID" });

  Unit.belongsTo(Weapon, { foreignKey: "FollowedWeaponID" });
  Unit.belongsTo(CommandRegions, { foreignKey: "CommandAreasID" });
  Unit.belongsTo(FollowingAreas, { foreignKey: "FollowingAreasID" });
  Unit.belongsTo(Pattern, { foreignKey: "PatternID" });

  Weapon.hasMany(Unit, { foreignKey: "FollowedWeaponID" });
  CommandRegions.hasMany(Unit, { foreignKey: "CommandAreasID" });
  FollowingAreas.hasMany(Unit, { foreignKey: "FollowingAreasID" });
  Pattern.hasMany(Unit, { foreignKey: "PatternID" });

  EffectSituationStates.hasMany(Situations, {
    foreignKey: "SituationID"
  });
  Situations.belongsTo(EffectSituationStates, {
    foreignKey: "SituationID"
  });

  PunishmentTypes.hasMany(punshments, {
    foreignKey: "PunishmentTypeID"
  });
  punshments.belongsTo(PunishmentTypes, {
    foreignKey: "PunishmentTypeID"
  });

  PunishmentTypes.hasMany(RatebPenalities, {
    foreignKey: "PunishmentTypeID",
    sourceKey: "ID_KEY"
  });
  RatebPenalities.belongsTo(PunishmentTypes, {
    foreignKey: "PunishmentTypeID",
    sourceKey: "ID_KEY"
  });

  Unit.hasMany(PointHub, { foreignKey: "Unit_ID", sourceKey: "UnitID" });
  PointHub.belongsTo(Unit, { foreignKey: "Unit_ID", sourceKey: "UnitID" });

  PointHub.hasMany(Point, { foreignKey: "Hub_ID", sourceKey: "ID_KEY" });
  Point.belongsTo(PointHub, { foreignKey: "Hub_ID", sourceKey: "ID_KEY" });

  Requests.belongsTo(Unit, { foreignKey: "RecommendedUnitID" });
  Unit.hasMany(Requests, { foreignKey: "RecommendedUnitID" });

  lossCompensation.belongsTo(LossGroups, {
    foreignKey: "LossGroupID"
  });
  LossGroups.hasMany(lossCompensation, { foreignKey: "LossGroupID" });

  lossCompensation.belongsTo(PackagePlan, {
    foreignKey: "PackagePlanID"
  });
  PackagePlan.hasMany(lossCompensation, { foreignKey: "PackagePlanID" });

  Rateb.hasMany(RatebRecommendations, {
    foreignKey: "RatebID"
  });
  RatebRecommendations.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });
  Rateb.hasMany(TransferIntelligence, {
    foreignKey: "RatebID"
  });
  TransferIntelligence.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });

  Rateb.hasMany(TransferAllocation, {
    foreignKey: "RatebID"
  });
  TransferAllocation.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });

  Rateb.hasMany(TransferAllocationSnapshot, {
    foreignKey: "RatebID"
  });
  TransferAllocationSnapshot.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });

  Rateb.hasMany(OutOfRenew, {
    foreignKey: "RatebID"
  });
  OutOfRenew.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });

  RenewList.hasMany(OutOfRenew, {
    foreignKey: "RenewListID"
  });
  OutOfRenew.belongsTo(RenewList, {
    foreignKey: "RenewListID"
  });
  Rateb.hasMany(OtherRenewCandidates, {
    foreignKey: "RatebID"
  });
  OtherRenewCandidates.belongsTo(Rateb, {
    foreignKey: "RatebID"
  });

  RenewList.hasMany(OtherRenewCandidates, {
    foreignKey: "RenewListID"
  });
  OtherRenewCandidates.belongsTo(RenewList, {
    foreignKey: "RenewListID"
  });

  Unit.hasMany(RatebRecommendations, {
    foreignKey: "RecommendedUnitID"
  });
  RatebRecommendations.belongsTo(Unit, {
    foreignKey: "RecommendedUnitID"
  });
  Unit.hasMany(TransferIntelligence, {
    foreignKey: "RecommendedUnitID"
  });
  TransferIntelligence.belongsTo(Unit, {
    foreignKey: "RecommendedUnitID"
  });

  Unit.hasMany(Requests, {
    foreignKey: "RecommendedUnitID"
  });
  Requests.belongsTo(Unit, {
    foreignKey: "RecommendedUnitID"
  });

  Unit.hasMany(TransferAllocation, {
    foreignKey: "TransferedUnitID"
  });
  TransferAllocation.belongsTo(Unit, {
    foreignKey: "TransferedUnitID"
  });

  Unit.hasMany(TransferAllocationSnapshot, {
    foreignKey: "TransferedUnitID"
  });
  TransferAllocationSnapshot.belongsTo(Unit, {
    foreignKey: "TransferedUnitID"
  });

  Unit.hasMany(TransferListUnits, {
    foreignKey: "UnitID"
  });
  TransferListUnits.belongsTo(Unit, {
    foreignKey: "UnitID"
  });

  TransferList.hasMany(RatebRecommendations, {
    foreignKey: "TransferListID"
  });
  RatebRecommendations.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });
  TransferList.hasMany(TransferIntelligence, {
    foreignKey: "TransferListID"
  });
  TransferIntelligence.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  TransferList.hasMany(TransferAllocation, {
    foreignKey: "TransferListID"
  });
  TransferAllocation.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  TransferList.hasMany(TransferAllocationSnapshot, {
    foreignKey: "TransferListID"
  });
  TransferAllocationSnapshot.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  PunishmentTypes.hasMany(punshments, {
    foreignKey: "PunishmentTypeID"
  });
  punshments.belongsTo(PunishmentTypes, {
    foreignKey: "PunishmentTypeID"
  });

  TahelCourses.hasMany(tahel, {
    foreignKey: "TahelCourseID"
  });
  tahel.belongsTo(TahelCourses, {
    foreignKey: "TahelCourseID"
  });

  TransferList.hasMany(Requests, {
    foreignKey: "TransferListID"
  });
  Requests.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  TransferList.hasMany(TransferCandidates, {
    foreignKey: "TransferListID"
  });
  TransferCandidates.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  WebUnits.belongsTo(Rateb, {
    foreignKey: "ID"
  });

  Rateb.hasMany(WebUnits, {
    foreignKey: "ID"
  });
  LowLevels.belongsTo(Rateb, { foreignKey: "ID" });
  Rateb.hasMany(LowLevels, { foreignKey: "ID" });

  TransferListBalancer.belongsTo(Unit, {
    foreignKey: "UnitID"
  });

  TransferListBalancer.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  TransferListUnitErrors.belongsTo(Unit, {
    foreignKey: "UnitID"
  });

  TransferListUnitErrors.belongsTo(TransferList, {
    foreignKey: "TransferListID"
  });

  TransferListUnitErrors.belongsTo(Jobs, {
    foreignKey: "JobID"
  });

  TransferListJobBlancer.belongsTo(Unit, {
    foreignKey: "UnitID"
  });

  //personal affairs
  MartyrsAndInjured.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(MartyrsAndInjured, { foreignKey: "UnitID" });

  MartyrsAndInjured.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(MartyrsAndInjured, { foreignKey: "WeaponID" });

  MartyrsAndInjuredAndDeath.belongsTo(Wars, { foreignKey: "WarID" });
  Wars.hasMany(MartyrsAndInjuredAndDeath, { foreignKey: "WarID" });

  Vaccinators.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(Vaccinators, { foreignKey: "UnitID" });

  Vaccinators.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(Vaccinators, { foreignKey: "WeaponID" });

  Vaccinators.belongsTo(Vaccine, { foreignKey: "VaccineID" });
  Vaccine.hasMany(Vaccinators, { foreignKey: "VaccineID" });

  Vaccinators.belongsTo(Diseases, {
    sourceKey: "ID_KEY",
    foreignKey: "DiseaseID"
  });
  Diseases.hasMany(Vaccinators, {
    sourceKey: "ID_KEY",
    foreignKey: "DiseaseID"
  });

  MedicalRequests.belongsTo(Hospital, { foreignKey: "HospitalID" });
  Hospital.hasMany(MedicalRequests, { foreignKey: "HospitalID" });

  Kids.belongsTo(Wives, { foreignKey: "MomID" });
  Wives.hasMany(Kids, { foreignKey: "MomID" });

  PsychologicalRequests.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(PsychologicalRequests, { foreignKey: "UnitID" });

  PsychologicalRequests.belongsTo(Hospital, { foreignKey: "HospitalID" });
  Hospital.hasMany(PsychologicalRequests, { foreignKey: "HospitalID" });

  Vaccine.belongsTo(Diseases, { foreignKey: "DiseaseID" });
  Diseases.hasMany(Vaccine, { foreignKey: "DiseaseID" });

  PsychologicalRequests.belongsTo(FollowUpParty, {
    foreignKey: "FollowUpPartyID"
  });
  FollowUpParty.hasMany(PsychologicalRequests, {
    foreignKey: "FollowUpPartyID"
  });

  AcademicallyExcellence.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(AcademicallyExcellence, { foreignKey: "UnitID" });

  ExcellentParent.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(ExcellentParent, { foreignKey: "UnitID" });

  Custodies.belongsTo(CustodiesType, { foreignKey: "CustodyTypeID" });
  CustodiesType.hasMany(Custodies, { foreignKey: "CustodyTypeID" });

  Appeals.belongsTo(AppealType, { foreignKey: "AppealTypeID" });
  AppealType.hasMany(Appeals, { foreignKey: "AppealTypeID" });

  Custodies.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(Custodies, { foreignKey: "UnitID" });

  UnitsCars.belongsTo(CarColor, { foreignKey: "CarColorID" });
  UnitsCars.belongsTo(CarType, { foreignKey: "CarTypeID" });
  UnitsCars.belongsTo(ResponsibleSide, { foreignKey: "SideID" });
  UnitsCars.belongsTo(CarUsage, { foreignKey: "CarUsageID" });
  UnitsCars.belongsTo(CarCargo, { foreignKey: "CarCargoID" });
  UnitsCars.belongsTo(CarPreparation, { foreignKey: "CarPreparationID" });
  UnitsCars.belongsTo(Unit, { foreignKey: "UnitID" });

  UnitBoats.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(UnitBoats, { foreignKey: "UnitID" });
  UnitBoats.belongsTo(Boats, { foreignKey: "BoatID" });
  Boats.hasMany(UnitBoats, { foreignKey: "BoatID" });

  DriversPerCar.belongsTo(CarUsage, { foreignKey: "CarUsageID" });
  CarUsage.hasMany(DriversPerCar, { foreignKey: "CarUsageID" });

  UnitSystems.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(UnitSystems, { foreignKey: "UnitID" });
  UnitSystems.belongsTo(Systems, { foreignKey: "SystemID" });
  Systems.hasMany(UnitSystems, { foreignKey: "SystemID" });

  City.belongsTo(Direction, { foreignKey: "CityID" });
  Direction.hasMany(City, { foreignKey: "CityID" });

  UnitSignals.belongsTo(Unit, { foreignKey: "UnitID" });
  Unit.hasMany(UnitSignals, { foreignKey: "UnitID" });
  UnitSignals.belongsTo(SignalWeapons, { foreignKey: "SignalWeaponID" });
  SignalWeapons.hasMany(UnitSignals, { foreignKey: "SignalWeaponID" });
  UnitSignals.belongsTo(SignalWeaponTypes, {
    foreignKey: "SignalWeaponTypeID"
  });
  SignalWeaponTypes.hasMany(UnitSignals, { foreignKey: "SignalWeaponTypeID" });

  Unit.hasMany(UnitsCars, { foreignKey: "UnitID" });
  CarPreparation.hasMany(UnitsCars, { foreignKey: "CarPreparationID" });
  CarCargo.hasMany(UnitsCars, { foreignKey: "CarCargoID" });
  CarUsage.hasMany(UnitsCars, { foreignKey: "CarUsageID" });
  CarType.hasMany(UnitsCars, { foreignKey: "CarTypeID" });
  ResponsibleSide.hasMany(UnitsCars, { foreignKey: "SideID" });
  CarColor.hasMany(UnitsCars, { foreignKey: "CarColorID" });

  // UnitsCars.belongsTo(MajorVehicles, { foreignKey: "CarNumber" });
  // MajorVehicles.hasMany(UnitsCars, { foreignKey: "CarNumber" });

  MajorVehicles.belongsTo(UnitsCars, { foreignKey: "CarNumber" });
  UnitsCars.hasMany(MajorVehicles, { foreignKey: "CarNumber" });
  //

  MajorVehicles.belongsTo(Weapon, { foreignKey: "WeaponID" });
  Weapon.hasMany(MajorVehicles, { foreignKey: "WeaponID" });

  SignalWeapons.belongsTo(SignalWeaponTypes, { foreignKey: "TypeID" });
  SignalWeaponTypes.hasMany(SignalWeapons, { foreignKey: "TypeID" });

  Unit.hasMany(CompletePlanUnit, { foreignKey: "UnitID" });
  CompletePlanUnit.belongsTo(Unit, { foreignKey: "UnitID" });

  Unit.hasMany(OrganizationPlanUnit, { foreignKey: "UnitID" });
  OrganizationPlanUnit.belongsTo(Unit, { foreignKey: "UnitID" });

  Unit.hasMany(CompletePlanUnit, { foreignKey: "UnitID" });
  CompletePlanUnit.belongsTo(Unit, { foreignKey: "UnitID" });

  CompletePlanUnit.hasMany(PackagePlan, { foreignKey: "PackagePlanID" });
  PackagePlan.belongsTo(CompletePlanUnit, { foreignKey: "PackagePlanID" });

  OrganizationPlanUnit.hasMany(PackagePlan, { foreignKey: "PackagePlanID" });
  PackagePlan.belongsTo(OrganizationPlanUnit, { foreignKey: "PackagePlanID" });

  Unit.hasMany(AddPackageCandidates, { foreignKey: "PackagedUnitID" });
  AddPackageCandidates.belongsTo(Unit, { foreignKey: "PackagedUnitID" });

  AddPackageCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(AddPackageCandidates, { foreignKey: "SoldierID" });

  AddPackageCandidates.belongsTo(PackagePlan, { foreignKey: "PackageID" });
  PackagePlan.hasMany(AddPackageCandidates, { foreignKey: "PackageID" });

  Unit.hasMany(OrganizationPlanCandidates, { foreignKey: "PackagedUnitID" });
  OrganizationPlanCandidates.belongsTo(Unit, { foreignKey: "PackagedUnitID" });

  OrganizationPlanCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(OrganizationPlanCandidates, { foreignKey: "SoldierID" });

  OrganizationPlanCandidates.belongsTo(PackagePlan, {
    foreignKey: "PackageID"
  });
  PackagePlan.hasMany(OrganizationPlanCandidates, { foreignKey: "PackageID" });

  Unit.hasMany(CompletePlanCandidates, { foreignKey: "PackagedUnitID" });
  CompletePlanCandidates.belongsTo(Unit, { foreignKey: "PackagedUnitID" });

  accidentCategories.hasMany(accidentTypes, { foreignKey: "CategoryID" });
  accidentTypes.belongsTo(accidentCategories, { foreignKey: "CategoryID" });

  accidentTypes.hasMany(Accidents, { foreignKey: "TypeID" });
  Accidents.belongsTo(accidentTypes, { foreignKey: "TypeID" });

  Unit.hasMany(Accidents, { foreignKey: "UnitID" });
  Accidents.belongsTo(Unit, { foreignKey: "UnitID" });

  CompletePlanCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(CompletePlanCandidates, { foreignKey: "SoldierID" });

  CompletePlanCandidates.belongsTo(PackagePlan, {
    foreignKey: "PackageID"
  });
  PackagePlan.hasMany(CompletePlanCandidates, { foreignKey: "PackageID" });
  LossGroups.hasMany(CompensationLossCandidates, {
    foreignKey: "LossGroupID"
  });
  CompensationLossCandidates.belongsTo(LossGroups, {
    foreignKey: "LossGroupID"
  });

  CompensationLossCandidates.belongsTo(Soldier, { foreignKey: "SoldierID" });
  Soldier.hasMany(CompensationLossCandidates, { foreignKey: "SoldierID" });

  CompensationLossCandidates.belongsTo(PackagePlan, {
    foreignKey: "PackageID"
  });
  PackagePlan.hasMany(CompensationLossCandidates, { foreignKey: "PackageID" });

  PackagePlan.hasOne(PackagePlanDates, { foreignKey: "PackagePlanID" });
  PackagePlanDates.belongsTo(PackagePlan, { foreignKey: "PackagePlanID" });

  WorkPlacesAdditions.belongsTo(followerwork, { foreignKey: "WorkPlaceID" });
  followerwork.hasMany(WorkPlacesAdditions, { foreignKey: "WorkPlaceID" });

  WorkPlacesAdditions.hasMany(AdditionsWorkPlacesFollowers, {
    foreignKey: "WorkPlaceAdditionsID"
  });
  AdditionsWorkPlacesFollowers.belongsTo(WorkPlacesAdditions, {
    foreignKey: "WorkPlaceAdditionsID"
  });

  FollowerArchiveFiles.hasMany(ArchiveFileFollowers, {
    foreignKey: "ArchiveFileID"
  });

  ArchiveFileFollowers.belongsTo(FollowerArchiveFiles, {
    foreignKey: "ArchiveFileID"
  });

  ArchiveFileFollowers.belongsTo(Rateb, {
    foreignKey: "ID"
  });
  Rateb.hasMany(ArchiveFileFollowers, {
    foreignKey: "ID"
  });

  ArchiveFileFollowers.belongsTo(Soldier, {
    foreignKey: "ID"
  });
  Soldier.hasMany(ArchiveFileFollowers, {
    foreignKey: "ID"
  });

  TraineeShipCollection.hasMany(TraineeShipCollectionPivot, {
    foreignKey: "CollectionId"
  });
  TraineeShipCollectionPivot.belongsTo(TraineeShipCollection, {
    foreignKey: "CollectionId"
  });

  TraineeShip.hasMany(TraineeShipCollectionPivot, {
    foreignKey: "TraineeShipID"
  });
  TraineeShipCollectionPivot.belongsTo(TraineeShip, {
    foreignKey: "TraineeShipID"
  });

  WorkPlaceMainPower.belongsTo(followerwork, { foreignKey: "WorkPlaceID" });
  followerwork.hasMany(WorkPlaceMainPower, { foreignKey: "WorkPlaceID" });

  OtherLoss.belongsTo(OtherLossTypes, { foreignKey: "OtherLossTypeID" });
  OtherLossTypes.hasMany(OtherLoss, { foreignKey: "OtherLossTypeID" });

  Accidents.hasMany(OtherLoss, { foreignKey: "AccidentID" });
  OtherLoss.belongsTo(Accidents, { foreignKey: "AccidentID" });

  Accidents.hasMany(HumanLoss, { foreignKey: "AccidentID" });
  HumanLoss.belongsTo(Accidents, { foreignKey: "AccidentID" });

  VolunteeringRecommendation.hasMany(VolunteersProcedures, {
    foreignKey: "VolunteerID"
  });
  VolunteersProcedures.belongsTo(VolunteeringRecommendation, {
    foreignKey: "VolunteerID"
  });

  KsasVolunteeringRecommendation.hasMany(KsasVolunteersProcedures, {
    foreignKey: "VolunteerID"
  });
  KsasVolunteersProcedures.belongsTo(KsasVolunteeringRecommendation, {
    foreignKey: "VolunteerID"
  });

  return {
    DriversPerCar,
    TraineeShipCollection,
    TransferAllocationSnapshot,
    TraineeShipCollectionPivot,
    InjuredHospitals,
    Investigations,
    Appeals,
    Custodies,
    CustodiesType,
    AppealType,
    Complaints,
    GeneralRequests,
    Colours,
    Wives,
    Kids,
    Boats,
    UnitBoats,
    Diseases,
    FollowUpParty,
    Vaccine,
    Vaccinators,
    ColorPalettes,
    TransferListJobBlancer,
    TransferListUnitErrors,
    RatebTraineeShip,
    Point,
    TransferListUnits,
    PointHub,
    NewComersRequests,
    ActionsTaken,
    ResponsibleParty,
    TraineeShip,
    EndingReasons,
    MortabatDuties,
    WeaponDutyPivot,
    RecommendationAndSelections,
    Specialization,
    OfficerSoldierRecommendation,
    RatebGeneralKnowledge,
    SoldierSecuritySituations,
    Brothers,
    Certificators,
    EnrollersCertificators,
    UnitEffecs,
    Colleges,
    Fittings,
    Centre,
    Devices,
    City,
    Direction,
    DiscountTime,
    DistributionSuggestion,
    TahelCourses,
    DriversArrival,
    TransferAllocation,
    Duty,
    FittingRules,
    Sectors,
    SpecialOrganizedUnits,
    TransferList,
    RatebPunishments,
    Employes,
    EndingCause,
    Family,
    PunishmentTypes,
    Followerrateb,
    Followers,
    FollowingNos,
    FollowingRigion,
    Grade,
    inventoryLevelup,
    Mosarah,
    Motabaa,
    Moving,
    MyUsers,
    Neshan,
    NewComersArrivals,
    TrainingSoldier,
    NewComersTimeline,
    OldFollowersNo,
    Password,
    UnitSystems,
    Permissions,
    Rateb,
    RatebX,
    Ratebzzz,
    Recommendations,
    RegisterationEssurance,
    SMDriversSuggestion,
    SMSoldier,
    SelectionSoldier,
    SelectionType,
    UnitSignals,
    SelectionUsers,
    Selections,
    OfficerCourses,
    SituationDecision,
    SituationStates,
    Situations,
    Soldier,
    SpareSoldiers,
    Tankolat,
    Tasreeh,
    TravalTable,
    Twsiat,
    Unit,
    UnitEngineersPlan,
    TrainingRateb,
    Jobs,
    UnitSelect,
    Unit_Jobs,
    UserPermissions,
    users: Users,
    Weapon,
    carruntlevel,
    chat,
    followersolider,
    followerwork,
    makhzan,
    RatebRecommendations,
    preuint,
    prevlevelup,
    punshments,
    RatebPenalities,
    security,
    shakawi,
    JobPackagingDaily,
    suggest,
    tagdidMohab,
    tagdidrevsioin,
    tahel,
    tasgiltag,
    SMGeneral,
    MilitaryManagementOfficers,
    userTracking,
    SessionTracking,
    Correspondences,
    TransportLicense,
    Requests,
    PreviousJobs,
    SMRecommandations,
    SoldiersMedicalSituations,
    SoldiersPhsycoligicalSituations,
    UnitsOfficers,
    OfficerVacations,
    Obligations,
    SoldiersSelectionSituations,
    OtherRenewCandidates,
    Systems,
    TransferCandidates,
    CommandRegions,
    AddPlans,
    RemovePlans,
    FollowingAreas,
    // MonthlyReview,
    // MonthlyReviewUnits,
    Pattern,
    RenewList,
    RenewCandidates,
    RenewAddPlans,
    RecStages,
    RenewRemovePlans,
    OutOfRenew,
    EffectSituationStates,
    PointHub,
    WebUnits,
    TransferListBalancer,
    RecuStartDates,
    UnitCollectionPivot,
    UnitCollections,
    distriputionPlanList,
    distriputionPlanStats,
    enrollersPlanList,
    enrollersPlanDetails,
    RatebsMedicalSituations,
    RatebsPhsycoligicalSituations,
    OfficerDuty,
    OfficerMortabatDuties,
    ArrivalToTrainingCenterDates,
    VehiclesSiasa,
    UsersGroups,
    InternalFollowUp,
    MartyrsAndInjured,
    MartyrsAndInjuredAndDeath,
    MartyrWifeAndSon,
    ParentsAndBrothers,
    Hajj,
    PublicName,
    Employment,
    DepartmentsInternalFollow,
    Honors,
    Demands,
    FinancialDues,
    Hospital,
    MedicalRequests,
    PsychologicalRequests,
    TransferListEffects,
    MessengerCalls,
    MessengerChats,
    Calendars,
    CalendarDegrees,
    CalendarTypes,
    CalendarAlarms,
    Officers,
    IdealSoldier,
    AcademicallyExcellence,
    ExcellentParent,
    UnitsCars,
    MajorVehicles,
    CarUsage,
    CarType,
    ResponsibleSide,
    CarColor,
    SystemRules,
    CarPreparation,
    TransferIntelligence,
    CarCargo,
    SignalWeapons,
    SignalWeaponTypes,
    reviewPlanList,
    reviewPlanListDetails,
    Levels,
    PackagePlan,
    CompletePlanUnit,
    lossCompensation,
    LossGroups,
    PackageCandidates,
    Housing,
    RemovedPackageCandidates,
    OrganizationPlanUnit,
    AddPackageCandidates,
    OrganizationPlanCandidates,
    CompletePlanCandidates,
    CompensationLossCandidates,
    PackagePlanDates,
    RecuEndDates,
    Branches,
    Missions,
    OfficerMissions,
    Vacations,
    CertificatesWithRewards,
    GradesWithRewards,
    Courses,
    ReasonsDecisions,
    Wars,
    SoliderTypesWithRewards,
    AdditionsWorkPlacesFollowers,
    WorkPlacesAdditions,
    PrivatePages,
    Causations,
    ArchiveFileFollowers,
    FollowerArchiveFiles,
    OtherLossTypes,
    LowLevels,
    accidentTypes,
    StageSupportReports,
    accidentCategories,
    WorkPlaceMainPower,
    Accidents,
    OtherLoss,
    HumanLoss,
    VolunteeringTimePlan,
    KsasVolunteeringTimePlan,
    KsasVolunteeringRecommendation,
    KsasVolunteersProcedures,
    VolunteeringRecommendation,
    HighLevelWeaponManagement,
    VolunteersProcedures,
    VicealesManagment
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
