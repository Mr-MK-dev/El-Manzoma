<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في تقارير ألإسكان"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'ألإسكان'"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
const lodash = require("lodash");
export default {
  name: "HousingReports",
  mounted() {
    this.init();
  },
  data: () => ({
    groupedItems: [],
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الرتبة",
          value: "Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الحالة",
          value: "Kind",
          searchValue: "Kind",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المستفيد",
          value: "Beneficiary",
          searchValue: "Beneficiary",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "اسم المستفيد",
          value: "BeneficiaryName",
          searchValue: "BeneficiaryName",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الهاتف",
          value: "BeneficiaryPhoneNumber",
          searchValue: "BeneficiaryPhoneNumber",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "محل الاسكان",
          value: "Place",
          searchValue: "Place",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Level: {
        text: "text",
        value: "text",
        data: [
          ...constants.ratebLevels,
          ...constants.SoldierLevel.data,
          ...constants.OfficerLevels.data
        ]
      }
    }
  }),

  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          UnitID: "",
          Name: ""
        },
        likes = ["ID"],
        multi = [],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "Housing",
        where: where
      });
      console.log("where", where);

      console.log("Data", data.data);
      let items = [];
      for (const ele of data.data) {
        console.log("EEEEE", ele);
        var housed = await this.fetchDataBaseOnType(
          ele.ID,
          ele.MilitaryType == "مجند"
            ? "Soldier"
            : ele.MilitaryType == "ضابط"
            ? "Officer"
            : "Rateb",
          "Housed"
        );

        console.log("EEEEE", housed);
        items.push({
          ...ele,
          ...housed.Housed
        });
      }
      console.log("Items", items);

      if (filters.UnitID != null && filters.UnitID.length > 0) {
        items = items.filter(ele => filters.UnitID.includes(ele.UnitID));
      }

      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Name?.includes(filters.Name));
      }
      let printer = {
        data: [
          ...items.map(ele => ({
            ...ele
          }))
        ],
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(
          f => f.inTable && f.text.length
        )
      };
      this.$set(this.mainTable, "items", items);
      this.$set(this.mainTable, "printer", printer);
    }
  }
};
</script>
