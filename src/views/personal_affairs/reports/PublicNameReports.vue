<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في تقارير إطلاق اسم شهيد"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'إطلاق اسم شهيد'"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
const lodash = require("lodash");
export default {
  name: "PublicNameReports",
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
          inTable: false,
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
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مكان إطلاق اسم شهيد",
          value: "PrevPublicName",
          searchValue: "PrevPublicName",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الاستشهاد",
          value: "DateOfIncident",
          searchValue: "DateOfIncident",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "textarea",
          inTable: true,
          inSearch: false,
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
          Name: "",
          DateOfIncident:""
        },
        likes = ["ID"],
        multi = [],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where", where);
      let data = await this.api("global/get_all", {
        table: "PublicName",
        where: where
      });


      console.log();
      console.log("where", where);

      console.log("Data", data.data);
      let items = [];
      for (const ele of data.data) {
        console.log("EEEEE", ele);
        let martyr = await this.api("global/get_one", {
          table: "MartyrsAndInjuredAndDeath",
          where: {
            Kind: "شهيد",
            ID : ele.ID
          }
        });
        console.log("ddddd" , martyr);
        var publicName = await this.fetchDataBaseOnType(
          ele.ID,
          ele.MilitaryType == "مجند"
            ? "Soldier"
            : ele.MilitaryType == "ضابط"
            ? "Officer"
            : "Rateb",
          "publicname"
        );

        console.log("EEEEE", publicName);
        items.push({
          ...ele,
          DateOfIncident : martyr.data.DateOfIncident,
          ...publicName.publicname
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
