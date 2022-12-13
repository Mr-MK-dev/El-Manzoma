<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      large
      outlined
      color="primary"
    >
      إضافة شرط التناسق
    </v-btn>

    <table-bulider :headers="headers" :items="items" :title="''">
      <template v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess"
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
            color="red"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات شروط التناسق"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :data="FittingRule"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../../Constant").default;

export default {
  name: "FittingRule",

  mounted() {
    this.init();
    this.findItems();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    FittingRule: {},
    items: [],
    headers: [
      {
        text: "",
        value: "editor",
        searchValue: "editor",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "السن من",
        value: "AgeFrom",
        searchValue: "AgeFrom",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "السن الى",
        value: "AgeTo",
        searchValue: "AgeTo",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "الفرق من",
        value: "DifferenceFrom",
        searchValue: "DifferenceFrom",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "الفرق الى",
        value: "DifferenceTo",
        searchValue: "DifferenceTo",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    selects: {}
  }),

  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "FittingRule", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "FittingRules",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems();
        }
      });
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.api("global/get_all", {
        table: "FittingRules"
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));

          this.$set(this, "items", data);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.FittingRule = {};
    },
    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.FittingRule.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "FittingRules",
            where: this.FittingRule.ID_KEY
              ? {
                  ID_KEY: this.FittingRule.ID_KEY
                }
              : {
                  ...this.FittingRule
                },
            update: {
              ...this.FittingRule
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
          this.FittingRule = {};
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
  }
};
</script>
