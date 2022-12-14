const { QueryTypes } = require("sequelize");
const getUnits = require("./getUnits");
const types = require("./types").default;

const SoldierCategoryMap = types.SoldierCategoryMap;

const displayTypes = types.displayTypes;

function calculateTotal(weapons, obj, value) {
  return weapons
    .map(weapon => obj[weapon][value])
    .reduce((perve, cur) => perve + cur, 0);
}
const lodash = require("lodash");

module.exports = async (db, params) => {
  function runQuery(query) {
    return db.sequelize.query(query, {
      type: QueryTypes.SELECT
    });
  }
  // get units
  const units = await getUnits(db, params);
  const categories = SoldierCategoryMap.filter(
    ele => params.SoldierCategories.indexOf(ele.text) > -1
  );

  const result = await Promise.all(
    units.map(async ele => {
      let siasa = { ...ele, type: "سياسة", totals: { total: 0 } },
        mortab = { ...ele, type: "مرتب", totals: { total: 0 } },
        rateb = { ...ele, type: "راتب عالي", totals: { total: 0 } },
        soliders = { ...ele, type: "مجند", totals: { total: 0 } };

      for (const weapon of params.weapons) {
        siasa[weapon] = {};
        mortab[weapon] = {};
        rateb[weapon] = {};
        soliders[weapon] = {};
        for (const category of categories) {
          const salaries = await runQuery(`
          select Coalesce ( SUM(El_Moratab),0) mortab ,
                Coalesce ( SUM(Siasa) ,0) siasa from SMGeneral
                  where UNIT_NAME   like N'%${ele.Unit}%' and
                  Feaa_Code like N'%${category.text}%'
                  and Weapon like N'%${weapon}%'
          
          `);

          const soliderCount = await runQuery(`
            SELECT Coalesce (Count(ID),0) count FROM Soldier
            inner join Unit on Unit.UnitID = Soldier.UnitID
            inner join Weapon on Weapon.WeaponID = Soldier.WeaponID
            Where Status = N'بالخدمة'
            and Unit.Unit like  N'%${ele.Unit}%'
            and Weapon.Weapon like N'%${weapon}%' 
            and SoldierCategory like  N'%${category.text}%'
          `);

          const RatabCount = await runQuery(`
            SELECT Coalesce (Count(ID),0) count  FROM Rateb
            inner join Unit on Unit.UnitID =Rateb.UnitID 
            inner join Weapon on Weapon.WeaponID = Rateb.WeaponID
            Where RatebState = N'بالخدمة' 
            and Unit.Unit like  N'%${ele.Unit}%'
            and RatebCategory like N'%${category.text}%'
            and Weapon.Weapon like N'%${weapon}%' 
          `);

          siasa[weapon][category.mappedValue] = salaries[0].siasa;
          mortab[weapon][category.mappedValue] = salaries[0].mortab;
          soliders[weapon][category.mappedValue] = soliderCount[0].count;
          rateb[weapon][category.mappedValue] = RatabCount[0].count;
        }
      }

      categories.forEach(category => {
        siasa.totals[category.mappedValue] = calculateTotal(
          params.weapons,
          siasa,
          category.mappedValue
        );
        mortab.totals[category.mappedValue] = calculateTotal(
          params.weapons,
          mortab,
          category.mappedValue
        );
        soliders.totals[category.mappedValue] = calculateTotal(
          params.weapons,
          soliders,
          category.mappedValue
        );
        rateb.totals[category.mappedValue] = calculateTotal(
          params.weapons,
          rateb,
          category.mappedValue
        );
      });

      categories.forEach(category => {
        siasa.totals.total += siasa.totals[category.mappedValue];
        mortab.totals.total += mortab.totals[category.mappedValue];
        soliders.totals.total += soliders.totals[category.mappedValue];
        rateb.totals.total += rateb.totals[category.mappedValue];
      });
      return [siasa, mortab, soliders, rateb];
    })
  );

  if (params.Type == displayTypes.totalHodod) {
    let siasa = {
        type: "سياسة",
        totals: { total: 0 },
        Unit: "اجمالي قوات حرس الحدود"
      },
      mortab = {
        type: "مرتب",
        totals: { total: 0 },
        Unit: "اجمالي قوات حرس الحدود"
      },
      rateb = {
        type: "راتب عالي",
        totals: { total: 0 },
        Unit: "اجمالي قوات حرس الحدود"
      },
      soliders = {
        type: "مجند",
        totals: { total: 0 },
        Unit: "اجمالي قوات حرس الحدود"
      };

    for (const weapon of params.weapons) {
      siasa[weapon] = {};
      mortab[weapon] = {};
      rateb[weapon] = {};
      soliders[weapon] = {};
      for (const category of categories) {
        const salaries = await runQuery(`
          select Coalesce ( SUM(El_Moratab),0) mortab ,
            Coalesce ( SUM(Siasa) ,0) siasa from SMGeneral
              where 
              Feaa_Code like N'%${category.text}%'
              and Weapon like N'%${weapon}%'
      
      `);

        const soliderCount = await runQuery(`
        SELECT Coalesce (Count(ID),0) count FROM Soldier
        inner join Unit on Unit.UnitID = Soldier.UnitID
        inner join Weapon on Weapon.WeaponID = Soldier.WeaponID
        Where Status = N'بالخدمة'
        and Weapon.Weapon like N'%${weapon}%' 
        and SoldierCategory like  N'%${category.text}%'
      `);

        const RatabCount = await runQuery(`
        SELECT Coalesce (Count(ID),0) count  FROM Rateb
        inner join Unit on Unit.UnitID =Rateb.UnitID 
        inner join Weapon on Weapon.WeaponID = Rateb.WeaponID
        Where RatebState = N'بالخدمة' 
        and RatebCategory like N'%${category.text}%'
        and Weapon.Weapon like N'%${weapon}%' 
      `);

        siasa[weapon][category.mappedValue] = salaries[0].siasa;
        mortab[weapon][category.mappedValue] = salaries[0].mortab;
        soliders[weapon][category.mappedValue] = soliderCount[0].count;
        rateb[weapon][category.mappedValue] = RatabCount[0].count;
      }
    }

    categories.forEach(category => {
      siasa.totals[category.mappedValue] = calculateTotal(
        params.weapons,
        siasa,
        category.mappedValue
      );
      mortab.totals[category.mappedValue] = calculateTotal(
        params.weapons,
        mortab,
        category.mappedValue
      );
      soliders.totals[category.mappedValue] = calculateTotal(
        params.weapons,
        soliders,
        category.mappedValue
      );
      rateb.totals[category.mappedValue] = calculateTotal(
        params.weapons,
        rateb,
        category.mappedValue
      );
    });

    categories.forEach(category => {
      siasa.totals.total += siasa.totals[category.mappedValue];
      mortab.totals.total += mortab.totals[category.mappedValue];
      soliders.totals.total += soliders.totals[category.mappedValue];
      rateb.totals.total += rateb.totals[category.mappedValue];
    });
    return [siasa, mortab, soliders, rateb];
  }

  return lodash.flatten(result);
};
