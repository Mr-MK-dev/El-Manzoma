<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة العائلة
      </v-btn>
    </v-card-title>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'العائلة'">
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      @on-add="actionAdd()"
      addBtnTitle="إضافة عائلة"
      title="بيانات العائلة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="family"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>
<script>
const constants = require("@/Constant").default;

export default {
  name: "family",
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
    this.init();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "Family",
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
      this.family.SoliderID = this.conscripte.ID;
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.family.ID ? `global/create_one` : `global/update_one`,
          {
            table: "Family",
            where: this.family.ID
              ? {
                  ID: this.family.SoliderID
                }
              : {
                  ...this.family
                },
            update: {
              ...this.family
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
    family: {},
    selects: {
      Ya3wl: {
        value: "text",
        text: "text",
        data: ["يعول", " لا يعول"]
      }
    },
    headers: [
      {
        text: "الإسم",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "درجة القرابة",
        value: "Drga",
        searchValue: "Drga",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التليفون",
        value: "Tel",
        searchValue: "Tel",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "العنوان",
        value: "Address",
        searchValue: "Address",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "يعول",
        value: "Ya3wl",
        searchValue: "Ya3wl",
        sortable: true,
        type: "select",
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
