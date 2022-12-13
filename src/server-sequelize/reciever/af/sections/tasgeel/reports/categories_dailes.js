const { QueryTypes } = require("sequelize");
const getUnits = require("./getUnits");
const types = require("./types").default;

const SoldierCategoryMap = types.SoldierCategoryMap;
const displayTypes = types.displayTypes;

function calculateTotal(categories, ele, value) {
  return categories
    .map(category => ele[category.mappedValue][value])
    .reduce((perve, cur) => perve + cur, 0);
}
module.exports = async (db, params) => {
  // get units
  const units = await getUnits(db, params);

  const categories = SoldierCategoryMap.filter(
    ele => params.SoldierCategories.indexOf(ele.text) > -1
  );
  let recEndDateQuery = "> getdate()";

  if (params.RecuEndDate) {
    recEndDateQuery = `IN (${params.RecuEndDate.map(ele => `'${ele}'`).join(
      ","
    )})`;
  }

  const result = await Promise.all(
    units.map(async ele => {
      for (const category of categories) {
        if (!ele[category.mappedValue]) ele[category.mappedValue] = {};

        const moratbValue = await db.sequelize.query(
          `
          select Coalesce ( SUM(MortabatDuties.Moratab),0) mortab , Coalesce ( SUM(MortabatDuties.Siasa) ,0) siasa from MortabatDuties
          inner join Unit on Unit.UnitID = MortabatDuties.UnitID
          inner join Weapon on Weapon.WeaponId = MortabatDuties.WeaponId
           where Unit.Unit like N'%${ele.Unit}%' and Category like  N'%${
            category.text
          }%' 
          ${
            params.Weapon
              ? `and Weapon.Weapon in (${params.Weapon.map(
                  ele => `N'${ele}'`
                ).join(",")})`
              : ``
          }
          `,
          {
            type: QueryTypes.SELECT
          }
        );

        // TODO: refactor it to check if wepon is not hars hodo from soldier table after refactor
        const totalSMCount = await db.sequelize.query(
          `
          select  Coalesce ( count(ID),0) totalSoliderCount  from Soldier
          join Unit on Unit.UnitID = Soldier.UnitID 
          join Weapon on Weapon.WeaponID = Soldier.WeaponID
          where Unit = N'${ele.Unit}'
          and RecuEndDate ${recEndDateQuery}
          and Status = N'بالخدمة'
          and SoldierCategory  like N'%${category.text}%' 
         
          ${
            params.Weapon
              ? `and Weapon.Weapon in (${params.Weapon.map(
                  ele => `N'${ele}'`
                ).join(",")})`
              : `and Soldier.WeaponID != ${types.harsHododId}`
          }
          `,
          {
            type: QueryTypes.SELECT
          }
        );

        const value = await db.sequelize.query(
          `
          select  Coalesce ( count(ID),0) count  from Rateb 
          join Unit on Unit.UnitID = Rateb.UnitID
          join Weapon on Weapon.WeaponID = Rateb.WeaponID
          where Unit = N'${ele.Unit}' and
          RatebState = N'بالخدمة' 
          and RatebCategory like N'%${category.text}%'  
          ${
            params.Weapon
              ? `and Weapon.Weapon in (${params.Weapon.map(
                  ele => `N'${ele}'`
                ).join(",")})`
              : ""
          }
          `,
          {
            type: QueryTypes.SELECT
          }
        );

        ele[category.mappedValue] = {
          ...ele[category.mappedValue],
          ...moratbValue[0],
          ...totalSMCount[0],
          rateb: value[0].count
        };
      }

      // calcaulte total for each category

      categories.forEach(category => {
        ele[category.mappedValue]["total"] =
          ele[category.mappedValue].totalSoliderCount +
          ele[category.mappedValue].rateb;
      });
      // TODO: refactor it to check if wepon is hars hodo table after refactor
      const totalHododCount = await db.sequelize.query(
        `
        select  Coalesce ( count(ID),0) totalHododCount  from Soldier
         join Unit on Unit.UnitID = Soldier.UnitID 
         where Unit =  N'${ele.Unit}' and 
         RecuEndDate ${recEndDateQuery} and 
         Status = N'بالخدمة'  and 
         SoldierCategory   = N'صف'
         and WeaponID = ${types.harsHododId}

        `,
        {
          type: QueryTypes.SELECT
        }
      );

      const totalSupport = await db.sequelize.query(
        `
        select  Coalesce (Sum(convert( int ,  ImdadTotal)) , 0) totalSupport from SMDriversSuggestion
        join Unit on Unit.UnitID = SMDriversSuggestion.UnitID where Unit = N'${ele.Unit}'
        `,
        {
          type: QueryTypes.SELECT
        }
      );

      // we need officers we will dived hodod form the other weapons totals
      if (ele.officer) {
        ele.officer.totalSMSoliderCount = ele.officer.totalSoliderCount;
        ele.officer.totalHododCount = totalHododCount[0].totalHododCount;

        ele.officer.totalSoliderCount += totalHododCount[0].totalHododCount;
      }

      let totalImdad = calculateTotal(categories, ele, "siasa");
      if (ele.driver) {
        ele.driver.totalSupport = totalSupport[0].totalSupport;
        totalImdad = totalImdad - ele.driver.siasa + ele.driver.totalSupport;
        console.log(totalImdad);
      }

      // ele.totals = {
      //   totalMortab: calculateTotal(categories, ele, "mortab"),
      //   totalSiasa: calculateTotal(categories, ele, "siasa"),
      //   totalImdad: totalImdad,
      //   totalRatab: calculateTotal(categories, ele, "rateb"),
      //   totalSolider: calculateTotal(categories, ele, "totalSoliderCount"),
      //   totalSum: calculateTotal(categories, ele, "total")
      // };
      // const checkInfinty = v => {
      //   return v == Infinity ? 0 : v;
      // };

      // ele.percentages = {
      //   totalOverMortab:
      //     (Math.ceil(
      //       checkInfinty(ele.totals.totalSum / ele.totals.totalMortab) * 100
      //     ) || 0) + "%",
      //   totalOverSiasa:
      //     (Math.ceil(
      //       checkInfinty(ele.totals.totalSum / ele.totals.totalSiasa) * 100
      //     ) || 0) + "%",
      //   totalOverImdad:
      //     (Math.ceil(
      //       checkInfinty(ele.totals.totalSum / ele.totals.totalImdad) * 100
      //     ) || 0) + "%"
      // };

      return ele;
    })
  );

  return result;
};

