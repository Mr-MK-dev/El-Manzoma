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
        :loading="searchLoading"
        :wordFile="'/tasgeel/categories_report'"
        :isExcel="true"
        :title="'نتائج اليومية عددية للفئات'"
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
  // {
  //   text: "الفئات",
  //   value: "SoldierCategories",
  //   searchValue: "SoldierCategories",
  //   sortable: true,
  //   type: "select",
  //   inSearch: true,
  //   inTable: false,
  //   inModel: false,
  //   multiple: true,
  //   sort: 1
  // },
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
  name: "Categories_Dailes",
  props: {},
  async mounted() {
    await this.init();
    await this.getRecuEndDateOptions();
  },
  data: () => ({
    search: {
      SoldierCategories: constants.dailesSoliderCategories,
      displayedCoulmns
    },
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "البيان",
            value: "type",
            searchValue: "type",
            sortable: true,
            inSearch: false,
            inTable: true,
            inModel: false,
            multiple: true,
            sort: 1
          },
          {
            text: "مرتب  حدود",
            value: "officer_mortab_hodod",
            sortable: true,
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "مرتب  ادارات",
            value: "officer_mortab_sm",
            sortable: true,
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "مرتب  اجمالي",
            value: "officer_mortab_total",
            sortable: true,
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة حدود",
            value: "officer_siasa_hodod",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة ادارات",
            value: "officer_siasa_sm",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة اجمالي",
            value: "officer_siasa_total",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود حدود",
            value: "officer_total_hodod",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود ادارات",
            value: "officer_total_sm",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود اجمالي",
            value: "officer_total",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },

          ////
          {
            text: "مرتب  كاتب عسكري",
            value: "writer_mortab_solider",
            sortable: true,
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "مرتب  كاتب مالي",
            value: "writer_mortab_money",
            sortable: true,
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "مرتب  اجمالي",
            value: "writer_mortab_total",
            sortable: true,
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة كاتب عسكري",
            value: "writer_siasa_solider",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة كاتب مالي",
            value: "writer_siasa_money",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة جملة ",
            value: "writer_siasa_total",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود كاتب مالي",
            value: "writer_money_total",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود كاتب عسكري",
            value: "writer_solider_total",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود جملة",
            value: "writer_total",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          ///

          {
            text: "المرتب",
            value: "driver_mortab",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },
          {
            text: "السياسة",
            value: "driver_siasa",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },

          {
            text: "سياسة الامدارد",
            value: "driver_imdad_saisa",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },

          {
            text: "موجود درجة اولي",
            value: "driver_total_degree_one",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود درجة تاني",
            value: "driver_total_degree_two",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },
          {
            text: "موجود اجمالي",
            value: "driver_total",
            sortable: true,
            type: "select",
            parent: "سائق",
            inTable: true,
            sort: 1
          },
          {
            text: "المرتب",
            value: "professional_mortab",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "السياسة",
            value: "professional_siasa",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "اجمالي",
            value: "professional_total",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },

          {
            text: "المرتب",
            value: "literal_mortab",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "السياسة",
            value: "literal_siasa",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "اجمالي",
            value: "literal_total",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "المرتب",
            value: "totals_Mortab",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: "السياسة",
            value: "totals_siasa",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: "سياسة الامداد",
            value: "totals_totalImdad",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: "اجمالي الجملة",
            value: "totals_totalSum",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: "نسبة / المرتب",
            value: "percentages_totalOverMortab",
            sortable: true,
            type: "select",
            parent: "نسبة الاستكمال",
            inTable: true,
            sort: 1
          },
          {
            text: "نسبة / السياسة",
            value: "percentages_totalOverSiasa",
            sortable: true,
            type: "select",
            parent: "نسبة الاستكمال",
            inTable: true,
            sort: 1
          },
          {
            text: "نسبة / الامداد",
            value: "percentages_totalOverImdad",
            sortable: true,
            type: "select",
            parent: "نسبة الاستكمال",
            inTable: true,
            sort: 1
          }
        ]
      ],
      items: [],
      printer: {}
    },
    componentName: "CategoriesDailes",
    selects: {
      directions: {
        text: "Name",
        value: "Name",
        table: "Sectors"
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
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
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
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
    }
  },
  methods: {
    async findItems(filters) {
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const unites = await this.api("sections/tasgeel/reports/getUnits", {
          ...this.search
        });

        let items = [];
        for (const unit of unites.data) {
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: this.cleanObject({
              UnitID: unit.UnitID,
              Status: `بالخدمة`,
              RecuEndDate:
                this.search.RecuEndDate && this.search.RecuEndDate.length
                  ? {
                      $in: this.search.RecuEndDate
                    }
                  : null
            })
          });

          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: unit.UnitID,
              Status: `بالخدمة`
            }
          });

          const SMDriversSuggestion = await this.api("global/get_all", {
            table: "SMDriversSuggestion",
            where: {
              UnitID: unit.UnitID
            }
          });

          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              UnitID: unit.UnitID
            }
          });
          const [ratebObj, soliderObj, totalObj] = this.buildUnitItem(
            unit,
            mortabs,
            rateb,
            soliders,
            SMDriversSuggestion
          );
          items = [...items, ...[ratebObj, soliderObj, totalObj]];
        }

        const total = this.getTotal("اجمالي الواحدات", items);
        const groupedData = lodash.groupBy(
            items,
            ele => ele.DirectionforFeaat
        );
        items = [];
        Object.keys(groupedData).forEach(key => {
          items = [
            ...items,
            ...groupedData[key],
            ...this.getTotal(`اجمالي ${key}`, groupedData[key])
          ];
        });


        items = [...items, ...total];

        this.$set(this.mainTable, "items", items);

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
    buildUnitItem(unit, mortabs, rateb, soliders, SMDriversSuggestion) {
      const calcWithFilter = (array, filterFun, calcValue) =>
        array.data
          .filter(ele => filterFun(ele))
          .reduce(
            (prev, ele) => prev + (calcValue ? parseInt(ele[calcValue]) : 1),
            0
          );

      let SoldierCategoryMap = {
        officer: "صف",
        writerSolider: "كاتب عسكرى",
        writerMoney: "كاتب مالى",
        writer: "كاتب",
        professional: "مهنى",
        literal: "حرفى",
        driver: "سائق عجل"
      };
      const ratebObj = {
        ...unit,
        type: "راتب عالي",
        officer_mortab_hodod: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى" &&
            ele.WeaponID == 52,
          "Moratab"
        ),
        officer_mortab_sm: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى" &&
            ele.WeaponID != 52,
          "Moratab"
        ),
        officer_mortab_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        ///////
        officer_siasa_hodod: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى" &&
            ele.WeaponID == 52,
          "Siasa"
        ),
        officer_siasa_sm: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى" &&
            ele.WeaponID != 52,

          "Siasa"
        ),
        officer_siasa_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        //////
        officer_total_hodod: calcWithFilter(
          rateb,
          ele =>
            ele.RatebCategory.includes(SoldierCategoryMap.officer) &&
            ele.WeaponID == 52
        ),
        officer_total_sm: calcWithFilter(
          rateb,
          ele =>
            ele.RatebCategory?.includes(SoldierCategoryMap.officer) &&
            ele.WeaponID != 52
        ),
        officer_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.officer)
        ),
        ///
        writer_mortab_solider: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerSolider) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        writer_mortab_money: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerMoney) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        writer_mortab_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writer) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        ///
        writer_siasa_solider: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerSolider) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        writer_siasa_money: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerMoney) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        writer_siasa_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writer) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        ///
        writer_money_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.writerMoney)
        ),
        writer_solider_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.writerSolider)
        ),
        writer_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.writer)
        ),
        ///
        driver_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.driver) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        driver_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category.includes(SoldierCategoryMap.driver) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        driver_imdad_saisa: calcWithFilter(
          SMDriversSuggestion,
          ele => ele,
          "ImdadTotal"
        ),
        ///
        driver_total_degree_one: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.driver)
        ),
        driver_total_degree_two: 0,
        driver_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.driver)
        ),
        ////
        professional_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.professional) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        professional_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.professional) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        professional_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.professional)
        ),
        ///
        literal_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category.includes(SoldierCategoryMap.literal) &&
            ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        literal_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.literal) &&
            ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        literal_total: calcWithFilter(rateb, ele =>
          ele.RatebCategory?.includes(SoldierCategoryMap.literal)
        ),
        ///
        totals_Mortab: calcWithFilter(
          mortabs,
          ele => ele.ServiceType == "راتب عالى",
          "Moratab"
        ),
        totals_siasa: calcWithFilter(
          mortabs,
          ele => ele.ServiceType == "راتب عالى",
          "Siasa"
        ),
        totals_totalSum: calcWithFilter(rateb, ele => ele)

        ///
      };

      console.log(soliders);

      const soliderObj = {
        ...unit,
        type: "مجند",
        officer_mortab_hodod: calcWithFilter(
          mortabs,
          ele =>
            ele.Category.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى" &&
            ele.WeaponID == 52,
          "Moratab"
        ),
        officer_mortab_sm: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى" &&
            ele.WeaponID != 52,
          "Moratab"
        ),
        officer_mortab_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        ///////
        officer_siasa_hodod: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى" &&
            ele.WeaponID == 52,
          "Siasa"
        ),
        officer_siasa_sm: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى" &&
            ele.WeaponID != 52,

          "Siasa"
        ),
        officer_siasa_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.officer) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        //////
        officer_total_hodod: calcWithFilter(
          soliders,
          ele =>
            ele.SoldierCategory?.includes(SoldierCategoryMap.officer) &&
            ele.WeaponID == 52
        ),
        officer_total_sm: calcWithFilter(
          soliders,
          ele =>
            ele.SoldierCategory?.includes(SoldierCategoryMap.officer) &&
            ele.WeaponID != 52
        ),
        officer_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.officer)
        ),
        ///
        writer_mortab_solider: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerSolider) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        writer_mortab_money: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerMoney) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        writer_mortab_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writer) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        ///
        writer_siasa_solider: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerSolider) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        writer_siasa_money: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writerMoney) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        writer_siasa_total: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.writer) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        ///
        writer_money_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.writerMoney)
        ),
        writer_solider_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.writerSolider)
        ),
        writer_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.writer)
        ),
        ///
        driver_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.driver) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        driver_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.driver) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        driver_imdad_saisa: calcWithFilter(
          SMDriversSuggestion,
          ele => ele,
          "ImdadTotal"
        ),

        ///
        driver_total_degree_one: calcWithFilter(
          soliders,
          ele =>
            ele.SoldierCategory?.includes(SoldierCategoryMap.driver) &&
            ele.DriverLevel == "اولي"
        ),
        driver_total_degree_two: calcWithFilter(
          soliders,
          ele =>
            ele.SoldierCategory?.includes(SoldierCategoryMap.driver) &&
            ele.DriverLevel != "اولي"
        ),
        driver_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.driver)
        ),
        ////
        professional_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.professional) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        professional_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.professional) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        professional_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.professional)
        ),
        ///
        literal_mortab: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.literal) &&
            ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        literal_siasa: calcWithFilter(
          mortabs,
          ele =>
            ele.Category?.includes(SoldierCategoryMap.literal) &&
            ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        literal_total: calcWithFilter(soliders, ele =>
          ele.SoldierCategory?.includes(SoldierCategoryMap.literal)
        ),
        ///
        totals_Mortab: calcWithFilter(
          mortabs,
          ele => ele.ServiceType != "راتب عالى",
          "Moratab"
        ),
        totals_siasa: calcWithFilter(
          mortabs,
          ele => ele.ServiceType != "راتب عالى",
          "Siasa"
        ),
        totals_totalSum: calcWithFilter(soliders, ele => ele)
      };
      const totalObj = {
        ...unit,
        type: "اجمالي",
        officer_mortab_hodod:
          soliderObj.officer_mortab_hodod + ratebObj.officer_mortab_hodod,
        officer_mortab_sm:
          soliderObj.officer_mortab_sm + ratebObj.officer_mortab_sm,
        officer_mortab_total:
          soliderObj.officer_mortab_total + ratebObj.officer_mortab_total,
        officer_siasa_hodod:
          soliderObj.officer_siasa_hodod + ratebObj.officer_siasa_hodod,
        officer_siasa_sm:
          soliderObj.officer_siasa_sm + ratebObj.officer_siasa_sm,
        officer_siasa_total:
          soliderObj.officer_siasa_total + ratebObj.officer_siasa_total,
        officer_total_hodod:
          soliderObj.officer_total_hodod + ratebObj.officer_total_hodod,
        officer_total_sm:
          soliderObj.officer_total_sm + ratebObj.officer_total_sm,
        officer_total: soliderObj.officer_total + ratebObj.officer_total,
        writer_mortab_solider:
          soliderObj.writer_mortab_solider + ratebObj.writer_mortab_solider,
        writer_mortab_money:
          soliderObj.writer_mortab_money + ratebObj.writer_mortab_money,
        writer_mortab_total:
          soliderObj.writer_mortab_total + ratebObj.writer_mortab_total,
        writer_siasa_solider:
          soliderObj.writer_siasa_solider + ratebObj.writer_siasa_solider,
        writer_siasa_money:
          soliderObj.writer_siasa_money + ratebObj.writer_siasa_money,
        writer_siasa_total:
          soliderObj.writer_siasa_total + ratebObj.writer_siasa_total,
        writer_money_total:
          soliderObj.writer_money_total + ratebObj.writer_money_total,
        writer_solider_total:
          soliderObj.writer_solider_total + ratebObj.writer_solider_total,
        writer_total: soliderObj.writer_total + ratebObj.writer_total,
        driver_mortab: soliderObj.driver_mortab + ratebObj.driver_mortab,
        driver_siasa: soliderObj.driver_siasa + ratebObj.driver_siasa,
        driver_imdad_saisa: calcWithFilter(
          SMDriversSuggestion,
          ele => ele,
          "ImdadTotal"
        ),

        driver_total_degree_one:
          soliderObj.driver_total_degree_one + ratebObj.driver_total_degree_one,
        driver_total_degree_two:
          soliderObj.driver_total_degree_two + ratebObj.driver_total_degree_two,
        driver_total: soliderObj.driver_total + ratebObj.driver_total,
        professional_mortab:
          soliderObj.professional_mortab + ratebObj.professional_mortab,
        professional_siasa:
          soliderObj.professional_siasa + ratebObj.professional_siasa,
        professional_total:
          soliderObj.professional_total + ratebObj.professional_total,
        literal_mortab: soliderObj.literal_mortab + ratebObj.literal_mortab,
        literal_siasa: soliderObj.literal_siasa + ratebObj.literal_siasa,
        literal_total: soliderObj.literal_total + ratebObj.literal_total,
        totals_Mortab: soliderObj.totals_Mortab + ratebObj.totals_Mortab,
        totals_siasa: soliderObj.totals_siasa + ratebObj.totals_siasa,
        totals_totalSum: soliderObj.totals_totalSum + ratebObj.totals_totalSum
      };

      const checkInfinty = v => {
        return v == Infinity ? 0 : v;
      };

      ///
      soliderObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(soliderObj.totals_totalSum / soliderObj.totals_Mortab) *
            100
        ) || 0) + "%";
      soliderObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(soliderObj.totals_totalSum / soliderObj.totals_siasa) *
            100
        ) || 0) + "%";

      soliderObj.totals_totalImdad = "";

      soliderObj.percentages_totalOverImdad = "";
      ////
      ratebObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(ratebObj.totals_totalSum / ratebObj.totals_Mortab) * 100
        ) || 0) + "%";
      ratebObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(ratebObj.totals_totalSum / ratebObj.totals_siasa) * 100
        ) || 0) + "%";

      ratebObj.totals_totalImdad = "";

      ratebObj.percentages_totalOverImdad = "";

      ////
      totalObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_Mortab) * 100
        ) || 0) + "%";
      totalObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_siasa) * 100
        ) || 0) + "%";

      totalObj.totals_totalImdad =
        totalObj.totals_siasa +
        calcWithFilter(SMDriversSuggestion, ele => ele, "ImdadTotal") -
        totalObj.driver_siasa;

      totalObj.percentages_totalOverImdad =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_totalImdad) *
            100
        ) || 0) + "%";

      return [ratebObj, soliderObj, totalObj];
      ///
    },
    getTotal(title, items) {
      const calcItems = (items, type, field) =>
        items
          .filter(ele => ele.type == type)
          .reduce((prev, ele) => prev + ele[field], 0);

      const ratebObj = {
        Unit: title,
        type: "راتب عالي",
        officer_mortab_hodod: calcItems(
          items,
          "راتب عالي",
          "officer_mortab_hodod"
        ),
        officer_mortab_sm: calcItems(items, "راتب عالي", "officer_mortab_sm"),
        officer_mortab_total: calcItems(
          items,
          "راتب عالي",
          "officer_mortab_total"
        ),
        officer_siasa_hodod: calcItems(
          items,
          "راتب عالي",
          "officer_siasa_hodod"
        ),
        officer_siasa_sm: calcItems(items, "راتب عالي", "officer_siasa_sm"),
        officer_siasa_total: calcItems(
          items,
          "راتب عالي",
          "officer_siasa_total"
        ),
        officer_total_hodod: calcItems(
          items,
          "راتب عالي",
          "officer_total_hodod"
        ),
        officer_total_sm: calcItems(items, "راتب عالي", "officer_total_sm"),
        officer_total: calcItems(items, "راتب عالي", "officer_total"),
        writer_mortab_solider: calcItems(
          items,
          "راتب عالي",
          "writer_mortab_solider"
        ),
        writer_mortab_money: calcItems(
          items,
          "راتب عالي",
          "writer_mortab_money"
        ),
        writer_mortab_total: calcItems(
          items,
          "راتب عالي",
          "writer_mortab_total"
        ),
        writer_siasa_solider: calcItems(
          items,
          "راتب عالي",
          "writer_siasa_solider"
        ),
        writer_siasa_money: calcItems(items, "راتب عالي", "writer_siasa_money"),
        writer_siasa_total: calcItems(items, "راتب عالي", "writer_siasa_total"),
        writer_money_total: calcItems(items, "راتب عالي", "writer_money_total"),
        writer_solider_total: calcItems(
          items,
          "راتب عالي",
          "writer_solider_total"
        ),
        writer_total: calcItems(items, "راتب عالي", "writer_total"),
        driver_mortab: calcItems(items, "راتب عالي", "driver_mortab"),
        driver_siasa: calcItems(items, "راتب عالي", "driver_siasa"),
        driver_imdad_saisa: calcItems(items, "راتب عالي", "driver_imdad_saisa"),
        driver_total_degree_one: calcItems(
          items,
          "راتب عالي",
          "driver_total_degree_one"
        ),
        driver_total_degree_two: calcItems(
          items,
          "راتب عالي",
          "driver_total_degree_two"
        ),
        driver_total: calcItems(items, "راتب عالي", "driver_total"),
        professional_mortab: calcItems(
          items,
          "راتب عالي",
          "professional_mortab"
        ),
        professional_siasa: calcItems(items, "راتب عالي", "professional_siasa"),
        professional_total: calcItems(items, "راتب عالي", "professional_total"),
        literal_mortab: calcItems(items, "راتب عالي", "literal_mortab"),
        literal_siasa: calcItems(items, "راتب عالي", "literal_siasa"),
        literal_total: calcItems(items, "راتب عالي", "literal_total"),
        totals_Mortab: calcItems(items, "راتب عالي", "totals_Mortab"),
        totals_siasa: calcItems(items, "راتب عالي", "totals_siasa"),
        totals_totalSum: calcItems(items, "راتب عالي", "totals_totalSum")
      };

      const soliderObj = {
        Unit: title,
        type: "مجند",
        officer_mortab_hodod: calcItems(items, "مجند", "officer_mortab_hodod"),
        officer_mortab_sm: calcItems(items, "مجند", "officer_mortab_sm"),
        officer_mortab_total: calcItems(items, "مجند", "officer_mortab_total"),
        officer_siasa_hodod: calcItems(items, "مجند", "officer_siasa_hodod"),
        officer_siasa_sm: calcItems(items, "مجند", "officer_siasa_sm"),
        officer_siasa_total: calcItems(items, "مجند", "officer_siasa_total"),
        officer_total_hodod: calcItems(items, "مجند", "officer_total_hodod"),
        officer_total_sm: calcItems(items, "مجند", "officer_total_sm"),
        officer_total: calcItems(items, "مجند", "officer_total"),
        writer_mortab_solider: calcItems(
          items,
          "مجند",
          "writer_mortab_solider"
        ),
        writer_mortab_money: calcItems(items, "مجند", "writer_mortab_money"),
        writer_mortab_total: calcItems(items, "مجند", "writer_mortab_total"),
        writer_siasa_solider: calcItems(items, "مجند", "writer_siasa_solider"),
        writer_siasa_money: calcItems(items, "مجند", "writer_siasa_money"),
        writer_siasa_total: calcItems(items, "مجند", "writer_siasa_total"),
        writer_money_total: calcItems(items, "مجند", "writer_money_total"),
        writer_solider_total: calcItems(items, "مجند", "writer_solider_total"),
        writer_total: calcItems(items, "مجند", "writer_total"),
        driver_mortab: calcItems(items, "مجند", "driver_mortab"),
        driver_siasa: calcItems(items, "مجند", "driver_siasa"),
        driver_imdad_saisa: calcItems(items, "مجند", "driver_imdad_saisa"),
        driver_total_degree_one: calcItems(
          items,
          "مجند",
          "driver_total_degree_one"
        ),
        driver_total_degree_two: calcItems(
          items,
          "مجند",
          "driver_total_degree_two"
        ),
        driver_total: calcItems(items, "مجند", "driver_total"),
        professional_mortab: calcItems(items, "مجند", "professional_mortab"),
        professional_siasa: calcItems(items, "مجند", "professional_siasa"),
        professional_total: calcItems(items, "مجند", "professional_total"),
        literal_mortab: calcItems(items, "مجند", "literal_mortab"),
        literal_siasa: calcItems(items, "مجند", "literal_siasa"),
        literal_total: calcItems(items, "مجند", "literal_total"),
        totals_Mortab: calcItems(items, "مجند", "totals_Mortab"),
        totals_siasa: calcItems(items, "مجند", "totals_siasa"),
        totals_totalSum: calcItems(items, "مجند", "totals_totalSum")
      };
      const totalObj = {
        type: "اجمالي",
        Unit: title,
        officer_mortab_hodod: calcItems(
          items,
          "اجمالي",
          "officer_mortab_hodod"
        ),
        officer_mortab_sm: calcItems(items, "اجمالي", "officer_mortab_sm"),
        officer_mortab_total: calcItems(
          items,
          "اجمالي",
          "officer_mortab_total"
        ),
        officer_siasa_hodod: calcItems(items, "اجمالي", "officer_siasa_hodod"),
        officer_siasa_sm: calcItems(items, "اجمالي", "officer_siasa_sm"),
        officer_siasa_total: calcItems(items, "اجمالي", "officer_siasa_total"),
        officer_total_hodod: calcItems(items, "اجمالي", "officer_total_hodod"),
        officer_total_sm: calcItems(items, "اجمالي", "officer_total_sm"),
        officer_total: calcItems(items, "اجمالي", "officer_total"),
        writer_mortab_solider: calcItems(
          items,
          "اجمالي",
          "writer_mortab_solider"
        ),
        writer_mortab_money: calcItems(items, "اجمالي", "writer_mortab_money"),
        writer_mortab_total: calcItems(items, "اجمالي", "writer_mortab_total"),
        writer_siasa_solider: calcItems(
          items,
          "اجمالي",
          "writer_siasa_solider"
        ),
        writer_siasa_money: calcItems(items, "اجمالي", "writer_siasa_money"),
        writer_siasa_total: calcItems(items, "اجمالي", "writer_siasa_total"),
        writer_money_total: calcItems(items, "اجمالي", "writer_money_total"),
        writer_solider_total: calcItems(
          items,
          "اجمالي",
          "writer_solider_total"
        ),
        writer_total: calcItems(items, "اجمالي", "writer_total"),
        driver_mortab: calcItems(items, "اجمالي", "driver_mortab"),
        driver_siasa: calcItems(items, "اجمالي", "driver_siasa"),
        driver_imdad_saisa: calcItems(items, "اجمالي", "driver_imdad_saisa"),
        driver_total_degree_one: calcItems(
          items,
          "اجمالي",
          "driver_total_degree_one"
        ),
        driver_total_degree_two: calcItems(
          items,
          "اجمالي",
          "driver_total_degree_two"
        ),
        driver_total: calcItems(items, "اجمالي", "driver_total"),
        professional_mortab: calcItems(items, "اجمالي", "professional_mortab"),
        professional_siasa: calcItems(items, "اجمالي", "professional_siasa"),
        professional_total: calcItems(items, "اجمالي", "professional_total"),
        literal_mortab: calcItems(items, "اجمالي", "literal_mortab"),
        literal_siasa: calcItems(items, "اجمالي", "literal_siasa"),
        literal_total: calcItems(items, "اجمالي", "literal_total"),
        totals_Mortab: calcItems(items, "اجمالي", "totals_Mortab"),
        totals_siasa: calcItems(items, "اجمالي", "totals_siasa"),
        totals_totalSum: calcItems(items, "اجمالي", "totals_totalSum")
      };

      const checkInfinty = v => {
        return v == Infinity ? 0 : v;
      };

      ///
      soliderObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(soliderObj.totals_totalSum / soliderObj.totals_Mortab) *
            100
        ) || 0) + "%";
      soliderObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(soliderObj.totals_totalSum / soliderObj.totals_siasa) *
            100
        ) || 0) + "%";

      soliderObj.totals_totalImdad = calcItems(
        items,
        "مجند",
        "totals_totalImdad"
      );

      soliderObj.percentages_totalOverImdad =
        (Math.ceil(
          checkInfinty(
            soliderObj.totals_totalSum / soliderObj.totals_totalImdad
          ) * 100
        ) || 0) + "%";
      ////
      ratebObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(ratebObj.totals_totalSum / ratebObj.totals_Mortab) * 100
        ) || 0) + "%";
      ratebObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(ratebObj.totals_totalSum / ratebObj.totals_siasa) * 100
        ) || 0) + "%";

      ratebObj.totals_totalImdad = calcItems(
        items,
        "راتب عالي",
        "totals_totalImdad"
      );

      ratebObj.percentages_totalOverImdad =
        (Math.ceil(
          checkInfinty(ratebObj.totals_totalSum / ratebObj.totals_totalImdad) *
            100
        ) || 0) + "%";

      ////
      totalObj.percentages_totalOverMortab =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_Mortab) * 100
        ) || 0) + "%";
      totalObj.percentages_totalOverSiasa =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_siasa) * 100
        ) || 0) + "%";

      totalObj.totals_totalImdad = calcItems(
        items,
        "اجمالي",
        "totals_totalImdad"
      );

      totalObj.percentages_totalOverImdad =
        (Math.ceil(
          checkInfinty(totalObj.totals_totalSum / totalObj.totals_totalImdad) *
            100
        ) || 0) + "%";

      return [ratebObj, soliderObj, totalObj];
    },
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where Status like N'%بالخدمة%'  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
    }
  }
};
</script>
