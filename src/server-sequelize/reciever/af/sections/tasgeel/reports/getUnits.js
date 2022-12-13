const { QueryTypes } = require("sequelize");
const types = require("./types").default;

const displayTypes = types.displayTypes;

module.exports = async (db, params) => {
  // get units
  let direct = "",
    units = [];

  if (params.Type == displayTypes.headquerts) direct = "قيادة";
  if (params.Type == displayTypes.intelligence) direct = "رئاسة";

  if (
    [displayTypes.headquerts, displayTypes.intelligence].indexOf(params.Type) >
    -1
  ) {
    units = await db.sequelize.query(
      genrateUnitQuery(`Sectors.Name like N'%${direct}%' and Unit != N'بدون'`),

      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.unites == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`UnitID in (${params.unitIds.join(",")})`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.headquertsWithUnits == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(
        `Sectors.Name in (${(params.directions || params.directions)
          .map(ele => `N'${ele}'`)
          .join(",")}) and Unit != N'بدون'`
      ),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.directions == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(
        `DirectionforFeaat in (${params.directions
          .map(ele => `N'${ele}'`)
          .join(",")})`
      ),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.collections == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`UnitID in (${params.unitIds.join(",")})`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.supplies == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`UnitID in (${params.unitIds.join(",")})`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.layer1 == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`SupplyLayer like N'%1%'`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.layer2 == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`SupplyLayer like N'%2%'`),
      {
        type: QueryTypes.SELECT
      }
    );
  } else if (displayTypes.all == params.Type) {
    units = await db.sequelize.query(
      genrateUnitQuery(`SupplyLayer  is not null`),
      {
        type: QueryTypes.SELECT
      }
    );
  }

  return units;
};

// const genrateUnitQuery = whereCondation =>
//   `Select distinct  Unit , Sectors.Name as DirectionforFeaat , OrderingFeaat , UnitID  from Unit left Join Sectors on Sectors.ID_KEY = Unit.SectorID where ${whereCondation} and statue = N'بالخدمة'  order by OrderingFeaat `;

const genrateUnitQuery = whereCondation =>
  `Select distinct  Unit , Sectors.Name as DirectionforFeaat , OrderingFeaat , UnitID ,Directionforunit  from Unit left Join Sectors on Sectors.ID_KEY = Unit.SectorID where ${whereCondation} and statue = N'بالخدمة'  order by OrderingFeaat `;
