<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في عمليات النفل"
      addBtnTitle="إضافة عملية نقل"
    />

    <editor-dialog-bulider
      title="إضافة عملية نقل"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="transfer"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "addTransfer",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    transfer: {},
    subjectLimit: 10,
    showAddDialog: false,
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
          text: "الرقم العسكري",
          value: "id",
          searchValue: "id",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة الحالية",
          value: "Rateb.Unit.Unit",
          searchValue: "unitid",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة المنقول اليها",
          value: "Unit.Unit",
          searchValue: "TransferredUnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },

        {
          text: "تاريخ الضم علي الوحدة",
          value: "todam",
          searchValue: "todam",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الانتقال من الوحدة",
          value: "fromdam",
          searchValue: "fromdam",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "addTransfer",
    selects: {
      uintid: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      TransferredUnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  watch: {
    "transfer.id"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async saveItem(edirableFromTableItem) {
      if (!this.transfer.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }

      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "preuint",
          where: this.transfer
        });

        saveItem = await this.api(`global/update_one }`, {
          table: "Rateb",
          where: {
            ID: this.transfer.id
          },
          update: {
            UnitID: this.transfer.TransferredUnitID,
            UnitJoinDate: this.transfer.todam
          }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.transfer = {};
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this, "loading", false);
      }
    },
    findOne(id) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { ID: id }
      })
        .then(x => {
          console.log(x);
          this.$set(this.transfer, "Name", x.data.Name);
          this.$set(this.transfer, "unitid", x.data.UnitID);
        })
        .catch(error => {})
        .finally(() => {});
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id"],
        multi = [],
        dates = ["todam", "fromdam"];

      this.api("global/get_all", {
        table: "preuint",
        include: [{ model: "Rateb" }, { model: "Unit" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.transfer = {};
      //   this.$set(this.createdObject, "item", {});
      //   this.$set(this.createdObject, "model", true);
      // }
    }
  }
};
</script>
