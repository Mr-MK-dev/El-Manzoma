<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title=""
      :addButton="false"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :isExcel="true"
      :title="''"
    ></table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "distripution_suggest",

  computed: {},

  mounted() {
    this.init();
    this.getRecuEndDateOptions();
    this.findItems({});
  },
  data: () => ({
    plan: {},
    totals: {
      deduction: 0,
      Supply: 0
    },
    searchLoading: false,
    selects: {
      RatebLevel: {
        data: constants.ratebLevels
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي",
            value: "1"
          },
          {
            text: "الشريحة الثانية",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          }
        ]
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "لشريحة",
          value: "SupplyLayer",
          searchValue: "SupplyLayer",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
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
          text: "المرتب",
          value: "moratab",
          searchValue: "moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "السياسة",
          value: "siasa",
          searchValue: "siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الموجود",
          value: "total",
          searchValue: "total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  watch: {},

  methods: {
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where Status like N'%بالخدمة%'  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      // this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
      // this.allUnites = [...this.selects.unitIds.data];
    },

    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [""],
        multi = ["RecuEndDate"];

      where = this.mapToQuery(where, likes, multi);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Unit",
              where: this.cleanObject({
                SupplyLayer: filters.SupplyLayer
              })
            }
          ],
          where: this.cleanObject({
            WeaponID: 52,
            SoldierCategory: "صف",
            Status: "بالخدمة",
            RecuEndDate: filters.RecuEndDate
          })
        });
        const Mortabat = await this.api("global/get_all", {
          table: "MortabatDuties",
          include: [
            {
              model: "Unit"
            }
          ],
          where: this.cleanObject({
            Category: "صف",
            ServiceType: "مجند"
          })
        });

        let SoldiersGroupedByUnitID = lodash.groupBy(
          x.data,
          ele => ele?.Unit.Unit
        );
        const distripution_report = Object.keys(SoldiersGroupedByUnitID).map(
          key => ({
            Unit: key,
            moratab: Mortabat.data
              .filter(e => e?.Unit.Unit == key)
              .reduce((prev, curr) => prev + curr?.Moratab, 0),
            siasa: Mortabat.data
              .filter(e => e?.Unit.Unit == key)
              .reduce((prev, curr) => prev + curr?.Siasa, 0),
            total: SoldiersGroupedByUnitID[key].length
          })
        );

        // let data = await Promise.all(
        //   x.data.map(ele => {
        //     return {
        //       mortab: Mortabat.data
        //         .filter(e => e.UnitID == ele.UnitID)
        //         .reduce((prev, curr) => prev + curr.Moratab, 0),
        //       siasa: Mortabat.data
        //         .filter(e => e.UnitID == ele.UnitID)
        //         .reduce((prev, curr) => prev + curr.Siasa, 0),
        //       ...ele
        //     };
        //   })
        // );

        console.log("finaldatas", distripution_report);

        this.$set(this.mainTable, "items", distripution_report);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
