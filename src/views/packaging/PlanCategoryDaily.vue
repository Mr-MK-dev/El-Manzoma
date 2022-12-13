<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية تخصصات  '"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "PlanCategoryDaily",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.findItems();
  },
  data: () => ({
    completePlanUnit: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "UnitName",
          searchValue: "UnitName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "كود التعبئة",
          value: "TaabeaaCode",
          searchValue: "TaabeaaCode",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "محطة الوصول",
          value: "ArrivalPoint",
          searchValue: "ArrivalPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "منطقة التمركز",
          value: "",
          searchValue: "CenteringPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "كاتب",
          value: "kateb",
          searchValue: "kateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "صف",
          value: "saf",
          searchValue: "saf",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "سائق",
          value: "saeq",
          searchValue: "saeq",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مهني",
          value: "mehany",
          searchValue: "mehany",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "حرفي",
          value: "herafy",
          searchValue: "herafy",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاجمالي",
          value: "total",
          searchValue: "total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let tableName;
      let unitTableName;

      if (this.$route.params.type == '"complete"') {
        tableName = "CompletePlanCandidates";
        unitTableName = "CompletePlanUnit";
      } else if (this.$route.params.type == '"organization"') {
        tableName = "OrganizationPlanCandidates";
        unitTableName = "OrganizationPlanUnit";
      }
      let data = await this.api("global/get_all", {
        table: unitTableName,
        where: {
          PackagePlanID: this.$route.params.id
        },
        include: [{ model: "Unit" }]
      });

      let soldiers = await this.api("global/get_all", {
        table: tableName,
        include: [
          {
            model: "Soldier"
          }
        ],

        where: this.cleanObject({
          PackageID: this.$route.params.id
        })
      });

      let returnedData = [];

      for (let i = 0; i < data.data.length; i++) {
        returnedData.push({
          UnitName: data.data[i].Unit.Unit,
          TaabeaaCode: data.data[i].Unit.TaabeaaCode,
          ArrivalPoint: data.data[i].ArrivalPoint,
          CenteringPoint: data.data[i].CenteringPoint,
          kateb: soldiers.data.filter(
            ele =>
              ele.Soldier.SoldierCategory === "كاتب عسكرى" &&
              ele.PackagedUnitID == data.data[i].UnitID
          ).length,
          saf: soldiers.data.filter(
            ele =>
              ele.Soldier.SoldierCategory === "صف" &&
              ele.PackagedUnitID == data.data[i].UnitID
          ).length,
          saeq: soldiers.data.filter(
            ele =>
              ele.Soldier.SoldierCategory === "سائق عجل" &&
              ele.PackagedUnitID == data.data[i].UnitID
          ).length,
          mehany: soldiers.data.filter(
            ele =>
              ele.Soldier.SoldierCategory === "مهنى" &&
              ele.PackagedUnitID == data.data[i].UnitID
          ).length,
          herafy: soldiers.data.filter(
            ele =>
              ele.Soldier.SoldierCategory === "حرفى" &&
              ele.PackagedUnitID == data.data[i].UnitID
          ).length,
          total: soldiers.data.filter(
            ele => ele.PackagedUnitID == data.data[i].UnitID
          ).length
        });
      }

      returnedData.push({
        UnitName: "الاجمالي",
        TaabeaaCode: " ",
        ArrivalPoint: " ",
        CenteringPoint: " ",
        kateb: lodash.sumBy(returnedData, ele => ele.kateb),
        saf: lodash.sumBy(returnedData, ele => ele.saf),
        saeq: lodash.sumBy(returnedData, ele => ele.saeq),
        mehany: lodash.sumBy(returnedData, ele => ele.mehany),
        herafy: lodash.sumBy(returnedData, ele => ele.herafy),
        total: lodash.sumBy(returnedData, ele => ele.total)
      });

      let printer = {
        cons: [...returnedData],
        excelKey: "cons",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.$set(this.mainTable, "printer", printer);
      this.$set(this.mainTable, "items", returnedData);

      console.log(
        "ALL DATA ",
        lodash.groupBy(soldiers.data, ele => ele.Soldier.SoldierCategory)
      );
    }
  }
};
</script>
