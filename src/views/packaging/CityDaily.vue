
<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية بالمحافظات'"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "CitiesCategoryDaily",
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
        ...this.selects.Cities.data.map(ele => ({
          text: ele.City,
          value: ele.CityID.toString(),
          searchValue: ele.CityID.toString(),
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
      let unitTableName;

      if (this.$route.params.type == '"complete"') {
        tableName = "CompletePlanCandidates";
        unitTableName = "CompletePlanUnit";
      }
      else if (this.$route.params.type == '"organization"') {
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


      console.log("ALL DATA"  , lodash.groupBy(soldiers.data , ele=>ele.Soldier.CityID));


      let returnedItems = [];

      for (let i = 0; i < data.data.length; i++) {
        returnedItems.push({
          Unit: data.data[i].Unit.Unit,
          ...this.selects.Cities.data.map(ele => {
            return soldiers.data
              .filter(
                sol =>
                  sol.Soldier.CityID == ele.CityID &&
                  sol.PackagedUnitID == data.data[i].Unit.UnitID
              )
              .length.toString();
          }),
          total :soldiers.data
              .filter(
                  sol =>
                      sol.PackagedUnitID == data.data[i].Unit.UnitID)
              .length
        });
      }


      try{

        returnedItems.push({
          Unit: "الاجمالي",
          ...this.selects.Cities.data.map(ele => {
            return soldiers.data
                .filter(
                    sol =>
                        sol.Soldier.CityID == ele.CityID
                )
                .length.toString();
          }),
          total :soldiers.data.length

        });
      }catch (e){
        console.log("Error" , e.toString());
      }

      console.log("Returned " , returnedItems);


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
