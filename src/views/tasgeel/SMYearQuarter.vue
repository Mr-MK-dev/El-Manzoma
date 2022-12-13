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
        :wordFile="'/tasgeel/YearQuarterDaily'"
        :isExcel="true"
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

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

const lodash = require("lodash");
const displayTypes = types.displayTypes;

const basicHeaders = [
  {
    text: "نوع العرض",
    value: "Type",
    searchValue: "Type",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  {
    text: "الاسلحة",
    value: "weapon",
    parent: " ",
    searchValue: "weapon",
    sortable: true,
    type: "select",
    inSearch: true,
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
    text: "الفئات",
    value: "SoldierCategories",
    searchValue: "SoldierCategories",
    sortable: true,
    type: "select",
    inSearch: false,
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الشريحة",
    value: "SupplyLayer",
    searchValue: "SupplyLayer",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: true,
    multiple: false,
    sort: 1
  },
  {
    text: " الواجب المدرب عليه",
    value: "job",
    searchValue: "job",
    parent: " ",
    type: "select",
    inSearch: true
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
    parent: " ",
    searchValue: "RecuEndDate",
    type: "select",
    inSearch: true,
    sort: 1
  }
];
export default {
  name: "SMYearQuarter",
  props: {},
  async mounted() {
    await this.init();
    this.selects.RecuEndDate.data =await this.fetchAvailableServiceEndDates();
  },
  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "مرتب الحرب",
            value: "moratb.gondy",
            inTable: true,
            inSearch: false
          },
          {
            text: "مرتب السلم",
            value: "siasa.gondy",
            inTable: true,
            inSearch: false
          },
          {
            text: "موجود",
            value: "mawgod.gondy",
            inTable: true,
            inSearch: false
          },
          {
            text: "المسرحين",
            value: "mosr7.gondy",
            sortable: true,
            inTable: true,
            inSearch: false,
            sort: 1
          },
          {
            text: "الموجود بعد التسريح",
            value: "mawgodafter.gondy",
            inTable: true,
            inSearch: false
          },
          {
            text: "مطلوب للاستكمال",
            value: "matlob.gondy",
            inTable: true,
            inSearch: false
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "_30MokrarDailes",
    selects: {
      directions: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      weapon: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
      },
      job: {
        table: "Duty",
        value: "Duty",
        text: "Duty"
      },

      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي امداد 1/1 - 7/1 تسريح 4/1 - 10/1",
            value: "1"
          },
          {
            text: "الشريحة الثانية امداد 4/1 - 10/1 تسريح 1/1 - 7/1",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          }
        ]
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
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
          },
          {
            text: "لشريحة محددة",
            value: displayTypes.supplies
          }
        ]
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        weapon: this.search.weapon,
        RecuEndDate: this.search.RecuEndDate,
        Type: newValue
      };

      const unitFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit"
      );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      const suppliesFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "SupplyLayer"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      this.mainTable.headers[suppliesFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
      }
      if (newValue == displayTypes.supplies) {
        this.mainTable.headers[suppliesFeildIndex].inSearch = true;
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
        console.log(data);
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
        console.log(data.data.map(ele => ele.UnitID));
      }
    },
    async "search.SupplyLayer"(newValue) {
      console.log(newValue);
      console.log(this.search.SupplyLayer);

      if (this.search.Type == displayTypes.supplies) {
        let data = await this.api("global/get_all", {
          table: "Unit",
          where: {
            SupplyLayer: {
              $like: `%${newValue}%`
            }
          }
        });
        console.log(data);
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
        console.log(data.data.map(ele => ele.UnitID));
      }
    }
  },
  methods: {
    async findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      console.log(this.search);
      const units = await this.api("sections/tasgeel/reports/getUnits", {
        ...this.search
      });
      console.log("i'm findig");

      console.log(units);
      let items = [];
      try {
        for (const Unit of units.data) {
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            include: [{ model: "Weapon" }],
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`,
              SoldierCategory: { $in: this.search.SoldierCategories }
            }
          });

          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            include: [{ model: "Weapon" }],
            where: {
              UnitID: Unit.UnitID,
              Category: { $in: this.search.SoldierCategories }
            }
          });
          // const [ratebObj, soliderObj, totalObj] = this.buildUnitItem(
          //     unit,
          //     mortabs,
          //     rateb,
          //     soliders
          // );
          // items = [...items, ...[ratebObj, soliderObj, totalObj]];

          // let mortab = {
          //
          //
          // };
          // let actual = {
          //
          // };
          let dateBeforeMonth = new Date(this.search.RecuEndDate);
          let dateAftertwoMonth = new Date(this.search.RecuEndDate);
          dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);
          dateAftertwoMonth.setMonth(dateAftertwoMonth.getMonth() + 2);
          console.log("Date before 1 month", this.formatDate(dateBeforeMonth));
          console.log("Date after 1 month", this.formatDate(dateAftertwoMonth));
          items.push({
            ...Unit,
            moratb: {
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("مجند") &&
                    el.Weapon.Weapon == this.search.weapon
                ),
                el => el.Moratab
              )
            },
            siasa: {
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("مجند") &&
                    el.Weapon.Weapon == this.search.weapon
                ),
                el => el.Siasa
              )
            },
            mawgod: {
              gondy: soliders.data.filter(
                el =>
                  el.Weapon.Weapon == this.search.weapon &&
                  el.RecuEndDate > this.formatDate(dateBeforeMonth)
              ).length
            },
            mosr7: {
              gondy: soliders.data.filter(
                el =>
                  el.Weapon.Weapon == this.search.weapon &&
                  (el.RecuEndDate == this.search.RecuEndDate ||
                    el.RecuEndDate == this.formatDate(dateAftertwoMonth))
              ).length
            },
            mawgodafter: {
              gondy:
                soliders.data.filter(
                  el =>
                    el.Weapon.Weapon == this.search.weapon &&
                    el.RecuEndDate > this.formatDate(dateBeforeMonth)
                ).length -
                soliders.data.filter(
                  el =>
                    el.Weapon.Weapon == this.search.weapon &&
                    (el.RecuEndDate == this.search.RecuEndDate ||
                      el.RecuEndDate == this.formatDate(dateAftertwoMonth))
                ).length
            },
            matlob: {
              gondy:
                Math.max(
                  lodash.sumBy(
                    mortabs.data.filter(
                      el =>
                        el.ServiceType.includes("مجند") &&
                        el.Weapon.Weapon == this.search.weapon
                    ),
                    el => el.Moratab
                  ),
                  lodash.sumBy(
                    mortabs.data.filter(
                      el =>
                        el.ServiceType.includes("مجند") &&
                        el.Weapon.Weapon == this.search.weapon
                    ),
                    el => el.Siasa
                  )
                ) -
                (soliders.data.filter(
                  el =>
                    el.Weapon.Weapon == this.search.weapon &&
                    el.RecuEndDate > this.formatDate(dateBeforeMonth)
                ).length -
                  soliders.data.filter(
                    el =>
                      el.Weapon.Weapon == this.search.weapon &&
                      (el.RecuEndDate == this.search.RecuEndDate ||
                        el.RecuEndDate == this.formatDate(dateAftertwoMonth))
                  ).length)
            }
          });

          // console.log('mortab', mortab);
          // console.log('actual', actual);
          // console.log('finalItem', finalItem);
          // items.push(finalItem);
        }
        items.push({
          ...{
            Unit: "الاجمالي"
          },
          moratb: {
            gondy: lodash.sumBy(items, el => el.moratb.gondy)
          },
          siasa: {
            gondy: lodash.sumBy(items, el => el.siasa.gondy)
          },
          mawgod: {
            gondy: lodash.sumBy(items, el => el.mawgod.gondy)
          },
          mosr7: {
            gondy: lodash.sumBy(items, el => el.mosr7.gondy)
          },
          mawgodafter: {
            gondy: lodash.sumBy(items, el => el.mawgodafter.gondy)
          },
          matlob: {
            gondy: lodash.sumBy(items, el => el.matlob.gondy)
          }
        });

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });

        console.log("here I log", items);
        this.$set(this, "searchLoading", false);
      } catch (e) {
        this.handleError(e);
      }
    }
    // async getRecuEndDateOptions() {
    //   const result = await this.api("global/queryRunners", {
    //     query: `   select count (ID) count ,  RecuEndDate  from Soldier GROUP  By RecuEndDate`
    //   });
    //   this.selects.RecuEndDate.data = result.data.map(ele => ({
    //     value: `${ele.RecuEndDate}`,
    //     text: ele.RecuEndDate
    //   }));
    // }
  }
};
</script>
