<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      large
      outlined
      color="primary"
      :clearOption="true"
    >
      إضافة مصدق
    </v-btn>

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-if="isAdmin()" v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات المصدق"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Certificator"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "Certificator",

  async mounted() {
    this.init();
    await this.handleSearch();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Certificator: {},
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
        text: "المصدق",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: false,
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
    async handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let x;
      let where = { ...data },
        likes = [],
        multi = [];
      where = this.mapToQuery(where, likes, multi);
      try {
        x = await this.api("global/get_all", {
          table: "Certificators",
          where
        });

        let data = x.data.map(ele => ({
            ...ele
          })),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inSearch)
          };

        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
        this.$set(this, "searchLoading", false);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.$set(this, "searchLoading", false);
      }
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.Certificator.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "Certificators",
            where: this.Certificator.ID_KEY
              ? {
                  ID_KEY: this.Certificator.ID_KEY
                }
              : {
                  ...this.Certificator
                },
            update: {
              ...this.Certificator
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.handleSearch(this.search);
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
        this.$set(this, "Certificator", {});
      }
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "Certificators",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            await this.handleSearch();
          }
        })
        .catch(err => {
          this.handleError(err);
          this.showError("تعذر حفظ  في قاعدة البيانات");
        });
    }
  }
};
</script>
