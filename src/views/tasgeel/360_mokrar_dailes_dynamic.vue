<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="false"
    />

    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'نتائج اليومية'"
      >
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr>
              <th
                v-for="(item, i) in mainTable.headers.filter(
                  ele => ele.inTable
                )"
                :key="item.parent + i"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.parent }}
              </th>
            </tr>
            <tr>
              <th
                v-for="(item, i) in mainTable.headers.filter(
                  ele => ele.inTable
                )"
                :key="item.text + i"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.text }}
              </th>
            </tr>
          </thead>
        </template>
      </table-bulider>
    </v-card>
  </div>
</template>

<style scoped>
tbody tr td:nth-child(2) {
  width: 295px;
  display: block;
}
</style>

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const lodash = require("lodash");

const displayTypes = types.displayTypes;

const SoldierCategoryMap = types.SoldierCategoryMap;

const basicHeaders = [
  {
    text: "نوع العرض",
    value: "Type",
    searchValue: "Type",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  {
    text: "الوحدة",
    value: "Unit",
    searchValue: "unitIds",
    sortable: true,
    type: "select",
    inSearch: false,
    parent: " ",
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الاتجاه",
    value: "Direction",
    searchValue: "directions",
    sortable: true,
    type: "select",
    parent: " ",

    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "",
    value: "type",
    searchValue: "type",
    parent: " ",
    sortable: true,
    type: "select",
    inTable: true,
    sort: 1
  },
  {
    text: "الفئات",
    value: "SoldierCategories",
    searchValue: "SoldierCategories",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الاسلحة",
    value: "weapons",
    searchValue: "weapons",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "التجميعات القتالية",
    value: "Collection",
    searchValue: "collections",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  },
  {
    text: "تاريخ التسريح",
    value: "RecuEndDate",
    searchValue: "RecuEndDate",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  }
];

export default {
  name: "_360MokrarDailes",
  props: {},
  async mounted() {
    await this.getRecuEndDateOptions();
    await this.init();
  },
  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [...basicHeaders],
      items: [],
      printer: {}
    },

    componentName: "_30MokrarDailes",
    selects: {
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      directions: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      weapons: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      Type: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لتجميعات قتالية",
            value: displayTypes.collections
          },
          {
            text: "لوحدات محددة",
            value: displayTypes.unites
          }
        ]
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        weapons: this.search.weapons,
        Type: newValue
      };
      const unitFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Unit"
        ),
        directionFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Direction"
        );
      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[directionFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;

      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.directions)
        this.mainTable.headers[directionFeildIndex].inSearch = true;
      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
      }
    },
    async "search.collections"(newValue) {
      console.log(newValue);
      console.log(this.search.Collection);
      if (this.search.Type == displayTypes.collections) {
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: { CollectionId: newValue }
        });
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
      }
    }
  },
  methods: {
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where Status like N'%بالخدمة%'  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
    },
    async findItems() {
      if (!this.search.RecuEndDate) {
        return this.showError("يرجى إختيار تاريخ تسريح اولا");
      }
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      console.log(this.search);
      const units = await this.api("sections/tasgeel/reports/getUnits", {
        ...this.search
      });
      let items = [];
      const weaponsCategory = (
        await this.api("global/queryRunners", {
          query: `
          SELECT Weapon , Category , w.WeaponID 
          FROM MortabatDuties md join Weapon w on w.WeaponID = md.WeaponID 
          JOIN Soldier s on s.UnitID = md.UnitID and s.Status  = N'بالخدمة'
          JOIN Rateb r  on r.UnitID = r.UnitID and s.Status  = N'بالخدمة'
          WHERE md.UnitID in (${units.data
            .map(ele => ele.UnitID)
            .join(
              ","
            )}) GROUP by w.Weapon , md.Category , w.WeaponID HAVING COUNT(s.ID) > 0  or COUNT(r.ID) > 0 
            ORDER by Weapon  ASC 
        `
        })
      ).data;

      this.buildHeaders(weaponsCategory);

      try {
        for (const Unit of units.data) {
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`,
              RecuEndDate: {
                $in: this.search.RecuEndDate
              }
            }
          });
          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`
            }
          });
          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              UnitID: Unit.UnitID
            }
          });
          let RatebMortabData = {
            ...Unit,
            type: "مرتب رع"
          };
          let RatebSiasaData = {
            ...Unit,
            type: "سياسة رع"
          };
          let SoliderMortabData = {
            ...Unit,
            type: "مرتب جنود"
          };
          let SoliderSiasaData = {
            ...Unit,
            type: "سياسة جنود"
          };
          let RatebData = {
            ...Unit,
            type: "موجود رع"
          };
          let SoliderData = {
            ...Unit,
            type: "موجود جنود"
          };
          let TotalData = {
            ...Unit,
            type: "جملة الموجودات"
          };
          weaponsCategory.forEach(item => {
            RatebMortabData[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
              mortabs.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.Category?.includes(item.Category) &&
                  el.ServiceType === "راتب عالى"
              ),
              el => el.Moratab
            );
            RatebSiasaData[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
              mortabs.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.Category?.includes(item.Category) &&
                  el.ServiceType === "راتب عالى"
              ),
              el => el.Siasa
            );

            SoliderMortabData[
              `${item.WeaponID}_${item.Category}`
            ] = lodash.sumBy(
              mortabs.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.Category?.includes(item.Category) &&
                  el.ServiceType !== "راتب عالى"
              ),
              el => el.Moratab
            );
            SoliderSiasaData[
              `${item.WeaponID}_${item.Category}`
            ] = lodash.sumBy(
              mortabs.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.Category?.includes(item.Category) &&
                  el.ServiceType !== "راتب عالى"
              ),
              el => el.Siasa
            );
            RatebData[`${item.WeaponID}_${item.Category}`] =
              rateb.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.RatebCategory?.includes(item.Category)
              ).length ?? 0;

            SoliderData[`${item.WeaponID}_${item.Category}`] =
              soliders.data.filter(
                el =>
                  el.WeaponID == item.WeaponID &&
                  el.SoldierCategory?.includes(item.Category)
              ).length ?? 0;

            TotalData[`${item.WeaponID}_${item.Category}`] =
              RatebData[`${item.WeaponID}_${item.Category}`] +
              SoliderData[`${item.WeaponID}_${item.Category}`];
          });

          lodash
            .uniqBy(weaponsCategory, ele => ele.Category)
            .forEach(item => {
              RatebMortabData[`total_${item.Category}`] = lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes(item.Category) &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              );
              RatebSiasaData[`total_${item.Category}`] = lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes(item.Category) &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              );

              SoliderMortabData[`total_${item.Category}`] = lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes(item.Category) &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              );
              SoliderSiasaData[`total_${item.Category}`] = lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes(item.Category) &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              );
              RatebData[`total_${item.Category}`] =
                rateb.data.filter(el =>
                  el.RatebCategory?.includes(item.Category)
                ).length ?? 0;

              SoliderData[`total_${item.Category}`] =
                soliders.data.filter(el =>
                  el.SoldierCategory?.includes(item.Category)
                ).length ?? 0;

              TotalData[`total_${item.Category}`] =
                RatebData[`total_${item.Category}`] +
                SoliderData[`total_${item.Category}`];
            });

          items = [
            ...items,
            ...[
              RatebMortabData,
              RatebSiasaData,
              SoliderMortabData,
              SoliderSiasaData,
              RatebData,
              SoliderData,
              TotalData
            ]
          ];
        }
        console.log(items);

        const TotalRatebMortab = {
          Unit: "اجمالي عام",
          type: "إجمالي مرتب رع"
        };

        weaponsCategory.forEach(item => {
          TotalRatebMortab[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("مرتب رع")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalRatebMortab[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("مرتب رع")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalRatebSiasa = {
          Unit: "اجمالي عام",
          type: "إجمالي سياسة رع"
        };

        weaponsCategory.forEach(item => {
          TotalRatebSiasa[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("سياسة رع")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalRatebSiasa[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("سياسة رع")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalSoliderMortab = {
          Unit: "اجمالي عام",
          type: "إجمالي مرتب جنود"
        };

        weaponsCategory.forEach(item => {
          TotalSoliderMortab[
            `${item.WeaponID}_${item.Category}`
          ] = lodash.sumBy(
            items.filter(ele => ele.type.includes("مرتب جنود")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalSoliderMortab[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("مرتب جنود")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalSoliderSiasa = {
          Unit: "اجمالي عام",
          type: "إجمالي سياسة جنود"
        };

        weaponsCategory.forEach(item => {
          TotalSoliderSiasa[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("سياسة جنود")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalSoliderSiasa[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("سياسة جنود")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalRateb = {
          Unit: "اجمالي عام",
          type: "إجمالي موجود رع"
        };

        weaponsCategory.forEach(item => {
          TotalRateb[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("موجود رع")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalRateb[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("موجود رع")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalSolider = {
          Unit: "اجمالي عام",
          type: "إجمالي موجود جنود"
        };

        weaponsCategory.forEach(item => {
          TotalSolider[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("موجود جنود")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalSolider[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("موجود جنود")),
              ele => ele[`total_${item.Category}`]
            );
          });
        const TotalItem = {
          Unit: "اجمالي عام",
          type: "إجمالي موجودات"
        };

        weaponsCategory.forEach(item => {
          TotalItem[`${item.WeaponID}_${item.Category}`] = lodash.sumBy(
            items.filter(ele => ele.type.includes("جملة الموجودات")),
            ele => ele[`${item.WeaponID}_${item.Category}`]
          );
        });

        lodash
          .uniqBy(weaponsCategory, ele => ele.Category)
          .forEach(item => {
            TotalItem[`total_${item.Category}`] = lodash.sumBy(
              items.filter(ele => ele.type.includes("جملة الموجودات")),
              ele => ele[`total_${item.Category}`]
            );
          });

        items = [
          ...items,
          TotalRatebMortab,
          TotalRatebSiasa,
          TotalSoliderMortab,
          TotalSoliderSiasa,
          TotalRateb,
          TotalSolider,
          TotalItem
        ];
        this.$set(this.mainTable, "items", items);

        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
      }

      this.$set(this, "searchLoading", false);
    },

    buildHeaders(weaponsCategory) {
      let headers = [];
      weaponsCategory.forEach(item => {
        headers.push({
          text: item.Category,
          value: `${item.WeaponID}_${item.Category}`,
          sortable: true,
          parent: item.Weapon,
          type: "text",
          inTable: true,
          sort: 1
        });
      });

      lodash
        .uniqBy(weaponsCategory, ele => ele.Category)
        .forEach(item => {
          headers.push({
            text: `اجمالي ${item.Category}`,
            value: `total_${item.Category}`,
            sortable: true,
            parent: item.Category,
            type: "text",
            inTable: true,
            sort: 1
          });
        });
      this.$set(this.mainTable, "headers", [...basicHeaders, ...headers]);
    }
  }
};
</script>
