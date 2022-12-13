<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة كفائه
      </v-btn>
    </v-card-title>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'الكفائة'">
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      @on-add="actionAdd()"
      addBtnTitle="إضافة كفائة"
      title="بيانات الكفائة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="grade"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "Grade",
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
        table: "Grade",
        include: [],
        where: {
          SoliderID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
    },

    async saveItem() {
      this.grade.SoliderID = this.conscripte.ID;
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.grade.ID ? `global/create_one` : `global/update_one`,
          {
            table: "Grade",
            where: this.grade.ID
              ? {
                  ID: this.grade.SoliderID
                }
              : {
                  ...this.grade
                },
            update: {
              ...this.grade
            }
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
          this.showAddDiaPlog = false;
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
    grade: {},
    selects: {
      Grade_Text: {
        data: constants.grads
      }
    },
    headers: [
      {
        text: "السنة",
        value: "Year",
        searchValue: "Year",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التقدير",
        value: "Grade_Text",
        searchValue: "Grade_Text",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "النسبة",
        value: "Nesba_Number",
        searchValue: "Nesba_Number",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "من",
        value: "From_Date",
        searchValue: "From_Date",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الي",
        value: "To_Date",
        searchValue: "To_Date",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },

      {
        text: "ملاحظات",
        value: "Note",
        searchValue: "Note",
        sortable: true,
        type: "text",
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
