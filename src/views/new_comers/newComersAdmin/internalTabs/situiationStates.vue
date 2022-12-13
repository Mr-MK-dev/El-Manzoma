<template>
  <div>
    <v-card-title>
      <v-spacer />
      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة موقف
      </v-btn>
    </v-card-title>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'المواقف'">
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      @on-add="actionAdd()"
      addBtnTitle="إضافة موقف"
      title="بيانات المواقف"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :data="situation"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "SituationStates",
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
        table: "EffectSituationStates"
      });
      this.items = result.data;
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.situation.SituationID
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "EffectSituationStates",
            where: this.situation.SituationID
              ? {
                  SituationID: this.situation.SituationID
                }
              : {
                  ...this.situation
                },
            update: {
              ...this.situation
            }
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
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
    situation: {},
    headers: [
      {
        text: "الموقف",
        value: "Situation",
        searchValue: "Situation",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    search: ""
  })
};
</script>
