<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="يومية المهندسيين بالتخصصات"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="''"
    >
    </table-bulider>
  </div>
</template>

<script>
import soldiers from "../../../dev-server/ons/militaryweb/soldiers";
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "EngineersReport",
  props: {},
  async mounted() {
    await this.init();
  },
  data: () => ({
    groupedValue: [],
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 5
        },
        {
          text: "الوحدة",
          value: "unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      UnitID: {
        text: "Unit",
        value: "UnitID",
        table: "Unit"
      }
    },
    printer: {}
  }),
  watch: {},
  methods: {
    //   this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);

    async findItems(filters) {
      console.log(filters.RecuEndDate);
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      try {
        let Soldiers = await this.api("global/get_all", {
          table: "Soldier",
          where: {
            //   UnitID: filters?.UnitID,
            RecuStage: filters.RecuStage,
            College: "هندسة"
          },
          include: [
            {
              model: "Unit"
            }
          ]
        });

        let specializations = lodash.uniq(
          Soldiers.data.map(ele => ele.Specialization)
        );
        for (let i = 0; i < specializations.length; i++) {
          this.mainTable.headers.push({
            text: specializations[i] ? specializations[i] : "بدون تخصص",
            value: i.toString(),
            searchValue: i.toString(),
            sortable: true,
            type: "text",
            inSearch: false,
            inTable: true,
            inModel: false,
            sort: 1
          });
        }
        this.mainTable.headers.push({
          text: "الإجمالي",
          value: "total",
          searchValue: "total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        });
        console.log("specializations", specializations);
        let SoldierGBUnit = lodash.groupBy(Soldiers.data, ele => ele.UnitID);
        console.log("soldierGroupedByUnit", SoldierGBUnit);
        let returnItems = Object.keys(SoldierGBUnit).map(k => ({
          total: SoldierGBUnit[k].length,
          unit: SoldierGBUnit[k][0].Unit.Unit,
          ...specializations.map(ele => {
            return SoldierGBUnit[k].filter(x => x.Specialization == ele).length;
          })
        }));
        returnItems.push({
          unit: "الاجمالي",
          ...specializations.map(ele => {
            return Soldiers.data
              .filter(sol => sol.Specialization == ele)
              .length.toString();
          }),
          total: Soldiers.data.length
        });
        this.$set(this.mainTable, "printer", {
          data: returnItems,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
        this.$set(this.mainTable, "items", returnItems);
        console.log("returnedItems", returnItems);
      } catch (error) {
        console.log("error", error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    }
  }
};
</script>
