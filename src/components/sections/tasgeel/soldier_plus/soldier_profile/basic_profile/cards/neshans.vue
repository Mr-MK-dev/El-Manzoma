<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة نيشان جديد
    </v-btn>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="headers"
        :items="items"
        :title="'الأنواط والنياشين'"
      >
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="addedNeshan"
      @on-submit="saveNewNeshan()"
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
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "Neshan",
        include: [],
        where: {
          SoilderID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },
    async saveNewNeshan(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.addedNeshan.SoilderID = this.conscripte.ID;

      let saveItem;

      try {
        saveItem = await this.api(
          `global/${this.addedNeshan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Neshan",
            where: !this.addedNeshan.isEdit
              ? this.addedNeshan
              : {
                  con: this.addedNeshan.con
                },
            update: this.addedNeshan
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
      this.$set(this, "addedNeshan", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    addedNeshan: {},

    headers: [
      {
        text: "النيشان",
        value: "Noot",
        searchValue: "Noot",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "السبب",
        value: "Ression",
        searchValue: "Ression",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "رقم بند الاوامر",
        value: "Orderid",
        searchValue: "Orderid",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
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
        inModel: true,
        sort: 1
      },
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "text",
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
    }
  })
};
</script>
