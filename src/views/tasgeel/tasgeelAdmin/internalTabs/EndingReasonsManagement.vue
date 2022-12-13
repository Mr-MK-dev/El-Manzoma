<template>
  <div>
    <v-card-title>
      {{ title }}

      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        إضافة سبب إنتهاء
      </v-btn>
    </v-card-title>

    <table-bulider :headers="headers" :items="items" :title="''">
      <template v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
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
      title="بيانات أسباب الأنتهاء"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Reasons"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
export default {
  name: "EndingReasonsManagement",

  async mounted() {
    this.init();
    await this.handleSearch({});
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Reasons: {},
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
        text: "سبب الإنهاء",
        value: "Reason",
        searchValue: "Reason",
        sortable: true,
        type: "textarea",
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
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Reasons", { ...item, isEdit: true });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "EndingReasons",
            where: {
              ID: item.ID
            }
          });
          await this.handleSearch();
        }
      });
    },
    async handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = [],
        multi = [];
      where = this.mapToQuery(where, likes, multi);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "EndingReasons",
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
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },

    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.Reasons = {};
    },
    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.Reasons.ID ? `global/create_one` : `global/update_one`,
          {
            table: "EndingReasons",
            where: this.Reasons.ID
              ? {
                  ID: this.Reasons.ID
                }
              : {
                  ...this.Reasons
                },
            update: {
              ...this.Reasons
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
        this.$set(this, "loading", false);

        this.$set(this, "Reasons", {});
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  }
};
</script>
