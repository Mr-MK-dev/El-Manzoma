function cleanObject(obj) {
  for (var prop in obj) {
    if (obj[prop] === null || obj[prop] === undefined) {
      delete obj[prop];
    }
  }
  return Object.keys(obj).length > 0 ? obj : null;
}

module.exports = async (db, params) => {
  let ratebCoulmns = [
    "FileNo",
    "RatebCategory",
    "RatebLevel",
    "Directionforunit",
    "RatebState",
    "ServiceStyle",
    "SatrtingSarefRateb",
    "VolunteeringDate",
    "OlderindNo",
    "Qualification",
    "Namat",
    "Taskeen",
    "TahtElTawze3",
    "Dof3aNum",
    "JobBefore",
    "UnitJob",
    "MartialStatus",
    "NumOfChilds",
    "UnitJoinDate",
    "RatebCategoryFari",
    "Type",
    "UnitJoinDate"
  ];

  let soliderCoulmns = [
    "IndexNo",
    "SoldierCategory",
    "SoldierLevel",
    "RecuRegion",
    "RecuStartDate",
    "RecuStage",
    "RecuTreat",
    "MissingTime",
    "RecuEndDate",
    "SoldierStatus",
    "EndingCause",
    "College",
    "Specialization",
    "Job",
    "Direction",
    "Directionforunit",
    "ArrivalDate",
    "Alhaq",
    "TahtEltawze3",
    "BrotherID",
    "ServiceType",
    "GHA",
    "DriverLevel",
    "Treatment",
    "Markez_Tadreb",
    "Type"
  ];
  let search = params.search,
    like = ["ID", "Name"],
    multi = [
      "SoldierLevel",
      "SoldierStatus",
      "KnowledgeLevel",
      "SoldierCategory",
      "RecuTreat",
      "RecuStage",
      "Direction",
      "WeaponID",
      "UnitID",
      "DutyID",
      "CityID",
      "CentreID",
      "Religion",
      "BloodType",
      "College",
      "RecuRegion",
      "Treatment",
      "DriverLevel",
      "ServiceStyle",
      "RatebCategoryFari",
      "RatebCategory",
      "RatebLevel",
      "RatebState",
      "MartialStatus",
      "RecuEndDate",
      "Status",
      "SectorID"
    ],
    date = [
      "ArrivalDate",
      "BirthDate",
      "RecuStartDate",
      "VolunteeringDate",
      "UnitJoinDate",
      "SatrtingSarefRateb",
      "UnitJoinDate"
    ],
    ignore = ["Collections"],
    where = {};
  Object.keys(search).forEach(key => {
    if (!ignore.includes(key)) {
      let val = search[key];
      if (
        typeof val == "boolean" ||
        ((typeof val == "string" || Array.isArray(val)) &&
          val &&
          val.length > 0) ||
        (typeof val == "number" && (val || val === 0)) ||
        (typeof val == "object" && date.includes(key))
      ) {
        if (like.includes(key)) {
          where[key] = {
            $like: `${val}%`
          };
        } else if (multi.includes(key)) {
          where[key] = {
            $in: val.filter ? val.filter(ele => ele != null) : val
          };
        } else if (date.includes(key)) {
          if (val.from || val.to) {
            where[key] = {
              [val.from && val.to ? "$between" : val.from ? "$gte" : "$lte"]:
                val.from && val.to
                  ? [
                      new Date(
                        new Date(val.from).setDate(
                          new Date(val.from).getDate() - 1
                        )
                      ),
                      new Date(
                        new Date(val.to).setDate(new Date(val.to).getDate() + 1)
                      )
                    ]
                  : new Date(val.from)
                  ? new Date(val.from)
                  : new Date(val.to)
            };
          }
        } else {
          where[key] = val;
        }
      }
    }
  });

  let filterObject = (obj, array) => {
    array.forEach(ele => {
      delete obj[ele];
    });
    return obj;
  };
  try {
    let conscriptes =
        params.search.Type.indexOf("مجند") > -1
          ? await db.Soldier.findAll({
              where: filterObject(
                cleanObject({
                  ...where,
                  DirectionforFeaat: null,
                  Directionforunit: null,
                  SectorID: null
                }),
                ratebCoulmns
              ),
              include: [
                // {
                //   model: db.Weapon
                // },
                {
                  model: db.Unit,
                  where: cleanObject({
                    DirectionforFeaat: where.DirectionforFeaat,
                    Directionforunit: where.Directionforunit,
                    SectorID: where.SectorID
                  })
                }
                // {
                //   model: db.Duty
                // },
                // {
                //   model: db.City
                // },
                // {
                //   model: db.Centre
                // }
              ],
              raw: true,
              nest: true
            })
          : [],
      hightLevel =
        params.search.Type.indexOf("راتب عالى") > -1
          ? await db.Rateb.findAll({
              where: filterObject(
                cleanObject({
                  ...where,
                  DirectionforFeaat: null,
                  Directionforunit: null,
                  SectorID: null
                }),
                soliderCoulmns
              ),
              include: [
                // {
                //   model: db.Weapon
                // },
                {
                  model: db.Unit,
                  where: cleanObject({
                    DirectionforFeaat: where.DirectionforFeaat,
                    Directionforunit: where.Directionforunit,
                    SectorID: where.SectorID
                  })
                }
                // {
                //   model: db.Duty
                // },
                // {
                //   model: db.City
                // },
                // {
                //   model: db.Centre
                // }
              ],
              raw: true,
              nest: true
            })
          : [],
      parsed = [...conscriptes, ...hightLevel];
    return parsed;
  } catch (error) {
    return error;
  }
};
