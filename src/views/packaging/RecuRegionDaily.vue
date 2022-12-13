<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية بمناطق التجنيد'"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "RecuRegionDaily",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.initWithoutChecking();
    this.findItems();
  },
  data: () => ({
    selects: {
      Cities: {
        table: "City",
        value: "CityID",
        text: "City"
      }
    },
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
      headers: []
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.mainTable.headers = [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        ...constants.RecuRegion.dataInArray.map(ele => ({
          text: ele,
          value: constants.RecuRegion.dataInArray.indexOf(ele).toString(),
          searchValue: constants.RecuRegion.dataInArray.indexOf(ele).toString(),
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        })),
        {
          text: "الاجمالي",
          value: "total",
          searchValue: "total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        }
      ];
      let tableName;

      if (this.$route.params.type == '"complete"') {
        tableName = "CompletePlanCandidates";
      } else if (this.$route.params.type == '"organization"') {
        tableName = "OrganizationPlanCandidates";
      }
      console.log(this.$route.params.type);
      console.log(tableName);

      let units = await this.api("global/get_all", {
        table: "Unit",

        where: this.cleanObject({
          hasPackaging: true,
          statue: "بالخدمة"
        })
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
      let returnedItems = [];

      for (let i = 0; i < units.data.length; i++) {
        returnedItems.push({
          ...units.data[i],
          ...constants.RecuRegion.data.map(ele => {
            return soldiers.data.filter(
              sol =>
                sol.Soldier.RecuRegion == ele.text &&
                sol.PackagedUnitID == units.data[i].UnitID
            ).length;
          }),
          total : soldiers.data.filter(ele=>ele.PackagedUnitID == units.data[i].UnitID).length
        });
      }

      returnedItems.push({
        Unit:"الاجمالي",
        ...constants.RecuRegion.data.map(ele => {
          return soldiers.data.filter(
              sol =>
                  sol.Soldier.RecuRegion == ele.text
          ).length;
        }),
        total : soldiers.data.length


      })

      console.log("ALL DATA" , lodash.groupBy(soldiers.data , ele=>ele.Soldier.RecuRegion));



      let printer = {
        cons: [...returnedItems],
        excelKey: "cons",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.$set(this.mainTable, "printer", printer);
      this.$set(this.mainTable, "items", returnedItems);
    }
  }
};
</script>
