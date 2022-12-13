<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :wordFile="'/new_commers/DistributionRecuComparison'"
      :isExcel="true"
      :title="''"
    >
      <template v-slot:item.TotalRecu="{ item }">
        {{ item.AvgRecu + item.AboveAvgRecu + item.NormalRecu + item.HighRecu }}
      </template>
      <template v-slot:item.TotalSupply="{ item }">
        {{
          item.AboveAvgSupply -
            item.NormalSupply +
            item.HighSupply +
            item.AvgSupply
        }}
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

  mounted() {
    this.init();
    this.findItems({});
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
          text: "مجموع الدعم",
          value: "TotalSupply",
          searchValue: "totalSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "موجود فعلي المرحلة عليا",
          value: "HighRecu",
          searchValue: "HighRecu",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "موجود فعلي المرحلة فوق المتوسطة",
          value: "AboveAvgRecu",
          searchValue: "AboveAvgRecu",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "موجود فعلي المرحلة متوسطة",
          value: "AvgRecu",
          searchValue: "AvgRecu",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "موجود فعلي المرحلة عادة",
          value: "NormalRecu",
          searchValue: "NormalRecu",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "مجموع موجودين المرحلة",
          value: "TotalRecu",
          searchValue: "totalRecu",
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

      let x;
      try {
        let RecuSoldiers = await this.api("global/get_all", {
          table: "Soldier",
          where: {
            RecuStage: this.$route.params.RecuStage,
            Status: "بالخدمة",
            SoldierCategory: "صف",
            WeaponID: 52
          }
        });
        let allSoldiers = await this.api("global/get_all", {
          table: "Soldier",
          where: {
            Status: "بالخدمة",
            SoldierCategory: "صف",
            WeaponID: 52
          }
        });

        let groupByunit = lodash.groupBy(RecuSoldiers.data, el => el.UnitID);
        console.log("recusSoldiers g by unit id", RecuSoldiers.data);
        x = await this.api("global/get_all", {
          table: "distriputionPlanStats",
          include: [
            {
              model: "Unit"
            },
            {
              model: "distriputionPlanList",
              where: this.cleanObject({
                ID_KEY: this.$route.params.id
              })
            }
          ]
        });

        const Mortabat = await this.api("global/get_all", {
          table: "MortabatDuties",
          include: [
            {
              model: "Unit"
            }
          ],
          where: this.cleanObject({
            WeaponID: 52,
            Category: "صف",
            ServiceType: {
              $not: "راتب عالى"
            }
          })
        });

        let items = [];
        console.log("data", x.data);
        let dateBeforeMonth = new Date(
          x.data[0].distriputionPlanList.RecuEndDate
        );
        let dateAftertwoMonth = new Date(
          x.data[0].distriputionPlanList.RecuEndDate
        );
        dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);
        dateAftertwoMonth.setMonth(dateAftertwoMonth.getMonth() + 2);
        let grupByunit = lodash.groupBy(x.data, el => el.UnitID);
        console.log("asdasd", grupByunit);
        console.log(
          "Recu Stage - = ",
          x.data[0].distriputionPlanList.RecuStage
        );
        Object.keys(grupByunit).map(key => {
          items.push({
            ...grupByunit[key][0],
            totals: allSoldiers.data.filter(
              el =>
                el.UnitID == key &&
                el.RecuEndDate > this.formatDate(dateBeforeMonth) &&
                el.RecuStage !== x.data[0].distriputionPlanList.RecuStage
            ).length,
            RecuStage: x.data[0].distriputionPlanList.RecuStage,
            totalCurrent: allSoldiers.data.filter(
              el =>
                el.UnitID == key &&
                el.RecuEndDate > this.formatDate(dateBeforeMonth)
            ).length,
            Moratab: Mortabat.data
              .filter(e => e?.UnitID == key)
              .reduce((prev, curr) => prev + curr?.Moratab, 0),
            Siasa: Mortabat.data
              .filter(e => e?.UnitID == key)
              .reduce((prev, curr) => prev + curr?.Siasa, 0),
            HighRecu: !groupByunit[key]
              ? 0
              : groupByunit[key].filter(ele => ele.KnowledgeLevel === "عليا")
                  .length,
            AboveAvgRecu: !groupByunit[key]
              ? 0
              : groupByunit[key].filter(
                  ele => ele.KnowledgeLevel === "فوق متوسطة"
                ).length,
            AvgRecu: !groupByunit[key]
              ? 0
              : groupByunit[key].filter(ele => ele.KnowledgeLevel === "متوسطه")
                  .length,
            NormalRecu: !groupByunit[key]
              ? 0
              : groupByunit[key].filter(ele => ele.KnowledgeLevel === "عادة")
                  .length
          });
        });
        console.log(items);
        this.$set(this.mainTable, "items", items);
        // this.$set(this.mainTable, "printer", {
        //   cons: [
        //     ...items.map(ele => ({
        //       ...ele
        //     }))
        //   ],
        //   excelKey: "cons",
        //   excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        // });
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
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
