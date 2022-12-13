<template>
  <div class="Categories_Dailes">
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الفئات"
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
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.parent + item.text.length"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.parent }}
              </th>
            </tr>
            <tr>
              <th
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.text + item.text.length * 3"
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

<style></style>

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const lodash = require("lodash");
const displayTypes = types.displayTypes;

const SoldierCategoryMap = types.SoldierCategoryMap;

const displayedCoulmns = [
  "المرتب",
  "السياسة",
  "سياسة الامداد",
  "اجمالي حدود",
  "اجمالي ادارات",
  "مجند",
  "راتب عالي",
  "اجمالي المرتب",
  "اجمالي السياسة",
  "اجمالي  سياسة الامداد",
  "اجمالي الراتب العالي",
  "اجمالي المجندين",
  "اجمالي الجملة",
  "نسبة / المرتب",
  "نسبة / السياسة",
  "نسبة / الامداد"
];

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
    text: "الاتجاه",
    value: "DirectionforFeaat",
    sortable: true,
    inTable: true,
    multiple: true,
    sort: 1
  },

  {
    text: "الاتجاه",
    value: "Direction",
    searchValue: "directions",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الوحدة",
    value: "Unit",
    searchValue: "unitIds",
    sortable: true,
    type: "select",
    inSearch: false,
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
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "النسب المعروضة",
    value: "displayedCoulmns",
    searchValue: "displayedCoulmns",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: true,
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
  },
  {
    text: "السلاح",
    value: "Weapon",
    searchValue: "Weapon",
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
  name: "Categories_Dailes",
  props: {},
  async mounted() {
    await this.init();
    this.getRecuEndDateOptions();
  },
  data: () => ({
    allUnites: [],
    search: {
      SoldierCategories: constants.dailesSoliderCategories,
      displayedCoulmns
    },
    searchLoading: false,
    mainTable: {
      headers: [...basicHeaders],
      items: [],
      printer: {}
    },
    componentName: "CategoriesDailes",
    selects: {
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
            text: "لقيادات القطاعات",
            value: displayTypes.headquerts
          },
          {
            text: "  لقيادات القطاعات و الواحدات",
            value: displayTypes.headquertsWithUnits
          },
          {
            text: "لمكاتب مج مخ وأمن ح ح",
            value: displayTypes.intelligence
          },
          {
            text: "لوحدات محددة",
            value: displayTypes.unites
          },
          {
            text: "لتمركزات محددة",
            value: displayTypes.directions
          },
          {
            value: displayTypes.directions
          },
          {
            text: "كل الوحدات",
            value: displayTypes.all
          }
        ]
      },
      displayedCoulmns: {
        text: "text",
        value: "value",
        data: displayedCoulmns.map(text => ({
          text
        }))
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      Weapon: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      // reset values
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        Type: newValue,
        displayedCoulmns: this.search.displayedCoulmns,
        RecuEndDate: this.search.RecuEndDate
      };
      this.selects.unitIds.data = this.allUnites;

      const unitFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Unit"
        ),
        directionFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Direction"
        );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[directionFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.directions)
        this.mainTable.headers[directionFeildIndex].inSearch = true;

      if (newValue == displayTypes.headquertsWithUnits) {
        this.mainTable.headers[directionFeildIndex].inSearch = true;
      }
    },
    "search.directions"(newValue) {
      if (this.search.Type == displayTypes.headquertsWithUnits) {
        this.selects.unitIds.data = this.allUnites.filter(
          ele => newValue.indexOf(ele.Directionforunit) > -1
        );
        this.search.unitIds = this.selects.unitIds.data.map(ele => ele.UnitID);
      }
    }
  },
  methods: {
    async findItems(filters) {
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const result = await this.api(
          "sections/tasgeel/reports/categories_dailes",
          {
            ...this.search
          }
        );
        this.buildHeaders();

        let mappedData = result.data;

        if (this.search.Type == displayTypes.headquertsWithUnits) {
          const groupedData = lodash.groupBy(
            mappedData,
            ele => ele.DirectionforFeaat
          );
          mappedData = [];
          Object.keys(groupedData).forEach(key => {
            mappedData = [
              ...mappedData,
              ...groupedData[key],
              this.getTotal(`اجمالي ${key}`, groupedData[key])
            ];
          });
        }

        mappedData = [...mappedData, this.getTotal("اجمالي", mappedData)];

        this.$set(this.mainTable, "items", mappedData);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }

      this.$set(this, "searchLoading", false);
    },
    getTotal(title, array) {
      const totalMortab = array.reduce(
          (prev, ele) => prev + ele.totals.totalMortab,
          0
        ),
        totalSiasa = array.reduce(
          (prev, ele) => prev + ele.totals.totalSiasa,
          0
        ),
        totalImdad = array.reduce(
          (prev, ele) => prev + ele.totals.totalImdad,
          0
        ),
        totalRatab = array.reduce(
          (prev, ele) => prev + ele.totals.totalRatab,
          0
        ),
        totalSolider = array.reduce(
          (prev, ele) => prev + ele.totals.totalSolider,
          0
        ),
        totalSum = array.reduce((prev, ele) => prev + ele.totals.totalSum, 0);
      return {
        Unit: title,
        DirectionforFeaat: "",
        OrderingFeaat: 0,
        officer: {
          mortab: array.reduce((prev, ele) => prev + ele.officer.mortab, 0),
          siasa: array.reduce((prev, ele) => prev + ele.officer.siasa, 0),
          totalSoliderCount: array.reduce(
            (prev, ele) => prev + ele.officer.totalSoliderCount,
            0
          ),
          rateb: array.reduce((prev, ele) => prev + ele.officer.rateb, 0),
          total: array.reduce((prev, ele) => prev + ele.officer.total, 0),
          totalSMSoliderCount: array.reduce(
            (prev, ele) => prev + ele.officer.totalSMSoliderCount,
            0
          ),
          totalHododCount: array.reduce(
            (prev, ele) => prev + ele.officer.totalHododCount,
            0
          )
        },
        writer: {
          mortab: array.reduce((prev, ele) => prev + ele.writer.mortab, 0),
          siasa: array.reduce((prev, ele) => prev + ele.writer.siasa, 0),
          totalSoliderCount: array.reduce(
            (prev, ele) => prev + ele.writer.totalSoliderCount,
            0
          ),
          rateb: array.reduce((prev, ele) => prev + ele.writer.rateb, 0),
          total: array.reduce((prev, ele) => prev + ele.writer.total, 0)
        },
        professional: {
          mortab: array.reduce(
            (prev, ele) => prev + ele.professional.mortab,
            0
          ),
          siasa: array.reduce((prev, ele) => prev + ele.professional.siasa, 0),
          totalSoliderCount: array.reduce(
            (prev, ele) => prev + ele.professional.totalSoliderCount,
            0
          ),
          rateb: array.reduce((prev, ele) => prev + ele.professional.rateb, 0),
          total: array.reduce((prev, ele) => prev + ele.professional.total, 0)
        },
        literal: {
          mortab: array.reduce((prev, ele) => prev + ele.literal.mortab, 0),
          siasa: array.reduce((prev, ele) => prev + ele.literal.siasa, 0),
          totalSoliderCount: array.reduce(
            (prev, ele) => prev + ele.literal.totalSoliderCount,
            0
          ),
          rateb: array.reduce((prev, ele) => prev + ele.literal.rateb, 0),
          total: array.reduce((prev, ele) => prev + ele.literal.total, 0)
        },
        driver: {
          mortab: array.reduce((prev, ele) => prev + ele.driver.mortab, 0),
          siasa: array.reduce((prev, ele) => prev + ele.driver.siasa, 0),
          totalSoliderCount: array.reduce(
            (prev, ele) => prev + ele.driver.totalSoliderCount,
            0
          ),
          rateb: array.reduce((prev, ele) => prev + ele.driver.rateb, 0),
          total: array.reduce((prev, ele) => prev + ele.driver.total, 0),
          totalSupport: array.reduce(
            (prev, ele) => prev + ele.driver.totalSupport,
            0
          )
        },
        totals: {
          totalSiasa,
          totalImdad,
          totalRatab,
          totalSolider,
          totalSum,
          totalMortab
        },
        percentages: {
          totalOverMortab:
            (Number((totalSum / totalMortab) * 100) || 0).toFixed(2) + "%",
          totalOverSiasa:
            (Number((totalSum / totalSiasa) * 100) || 0).toFixed(2) + "%",
          totalOverImdad:
            (Number((totalSum / totalImdad) * 100) || 0).toFixed(2) + "%"
        }
      };
    },
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where RecuEndDate > getdate()  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
      this.allUnites = [...this.selects.unitIds.data];
    },
    buildHeaders() {
      const categories = SoldierCategoryMap.filter(
        ele => this.search.SoldierCategories.indexOf(ele.text) > -1
      );
      let headers = [];
      categories.forEach(category => {
        headers = [
          ...headers,
          ...[
            this.search.displayedCoulmns.indexOf("المرتب") > -1
              ? {
                  text: `المرتب`,
                  value: `${category.mappedValue}.mortab`,
                  parent: category.text
                }
              : null,
            this.search.displayedCoulmns.indexOf("السياسة") > -1
              ? {
                  text: `السياسة`,
                  value: `${category.mappedValue}.siasa`,
                  parent: category.text
                }
              : null,
            category.mappedValue == "driver" &&
            this.search.displayedCoulmns.indexOf("سياسة الامداد") > -1
              ? {
                  text: `سياسة الامداد`,
                  value: `${category.mappedValue}.totalSupport`,
                  parent: category.text
                }
              : null,
            category.mappedValue == "officer" &&
            this.search.displayedCoulmns.indexOf("اجمالي حدود") > -1
              ? {
                  text: `اجمالي حدود`,
                  value: `${category.mappedValue}.totalHododCount`,
                  parent: category.text
                }
              : null,
            category.mappedValue == "officer" &&
            this.search.displayedCoulmns.indexOf("اجمالي ادارات") > -1
              ? {
                  text: `اجمالي ادارات`,
                  value: `${category.mappedValue}.totalSMSoliderCount`,
                  parent: category.text
                }
              : null,
            //
            this.search.displayedCoulmns.indexOf("مجند") > -1
              ? {
                  text: `مجند`,
                  value: `${category.mappedValue}.totalSoliderCount`,
                  parent: category.text
                }
              : null,
            this.search.displayedCoulmns.indexOf("راتب عالي") > -1
              ? {
                  text: `راتب عالي`,
                  value: `${category.mappedValue}.rateb`,
                  parent: category.text
                }
              : null
          ]
        ]
          .filter(ele => ele)
          .map(ele => ({
            text: ele.text,
            value: ele.value,
            sortable: true,
            type: "select",
            parent: ele.parent,
            inTable: true,
            sort: 1
          }));
      });
      this.$set(this.mainTable, "headers", [
        ...basicHeaders,
        ...headers,
        ...[
          {
            text: "المرتب",
            value: "totals.totalMortab",
            parent: "اجمالي"
          },
          {
            text: "اجمالي السياسة",
            value: "totals.totalSiasa",
            parent: "اجمالي"
          },
          {
            text: "اجمالي  سياسة الامداد",
            value: "totals.totalImdad",
            parent: "اجمالي"
          },
          {
            text: "اجمالي الراتب العالي",
            value: "totals.totalRatab",
            parent: "اجمالي"
          },
          {
            text: "اجمالي المجندين",
            value: "totals.totalSolider",
            parent: "اجمالي"
          },
          {
            text: "اجمالي الجملة",
            value: "totals.totalSum",
            parent: "اجمالي"
          },
          {
            text: "نسبة / المرتب",
            value: "percentages.totalOverMortab",
            parent: ""
          },
          {
            text: "نسبة / السياسة",
            value: "percentages.totalOverSiasa",
            parent: ""
          },
          {
            text: "نسبة / الامداد",
            value: "percentages.totalOverImdad",
            parent: ""
          }
        ]
          .filter(ele => this.search.displayedCoulmns.indexOf(ele.text) > -1)
          .map(ele => ({
            text: ele.text,
            value: ele.value,
            sortable: true,
            type: "select",
            parent: ele.parent,
            inTable: true,
            sort: 1
          }))
      ]);
    }
  }
};
</script>