/***
 * 
 * 
 *   if (params.Type == displayTypes.totalHodod) {
    let ele = {
      Unit: "اجمالي قوات حرس الحدود"
    };

    for (const category of categories) {
      const moratbValue = await db.sequelize.query(
        `
      select Coalesce ( SUM(MortabatDuties.Moratab),0) mortab , Coalesce ( SUM(MortabatDuties.Siasa) ,0) siasa from MortabatDuties
      inner join Weapon on Weapon.WeaponId = MortabatDuties.WeaponId
       where  Category like  N'%${category.text}%' 
       ${
         params.Weapon
           ? `and Weapon.Weapon in (${params.Weapon.map(
               ele => `N'${ele}'`
             ).join(",")})`
           : ``
       }
      `,
        {
          type: QueryTypes.SELECT
        }
      );
      if (!ele[category.mappedValue]) ele[category.mappedValue] = {};

      // TODO: refactor it to check if wepon is not hars hodo from soldier table after refactor
      const totalSMCount = await db.sequelize.query(
        `select  Coalesce ( count(ID),0) totalSoliderCount  from Soldier
      join Unit on Unit.UnitID = Soldier.UnitID
      join Weapon on Weapon.WeaponID = Soldier.WeaponID
      where RecuEndDate ${recEndDateQuery}
      and Status = N'بالخدمة'
      and SoldierCategory  like N'%${category.text}%' 
      and Soldier.WeaponID != ${types.harsHododId}
      `,
        {
          type: QueryTypes.SELECT
        }
      );

      const value = await db.sequelize.query(
        `
      select  Coalesce ( count(ID),0) count  from Rateb
      join Unit on Unit.UnitID = Rateb.UnitID
      join Weapon on Weapon.WeaponID = Rateb.WeaponID
       where RatebCategory like N'%${category.text}%'  
       ${
         params.Weapon
           ? `and Weapon.Weapon in (${params.Weapon.map(
               ele => `N'${ele}'`
             ).join(",")})`
           : ""
       }
      `,
        {
          type: QueryTypes.SELECT
        }
      );

      ele[category.mappedValue] = {
        ...ele[category.mappedValue],
        ...moratbValue[0],
        ...totalSMCount[0],
        rateb: value[0].count
      };
    }

    categories.forEach(category => {
      ele[category.mappedValue]["total"] =
        ele[category.mappedValue].totalSoliderCount +
        ele[category.mappedValue].rateb;
    });
    // TODO: refactor it to check if wepon is hars hodo table after refactor
    const totalHododCount = await db.sequelize.query(
      `
    select  Coalesce ( count(ID),0) totalHododCount  from Soldier
     join Unit on Unit.UnitID = Soldier.UnitID 
     join Weapon on Weapon.WeaponID = Soldier.WeaponID
     where
     RecuEndDate ${recEndDateQuery} and 
     Status = N'بالخدمة'  and 
     SoldierCategory   = N'صف'
     ${
       params.Weapon
         ? `and Weapon.Weapon in (${params.Weapon.map(ele => `N'${ele}'`).join(
             ","
           )})`
         : `and WeaponID = ${types.harsHododId}`
     }

    `,
      {
        type: QueryTypes.SELECT
      }
    );

    const totalSupport = await db.sequelize.query(
      `
    select  Coalesce (Sum(convert( int ,  ImdadTotal)) , 0) totalSupport from SMDriversSuggestion
    join Unit on Unit.UnitID = SMDriversSuggestion.UnitID 
    `,
      {
        type: QueryTypes.SELECT
      }
    );

    if (ele.officer) {
      ele.officer.totalSMSoliderCount = ele.officer.totalSoliderCount;
      ele.officer.totalHododCount = totalHododCount[0].totalHododCount;

      ele.officer.totalSoliderCount += totalHododCount[0].totalHododCount;
    }

    let totalImdad = calculateTotal(categories, ele, "siasa");
    if (ele.driver) {
      ele.driver.totalSupport = totalSupport[0].totalSupport;
      totalImdad = totalImdad - ele.driver.siasa + ele.driver.totalSupport;
      console.log(totalImdad);
    }

    ele.totals = {
      totalMortab: calculateTotal(categories, ele, "mortab"),
      totalSiasa: calculateTotal(categories, ele, "siasa"),
      totalImdad: totalImdad,
      totalRatab: calculateTotal(categories, ele, "rateb"),
      totalSolider: calculateTotal(categories, ele, "totalSoliderCount"),
      totalSum: calculateTotal(categories, ele, "total")
    };
    ele.percentages = {
      totalOverMortab:
        (
          Number((ele.totals.totalSum / ele.totals.totalMortab) * 100) || 0
        ).toFixed(2) + "%",
      totalOverSiasa:
        (
          Number((ele.totals.totalSum / ele.totals.totalSiasa) * 100) || 0
        ).toFixed(2) + "%",
      totalOverImdad:
        (
          Number((ele.totals.totalSum / ele.totals.totalImdad) * 100) || 0
        ).toFixed(2) + "%"
    };

    return [ele];
  }

 */
