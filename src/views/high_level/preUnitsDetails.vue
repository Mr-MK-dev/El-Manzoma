<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      إضافة وحدة سابقة
    </v-btn>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الوحدات السابقة'"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.id}`"
          @click.right="copyText(item.id)"
        >
          {{ item.id }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="preUnitDetails"
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
  name: "preUnitsDetails",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    preUnitDetails: {},
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
          text: "الوحدة السابقة",
          value: "Unit.Unit",
          searchValue: "uintid",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },

        {
          text: "تاريخ الضم علي الوحدة",
          value: "todam",
          searchValue: "todam",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
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
    selects: {
      uintid: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  watch: {
    "preUnitDetails.id"(newValue) {
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
            table: "preuint",
            where: {
              con: item.con
            }
          });
          this.findItems({ id: this.preUnitDetails.id });
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.preUnitDetails.id) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.preUnitDetails.isEdit ? "update_one" : "create_one"}`,
          {
            table: "preuint",
            where: !this.preUnitDetails.isEdit
              ? this.preUnitDetails
              : {
                  con: this.preUnitDetails.con
                },
            update: this.preUnitDetails
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ id: this.preUnitDetails.id });
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
      this.api("global/get_one", {
        table: "Rateb",
        where: { id }
      })
        .then(x => {
          this.$set(this.preUnitDetails, "Name", x.data.Name);
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
      this.$set(this, "preUnitDetails", {
        id: this.preUnitDetails.id,
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "preUnitDetails", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
