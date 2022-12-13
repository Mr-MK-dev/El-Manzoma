<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في تقارير الحج والعمرة"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الحج والعمرة'"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
const lodash = require("lodash");
export default {
  name: "HajjReports",
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
          text: "النوع",
          value: "MilitaryType",
          searchValue: "MilitaryType",
          sortable: true,
          type: "select",
          inTable: false,
          inSearch: true,
          inModel: true,
          multiple: true,
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
          inSearch: false,
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
          text: " الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          type: "select",
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: true,
          required: false,
          inModel: false
        },
        {
          text: " التكريم",
          value: "Type",
          searchValue: "Type",
          type: "text",
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: false
        },

        {
          text: "المستفيد",
          value: "grantee",
          searchValue: "grantee",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "اسم المستفيد",
          value: "granteeName",
          searchValue: "granteeName",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ الحج/عمرة",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
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
      },
      MilitaryType: {
        text: "text",
        value: "text",
        data: [...constants.militaryTypes]
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
        multi = ["MilitaryType"],
        date = ["Date"];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "Hajj",
        where: where
      });

      console.log("Data", data.data);
      let items = [];
      for (const ele of data.data) {
        var employee = await this.fetchDataBaseOnType(
          ele.ID,
          ele.MilitaryType == "مجند"
            ? "Soldier"
            : ele.MilitaryType == "ضابط"
            ? "Officer"
            : "Rateb",
          "Employee"
        );

        items.push({
          ...ele,
          ...employee.Employee
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
