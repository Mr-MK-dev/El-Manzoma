<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
      title="بحث في المرحلة"
      addBtnTitle=" "
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="''"
      :isExcel="true"
    >
      <template v-slot:item.HighDifference="{ item }">
        {{ item.HighSupply - item.HighRecommendations }}
      </template>
      <template v-slot:item.AboveAvgDifference="{ item }">
        {{ item.AboveAvgSupply - item.AboveAvgRecommendations }}
      </template>
      <template v-slot:item.AvgDifference="{ item }">
        {{ item.AvgSupply - item.AvgRecommendations }}
      </template>
      <template v-slot:item.NormalDifference="{ item }">
        {{ item.NormalSupply - item.NormalReommendations }}
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "comparePlanDetailsWithRecommendations.vue",

  computed: {},

  async mounted() {
    this.selects.RecuEndDate.data = await this.fetchAvailableServiceEndDates();
    this.init();
  },

  data: () => ({
    layer: {},
    imdad: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    totals: {
      deduction: 0,
      Supply: 0
    },
    searchLoading: false,
    selects: {
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
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
      }
    },

    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          readOnly: true,
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
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
          inModel: false,
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
          multiple: false,
          sort: 1
        },

        {
          text: "المرتب",
          value: "Moratab",
          searchValue: "Moratab",
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
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عليا",
          value: "High",
          searchValue: "High",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "فوق المتوسطة",
          value: "AboveAvg",
          searchValue: "AboveAvg",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "متوسطة",
          value: "Avg",
          searchValue: "Avg",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عادة",
          value: "Normal",
          searchValue: "Normal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        // {
        //   text: "الموجود قبل المسرح",
        //   value: "totalBefore",
        //   searchValue: "totalBefore",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "مسرج العليا",
        //   value: "HighLeavers",
        //   searchValue: "HighLeavers",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   readonly: true,
        //   sort: 1
        // },
        // {
        //   text: "مسرح فوق المتوسط",
        //   value: "AboveAvgLeavers",
        //   searchValue: "AboveAvgLeavers",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "مسرح المتوسطة",
        //   value: "AboveAvgLeavers",
        //   searchValue: "AboveAvgLeavers",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "مسرح العادة",
        //   value: "NormalLeavers",
        //   searchValue: "NormalLeavers",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "إجمالي المسرح",
        //   value: "Leavers",
        //   searchValue: "Leavers",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   readonly: true,
        //   sort: 1
        // },
        // {
        //   text: "إجمالي بعد المسرح",
        //   value: "totalAfter",
        //   searchValue: "",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   readonly: true,
        //   sort: 1
        // },
        {
          text: "دعم عليا",
          value: "HighSupply",
          searchValue: "HighSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "توصيات عليا",
          value: "HighRecommendations",
          searchValue: "HighRecommendations",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "فرق عليا",
          value: "HighDifference",
          searchValue: "HighDifference",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم فوق المتوسطة",
          value: "AboveAvgSupply",
          searchValue: "AboveAvgSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "توصيات فوق المتوسطة",
          value: "AboveAvgRecommendations",
          searchValue: "AboveAvgRecommendations",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "فرق فوق المتوسطة",
          value: "AboveAvgDifference",
          searchValue: "AboveAvgDifference",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },

        {
          text: "دعم متوسطة",
          value: "AvgSupply",
          searchValue: "AvgSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "توصيات متوسطة",
          value: "AvgRecommendations",
          searchValue: "AvgRecommendations",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "فرق متوسطة",
          value: "AvgDifference",
          searchValue: "AvgDifference",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم عادة",
          value: "NormalSupply",
          searchValue: "NormalSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "توصيات عادة",
          value: "NormalReommendations",
          searchValue: "NormalReommendations",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "فرق عادة",
          value: "NormalDifference",
          searchValue: "NormalDifference",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
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
    async findItems(filters) {
      console.log("id", this.$route.params.id);
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      // let where = {
      //     ...filters
      //   },
      //   likes = [""],
      //   multi = [""];

      // where = this.mapToQuery(where, likes, multi);

      let recommendations = await this.api("global/get_all", {
        table: "Recommendations",
        where: { RecuStage: filters.RecuStage, Certification: true },
        include: [
          {
            model: "Soldier"
          }
        ]
      });

      let groupByunit = lodash.groupBy(recommendations.data, el => el.UnitID);

      console.log(groupByunit);

      const mortabs = await this.api("global/get_all", {
        table: "MortabatDuties",
        where: {
          ServiceType: `مجند`,
          WeaponID: 52,
          Category: `صف`
        }
      });
      this.api("global/get_all", {
        table: "distriputionPlanStats",
        include: [
          {
            model: "Unit"
          },
          {
            model: "distriputionPlanList",
            where: this.cleanObject({
              SupplyLayer: filters.SupplyLayer,
              RecuEndDate: filters.RecuEndDate,
              RecuStage: filters.RecuStage
            })
          }
        ]
      })
        .then(async x => {
          try {
            let items = [];
            console.log("data", x.data);
            let grupByunit = lodash.groupBy(x.data, el => el.UnitID);
            console.log("asdasd", grupByunit);
            Object.keys(grupByunit).map(key => {
              items.push({
                ...grupByunit[key][0],
                Moratab: lodash.sumBy(
                  mortabs.data.filter(e => e.UnitID == key),
                  sum => sum.Moratab
                ),
                Siasa: lodash.sumBy(
                  mortabs.data.filter(e => e.UnitID == key),
                  sum => sum.Siasa
                ),
                HighRecommendations: !groupByunit[key]
                  ? 0
                  : groupByunit[key].filter(
                      ele => ele.KnowledgeLevel === "عليا"
                    ).length,
                AboveAvgRecommendations: !groupByunit[key]
                  ? 0
                  : groupByunit[key].filter(
                      ele => ele.KnowledgeLevel === "فوق متوسطة"
                    ).length,
                AvgRecommendations: !groupByunit[key]
                  ? 0
                  : groupByunit[key].filter(
                      ele => ele.KnowledgeLevel === "متوسطه"
                    ).length,
                NormalReommendations: !groupByunit[key]
                  ? 0
                  : groupByunit[key].filter(
                      ele => ele.KnowledgeLevel === "عادة"
                    ).length
              });
            });
            console.log(items);
            this.$set(this.mainTable, "items", items);
            this.$set(this.mainTable, "printer", {
              cons: [
                ...items.map(ele => ({
                  ...ele,
                  HighDifference: ele.HighSupply - ele.HighRecommendations,
                  AboveAvgDifference:
                    ele.AboveAvgSupply - ele.AboveAvgRecommendations,
                  AvgDifference: ele.AvgSupply - ele.AvgRecommendations,
                  NormalDifference: ele.NormalSupply - ele.NormalReommendations
                }))
              ],
              excelKey: "cons",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            });
          } catch (e) {
            console.log(e);
          }
        })
        .catch(error => {
          this.handleError(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "imdad", {
        ...item
      });
    }
  }
};
</script>
