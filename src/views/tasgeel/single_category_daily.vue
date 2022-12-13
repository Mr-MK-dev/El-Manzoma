<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
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
        <template v-slot:item.percent.moratb="{ item }">
          <v-chip color="transparent">
            {{ item.percent.moratb  }}
          </v-chip>
        </template>
        <template v-slot:item.percent.siasa="{ item }">
          <v-chip color="transparent">
            {{ item.percent.siasa  }}
          </v-chip>
        </template>
        <template v-slot:item.percent.imdad="{ item }">
          <v-chip color="transparent">
            {{ item.percent.imdad  }}
          </v-chip>
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
    value: "Category",
    searchValue: "Category",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: false,
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
  }
];
export default {
  name: "singleCategoryDaily",
  props: {},
  async mounted() {
    await this.init();
  },
  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "رع",
            value: "moratb.high",
            inTable: true,
            inSearch: false,
            parent: "حرب"
          },
          {
            text: "مجند",
            value: "moratb.gondy",
            inTable: true,
            inSearch: false,
            parent: "حرب"
          },
          {
            text: "اجمالي",
            value: "moratb.total",
            inTable: true,
            inSearch: false,
            parent: "حرب"
          },
          {
            text: "رع",
            value: "siasa.high",
            inTable: true,
            inSearch: false,
            parent: "سلم"
          },
          {
            text: "مجند",
            value: "siasa.gondy",
            inTable: true,
            inSearch: false,
            parent: "سلم"
          },
          {
            text: "اجمالي",
            value: "siasa.total",
            inTable: true,
            inSearch: false,
            parent: "سلم"
          },
          {
            text: "سياسة الامداد",
            value: "imdadSiasa",
            searchValue: "imdadSiasa",
            inTable: true,
            inSearch: false
          },
          {
            text: "رع",
            value: "mawgod.high",
            inTable: true,
            inSearch: false,
            parent: "موجود"
          },
          {
            text: "مجند",
            value: "mawgod.gondy",
            inTable: true,
            inSearch: false,
            parent: "موجود"
          },
          {
            text: "اجمالي",
            value: "mawgod.total",
            inTable: true,
            inSearch: false,
            parent: "موجود"
          },
          {
            text: "نسبة / مرتب",
            value: "percent.moratb",
            inTable: true,
            inSearch: false
          },
          {
            text: "نسبة / سياسة",
            value: "percent.siasa",
            inTable: true,
            inSearch: false
          },
          {
            text: "نسبة / امداد",
            value: "percent.imdad",
            inTable: true,
            inSearch: false
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "singleCategoryDaily",
    selects: {
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
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
        Category: this.search.Category,
        Type: newValue
      };

      const unitFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit"
      );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

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
        console.log(data);
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
        console.log(data.data.map(ele => ele.UnitID));
      }
    },
    async "search.Category"(newValue) {
      const imdadFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "imdadSiasa"
      );
      if (newValue.includes("سا")) {
        this.mainTable.headers[imdadFeildIndex].inTable = true;
      } else {
        this.mainTable.headers[imdadFeildIndex].inTable = false;
      }
    }
  },
  methods: {
    async findItems() {
      if (!this.search.Category) {
        this.showError("من فضلك قم باختيار فئة اولا");
        return;
      }
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
          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`,
              RatebCategory: this.search.Category
            }
          });
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`,
              SoldierCategory: this.search.Category
            }
          });
          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              UnitID: Unit.UnitID,
              Category: this.search.Category
            }
          });
          let imdad = {};

          if (this.search.Category.includes("سا")) {
            imdad = await this.api("global/get_one", {
              table: "SMDriversSuggestion",
              where: {
                UnitID: Unit.UnitID
              }
            });

            console.log("Imdad", imdad);
          }
          console.log("imdad", imdad.data != null ? imdad.data.ImdadTotal : 0);
          items.push({
            ...Unit,
            moratb: {
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("مجند") &&
                    el.Category === this.search.Category
                ),
                el => el.Moratab
              ),
              high: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("راتب") &&
                    el.Category === this.search.Category
                ),
                el => el.Moratab
              ),
              total:
                lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("راتب") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Moratab
                ) +
                lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("مجند") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Moratab
                )
            },
            siasa: {
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("مجند") &&
                    el.Category === this.search.Category
                ),
                el => el.Siasa
              ),
              high: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.ServiceType.includes("راتب") &&
                    el.Category === this.search.Category
                ),
                el => el.Siasa
              ),
              total:
                lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("راتب") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Siasa
                ) +
                lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("مجند") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Siasa
                )
            },
            mawgod: {
              gondy: soliders.data.filter(
                el => el.SoldierCategory == this.search.Category
              ).length,
              high: rateb.data.filter(
                el => el.RatebCategory === this.search.Category
              ).length,
              total:
                soliders.data.filter(
                  el => el.SoldierCategory == this.search.Category
                ).length +
                rateb.data.filter(
                  el => el.RatebCategory === this.search.Category
                ).length
            },
            imdadSiasa:
              this.search.Category.includes("سا") && imdad.data != null
                ? parseInt(imdad.data.ImdadTotal)
                : 0,
            percent: {
              moratb:
                Math.round((soliders.data.filter(
                  el => el.SoldierCategory == this.search.Category
                ).length +
                  rateb.data.filter(
                    el => el.RatebCategory === this.search.Category
                  ).length) /
                (lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("راتب") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Moratab
                ) +
                  lodash.sumBy(
                    mortabs.data.filter(
                      el =>
                        el.ServiceType.includes("مجند") &&
                        el.Category === this.search.Category
                    ),
                    el => el.Moratab
                  )) *100).toString() + "%",
              siasa:
                Math.round((soliders.data.filter(
                  el => el.SoldierCategory == this.search.Category
                ).length +
                  rateb.data.filter(
                    el => el.RatebCategory === this.search.Category
                  ).length) /
                (lodash.sumBy(
                  mortabs.data.filter(
                    el =>
                      el.ServiceType.includes("راتب") &&
                      el.Category === this.search.Category
                  ),
                  el => el.Siasa
                ) +
                  lodash.sumBy(
                    mortabs.data.filter(
                      el =>
                        el.ServiceType.includes("مجند") &&
                        el.Category === this.search.Category
                    ),
                    el => el.Siasa
                  )) *100).toString() +"%",
              imdad:
                this.search.Category.includes("سا") && imdad.data != null
                  ? Math.round((soliders.data.filter(
                      el => el.SoldierCategory == this.search.Category
                    ).length +
                      rateb.data.filter(
                        el => el.RatebCategory === this.search.Category
                      ).length) /
                    parseInt(imdad.data.ImdadTotal)*100).toString() +"%"
                  : 0
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
            gondy: lodash.sumBy(items, el => el.moratb.gondy),
            high: lodash.sumBy(items, el => el.moratb.high),
            total: lodash.sumBy(items, el => el.moratb.total)
          },
          siasa: {
            gondy: lodash.sumBy(items, el => el.siasa.gondy),
            high: lodash.sumBy(items, el => el.siasa.high),
            total: lodash.sumBy(items, el => el.siasa.total)
          },
          mawgod: {
            gondy: lodash.sumBy(items, el => el.mawgod.gondy),
            high: lodash.sumBy(items, el => el.mawgod.high),
            total: lodash.sumBy(items, el => el.mawgod.total)
          },
          imdadSiasa: lodash.sumBy(items, el => el.imdadSiasa),
          percent: {
            moratb:
              lodash.sumBy(items, el => el.mawgod.total) /
              lodash.sumBy(items, el => el.moratb.total),
            siasa:
              lodash.sumBy(items, el => el.mawgod.total) /
              lodash.sumBy(items, el => el.siasa.total),
            imdad: this.search.Category.includes("سا")
              ? lodash.sumBy(items, el => el.mawgod.total) /
                lodash.sumBy(items, el => el.imdadSiasa)
              : 0
          }
        });

        console.log("items", items);

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          hasParent :true,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });

        console.log("here I log", items);
        this.$set(this, "searchLoading", false);
      } catch (e) {
        this.handleError(e);
        this.$set(this, "searchLoading", false);
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
