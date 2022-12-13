<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة وحدة جديدة
    </v-btn>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="headers"
        :items="items"
        :title="'الوحدات السابقة'"
      >
      </table-bulider>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="preuint"
      :selects="selects"
      @on-submit="saveNewUnit()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "basic-profile-fugitives",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  async mounted() {
    await this.init();
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "preuint",
        include: [
          {
            model: "Unit"
          }
        ],
        where: {
          ID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },

    async saveNewUnit(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.preuint.id = this.conscripte.ID;

      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.preuint.isEdit ? "update_one" : "create_one"}`,
          {
            table: "preuint",
            where: !this.preuint.isEdit
              ? this.preuint
              : {
                  con: this.preuint.con
                },
            update: this.preuint
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
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

    actionAdd() {
      this.$set(this, "preuint", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    preuint: {},
    headers: [
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
    search: "",
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    selects: {
      uintid: {
        table: "Unit",
        value: "UnitID",
        text: "Unit",
        ignoreStatus: true

      }
    }
  })
};
</script>
