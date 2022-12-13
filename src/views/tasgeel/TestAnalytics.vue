<template>
  <div>


    <analytical-table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :filterItems="mainTable.filterItems"
    >
    </analytical-table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const displayTypes = types.displayTypes;

export default {
  name: "TestAnalytics",
  props: {},
  mounted() {
    this.findItems();
    this.init();
  },
  data: () => ({
    Effect: {},
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
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [],
      items: [],
      filterItems: [],
      printer: {}
    },
    componentName: "createdObject",
    selects: {
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },

      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
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
      }
    }
  }),
  watch: {
  },
  methods: {
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);

        let soldiers  = await  this.api("global/get_all" , {
          table :"Soldier" ,
          where :{ Status : "بالخدمة"
           , KnowledgeLevel :"عادة"},
          include :[
            {model:"Unit"}
          ]
        })
        this.$set(this.mainTable, "items", soldiers.data);
        this.$set(this.mainTable, "filterItems", ["Unit.Unit", "SoldierCategory"]);

        // this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },

  }

};
</script>
