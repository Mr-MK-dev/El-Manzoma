<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="true"
      @on-search="findItems"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في مستوى أدنى"
      addBtnTitle="إضافة مستوى أدنى"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المستوى الأدنى'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.SoliderID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoliderID}`"
          @click.right="copyText(item.SoliderID)"
        >
          {{ item.SoliderID }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="lowLevel"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "LowLevel",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    lowLevel: {},
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

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
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
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
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          required: false,
          sort: 1
        },
        {
          text: "القرار",
          value: "Decision",
          searchValue: "Decision",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "التشخيص",
          value: "Diagnosis",
          searchValue: "Diagnosis",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          required: false,
          inModel: true,
          sort: 1
        },
        {
          text: "التاريخ",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          required: false,
          inModel: true,
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
    componentName: "LowLevel",
    selects: {}
  }),
  watch: {
    "lowLevel.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "LowLevels",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems();
        }
      });
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "lowLevel", {
        ...item,
        isEdit: true
      });
      this.findOne(item.ID);
    },
    actionAdd() {
      this.$set(this, "lowLevel", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async saveItem(edirableFromTableItem) {
      // if (!this.lowLevel.Name) {
      //   return this.showError("هذا الفرد غير مسجل لدينا");
      // }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.lowLevel.isEdit ? "update_one" : "create_one"}`,
          {
            table: "LowLevels",
            where: !this.lowLevel.isEdit
              ? this.lowLevel
              : {
                  ID_KEY: this.lowLevel.ID_KEY
                },
            update: this.lowLevel
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.lowLevel, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID"],
        multi = [],
        dates = ["Date"];

      this.api("global/get_all", {
        table: "LowLevels",
        include: [{ model: "Rateb", include: [{ model: "Unit" }] }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(async x => {
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
    }
  }
};
</script>
