<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'بيان مجمع بمنظومات الكهرو بصري'"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "unitsSystemsReport",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.init();
    this.findItems();
    console.log("selects", this.selects);
  },
  data: () => ({
    selects: {
      Systems: {
        table: "Systems",
        value: "SystemID",
        text: "Name"
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
        ...this.selects.Systems.data.map(ele => ({
          text: ele.Name,
          value: ele.ID_KEY.toString(),
          searchValue: ele.ID_KEY.toString(),
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

      let data = await this.api("global/get_all", {
        table: "UnitSystems",
        include: [{ model: "Unit" }]
      });

      console.log(
        "ALL DATA",
        lodash.groupBy(data.data, ele => ele.UnitID)
      );
      const groupedByUnits = lodash.groupBy(data.data, ele => ele.UnitID);
      const groupedBySystem = lodash.groupBy(data.data, ele => ele.SystemID);

      console.log("gbs", groupedBySystem);

      let returnedItems = Object.keys(groupedByUnits).map(key => ({
        UnitID: key,
        Unit: groupedByUnits[key][0].Unit.Unit
      }));

      for (let i = 0; i < returnedItems.length; i++) {
        for (let j = 0; j < this.selects.Systems.data.length; j++) {
          returnedItems[i] = {
            ...returnedItems[i],
            [this.selects.Systems.data[j].ID_KEY]: lodash.sumBy(
              groupedByUnits[returnedItems[i].UnitID].filter(
                ele => ele.SystemID == this.selects.Systems.data[j].ID_KEY
              ),
              ele => ele.TotalSystems
            )
          };
        }

        returnedItems[i] = {
          ...returnedItems[i],
          total: lodash.sumBy(
            groupedByUnits[returnedItems[i].UnitID],
            ele => ele.TotalSystems
          )
        };
      }

      console.log("returnedItems", returnedItems);

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
