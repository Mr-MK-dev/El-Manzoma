<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المقارنة'"
    >
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="comparisonDetails"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("@/Constant").default;
const lodash = require("lodash");

export default {
  name: "ComparisonDetails",
  props: {},
  mounted() {
    this.init();
    // this.findItems({});
  },
  data: () => ({
    comparisonDetails: {},
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
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "السنة",
          value: "Year",
          searchValue: "Year",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "التقدير",
          value: "Grade_Text",
          searchValue: "Grade_Text",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "النسبة",
          value: "Nesba_Number",
          searchValue: "Nesba_Number",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "من",
          value: "From_Date",
          searchValue: "From_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الي",
          value: "To_Date",
          searchValue: "To_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },

        {
          text: "ملاحظات",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {}
  }),
  methods: {
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id"],
        multi = [],
        dates = ["From_Date", "To_Date"];

      this.api("global/get_all", {
        table: "Grade",
        include: [{ model: "Rateb" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          // this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
