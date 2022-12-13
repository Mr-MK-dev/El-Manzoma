<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة سفر جديد
    </v-btn>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'السفريات'">
      </table-bulider>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="addedTravel"
      @on-submit="saveNewTravel()"
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
        table: "TravalTable",
        include: [],
        where: {
          ID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },
    async saveNewTravel(edirableFromTableItem) {
      if (this.addedTravel.TravalDateTo < this.addedTravel.TravalDateFrom) {
        this.showError("لا يمكن ان يكون تاريخ البدء بعد تاريخ الانتهاء");
      } else {
        this.$set(this.createdObject, "loading", true);
        this.addedTravel.ID = this.conscripte.ID;

        let saveItem;

        try {
          saveItem = await this.api(
            `global/${this.addedTravel.isEdit ? "update_one" : "create_one"}`,
            {
              table: "TravalTable",
              where: !this.addedTravel.isEdit
                ? this.addedTravel
                : {
                    con: this.addedTravel.con
                  },
              update: this.addedTravel
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
      }
    },

    actionAdd() {
      this.$set(this, "addedTravel", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    addedTravel: {},
    headers: [
      {
        text: "جهة السفر",
        value: "TravalDistination",
        searchValue: "TravalDistination",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نوع الرحلة",
        value: "TravalType",
        searchValue: "TravalType",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ بدية السفر",
        value: "TravalDateFrom",
        searchValue: "TravalDateFrom",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ انتهاء السفر",
        value: "TravalDateTo",
        searchValue: "TravalDateTo",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "جهة الانتداب",
        value: "Travalintadab",
        searchValue: "Travalintadab",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "رقم تصديق الامانة",
        value: "AmanaNum",
        searchValue: "AmanaNum",
        sortable: true,
        type: "text",
        inSearch: false,
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
