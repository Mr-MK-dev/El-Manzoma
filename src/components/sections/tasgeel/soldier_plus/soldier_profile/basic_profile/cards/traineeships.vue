<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة فرقة
      </v-btn>
    </v-card-title>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'الفرق'">
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      @on-add="actionAdd()"
      addBtnTitle="إضافة فرقة"
      title="بيانات الفرقة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="TraineeShip"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("@/Constant").default;

export default {
  name: "trainee-ship-card",
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
    this.init();
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "RatebTraineeShip",
        include: [{ model: "Rateb" }, { model: "TraineeShip" }],
        where: {
          id: this.conscripte.ID
        }
      });

      this.items = result.data;
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
    },

    async saveItem() {
      this.TraineeShip.id = this.conscripte.ID;
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.TraineeShip.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "RatebTraineeShip",
            where: this.TraineeShip.ID_KEY
              ? {
                  ID_KEY: this.TraineeShip.ID_KEY
                }
              : {
                  ...this.TraineeShip
                },
            update: {
              ...this.TraineeShip
            }
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    showAddDialog: false,
    TraineeShip: {},
    selects: {
      TraineeShipID: {
        table: "TraineeShip",
        value: "TraineeShipID",
        text: "Name"
      },

      grade: {
        value: "text",
        text: "text",
        data: ["ممتاز", "جيد جدا", "جيد", "مقبول", "ضغيف", "ضغيف جدا"]
      }
    },
    headers: [
      {
        text: "إسم الفرقة",
        value: "TraineeShip.Name",
        searchValue: "TraineeShipID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التقدير",
        value: "grade",
        searchValue: "grade",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "النسبة",
        value: "degree",
        searchValue: "degree",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "مكان الدورة",
        value: "place",
        searchValue: "place",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "من تاريخ",
        value: "date_from",
        searchValue: "date_from",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الى تاريخ",
        value: "date_to",
        searchValue: "date_to",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    search: ""
  })
};
</script>
