<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في تقارير التكريمات"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التكريمات'"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
const lodash = require("lodash");
export default {
  name: "HonorsReports",
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
          text: "تاريخ التكريم",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مكان التكريم",
          value: "HonorPlace",
          searchValue: "HonorPlace",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "التكريم",
          value: "Honor",
          searchValue: "Honor",
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
        date = ["Date"];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "Honors",
        where: where
      });

      console.log("Data", data.data);
      let items = [];
      for (const ele of data.data) {
        var honored = await this.fetchDataBaseOnType(
          ele.ID,
          ele.MilitaryType == "مجند"
            ? "Soldier"
            : ele.MilitaryType == "ضابط"
            ? "Officer"
            : "Rateb",
          "Honored"
        );

        items.push({
          ...ele,
          ...honored.Honored
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
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      saveItem = await this.api(
        `global/${this.unitCar.isEdit ? "update_one" : "create_one"}`,
        {
          table: "Honors",
          where: !this.unitCar.isEdit
            ? this.unitCar
            : {
                ID_KEY: this.unitCar.ID_KEY
              },
          update: this.unitCar
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems({});
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "unitCar", {});

      this.$set(this, "unitCar", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "unitCar", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "UnitsCars",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
