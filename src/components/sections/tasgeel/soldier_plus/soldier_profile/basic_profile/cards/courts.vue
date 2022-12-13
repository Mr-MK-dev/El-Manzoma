<template>
  <div>
    <!--    <v-btn @click="actionAdd()" large outlined color="primary">-->
    <!--      إضافة عقوبة جديدة-->
    <!--    </v-btn>-->
    <v-card :loading="loading" :disabled="loading">
      <table-bulider
        :headers="headers"
        :items="items"
        :title="'المحاكم والعقوبات'"
      >
      </table-bulider>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="addedPunishment"
      :selects="selects"
      @on-submit="saveNewPunishment()"
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
        table: "RatebPunishments",
        include: [],
        where: {
          ID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },

    // Add Validation
    async saveNewPunishment(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      this.addedPunishment.ID = this.conscripte.ID;
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.addedPunishment.isEdit ? "update_one" : "create_one"}`,
          {
            table: "RatebPunishments",
            where: !this.addedPunishment.isEdit
              ? this.addedPunishment
              : {
                  con: this.addedPunishment.con
                },
            update: this.addedPunishment
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
      this.$set(this, "addedPunishment", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    addedPunishment: {},

    headers: [
      {
        text: "",
        value: "actionsStart",
        searchValue: "actionsStart",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "التاريخ",
        value: "date",
        searchValue: "date",
        sortable: true,
        type: "date",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الجريمة",
        value: "crimeText",
        searchValue: "crimeText",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ الجريمة من",
        value: "crimeFromDate",
        searchValue: "crimeFromDate",
        sortable: true,
        type: "date",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ الجريمة الى",
        value: "crimeToDate",
        searchValue: "crimeToDate",
        sortable: true,
        type: "date",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الفترة بالإيام",
        value: "periodInDays",
        searchValue: "periodInDays",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "رقم الأمر",
        value: "orderNumber",
        searchValue: "orderNumber",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ الأمر",
        value: "orderDate",
        searchValue: "orderDate",
        sortable: true,
        type: "date",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "النوع",
        value: "kind",
        searchValue: "kind",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نوع الجريمة",
        value: "type",
        searchValue: "type",
        sortable: true,
        type: "textarea",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      }
      // {
      //   text: "رفع أثار الجريمة",
      //   value: "isRemoved",
      //   searchValue: "isRemoved",
      //   sortable: true,
      //   type: "checkbox",
      //   inSearch: false,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // }
    ],
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    search: "",
    selects: {
      kindofpunshment: {
        text: "text",
        value: "text",
        data: constants.kindofpunshments.data
      },
      punshment: {
        text: "text",
        value: "text",
        data: constants.punshments.data
      },
      Summryofcrime: {
        text: "text",
        value: "text",
        data: constants.summryofcrime.data
      }
    }
  })
};
</script>
