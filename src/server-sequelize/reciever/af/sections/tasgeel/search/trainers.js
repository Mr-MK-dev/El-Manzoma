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
    "RatebCategory",
    "RatebLevel",
    "Type",
    "Category",
    "level"
  ];

  let workplaceColoumns = ["wokel7aq"];
  let enrollerCoulmns = [
    "ID",
    "Orderoffolwer",
    "OrderOfEndFollower",
    "Suputer",
    "notes",
    "Recommender",
    "FollowerDuty",
    "workplace",
    "isEnrolled",
    "isRecommended",
    "isSelected",
    "isTrainingOrder",
    "isIllegal",
    "TarekhElhak",
    "FollowerEndDate"
  ];

  let commonColoumns = [
    "Name",
    "Status",
    "KnowledgeLevel",
    "Religion",
    "UnitID",
    "WeaponID"
  ];

  let soliderCoulmns = [
    "SoldierCategory",
    "SoldierLevel",
    "RecuStage",
    "RecuEndDate",
    "Type",
    "Category",
    "level"
  ];
  let search = params.search,
    like = ["ID", "Name"],
    multi = [
      "Orderoffolwer",
      "OrderOfEndFollower",
      "SoldierLevel",
      "SoldierStatus",
      "KnowledgeLevel",
      "wokel7aq",
      "workplace",
      "SoldierCategory",
      "RecuStage",
      "WeaponID",
      "UnitID",
      "DutyID",
      "Religion",
      "RatebCategory",
      "RatebLevel",
      "RatebState",
      "RecuEndDate",
      "Status"
    ],
    ignore = [],
    date = ["TarekhElhak", "FollowerEndDate"],
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

  console.log("where", where);

  try {
    let conscriptes =
        params.search.Type.indexOf("مجند") > -1
          ? await db.TrainingSoldier.findAll({
              where: filterObject(cleanObject({ ...where }), [
                ...ratebCoulmns,
                ...soliderCoulmns,
                ...workplaceColoumns,
                ...commonColoumns
              ]),
              include: [
                {
                  model: db.Soldier,
                  where: filterObject(
                    cleanObject({
                      ...where
                    }),
                    [...ratebCoulmns, ...enrollerCoulmns, ...workplaceColoumns]
                  ),
                  include: [
                    {
                      model: db.ArchiveFileFollowers,
                      include: [
                        {
                          model: db.FollowerArchiveFiles
                        }
                      ]
                    },
                    {
                      model: db.Weapon
                    },
                    {
                      model: db.Unit
                    }
                  ],
                  raw: true,
                  nest: true
                },

                {
                  model: db.followerwork,
                  where: filterObject(
                    cleanObject({
                      ...where
                    }),
                    [
                      ...ratebCoulmns,
                      ...enrollerCoulmns,
                      ...soliderCoulmns,
                      ...commonColoumns
                    ]
                  )
                }
              ]
            })
          : [],
      hightLevel =
        params.search.Type.indexOf("راتب عالى") > -1
          ? await db.TrainingRateb.findAll({
              where: filterObject(cleanObject({ ...where }), [
                ...ratebCoulmns,
                ...soliderCoulmns,
                ...workplaceColoumns,
                ...commonColoumns
              ]),
              include: [
                {
                  model: db.Rateb,
                  where: filterObject(cleanObject({ ...where }), [
                    ...enrollerCoulmns,
                    ...soliderCoulmns,
                    ...workplaceColoumns
                  ]),
                  include: [
                    {
                      model: db.ArchiveFileFollowers,
                      include: [
                        {
                          model: db.FollowerArchiveFiles
                        }
                      ]
                    },
                    {
                      model: db.Weapon
                    },

                    {
                      model: db.Unit
                    }
                  ],
                  raw: true,
                  nest: true
                },
                {
                  model: db.followerwork,
                  where: filterObject(
                    cleanObject({
                      ...where
                    }),
                    [
                      ...ratebCoulmns,
                      ...enrollerCoulmns,
                      ...soliderCoulmns,
                      ...commonColoumns
                    ]
                  )
                }
              ]
            })
          : [];
    conscriptes.map(ele => ({ ...ele, Type: "مجند" }));
    hightLevel.map(ele => ({ ...ele, Type: "راتب عالى" }));
    let parsed = [...conscriptes, ...hightLevel];
    return JSON.parse(JSON.stringify(parsed));
  } catch (error) {
    console.log("enroller.js error", error);
    return error;
  }
};
