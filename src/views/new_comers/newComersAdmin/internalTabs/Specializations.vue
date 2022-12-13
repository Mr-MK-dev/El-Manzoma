<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :clearOption="true"
      @on-search="data => handleSearch(data)"
      @on-add="actionAdd()"
      :loading="searchLoading"
      title="بحث متقدم في التخصصات "
      addBtnTitle="إضافة تخصص"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات التخصص"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Specialization"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../../Constant").default;

export default {
  name: "Specialization",

  mounted() {
    this.init();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Specialization: {
      isConfirmed: false
    },
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
        text: "التخصص",
        value: "Specialization",
        searchValue: "Specialization",
        sortable: true,
        type: "text",
        inSearch: true,
        multiple: false,
        inTable: true,
        required: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {},
    oldName: null
  }),

  methods: {
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = ["ID"],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "Specialization",
        where
      })
        .then(x => {
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
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async actionAdd() {
      this.$set(this, "item", {});
      this.$set(this, "showAddDialog", true);
    },

    async actionEdit(item) {
      this.oldName = item.Specialization;
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Specialization", { ...item, isEdit: true });
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Specialization",
            where: {
              IDKey: item.IDKey
            }
          });
          this.handleSearch({});
        }
      });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.Specialization.IDKey
            ? `global/create_one`
            : `global/update_one`,
          {
            table: "Specialization",
            where: this.Specialization.IDKey
              ? {
                  IDKey: this.Specialization.IDKey
                }
              : {
                  ...this.Specialization
                },
            update: {
              ...this.Specialization
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          console.log(this.Specialization);
          if (this.Specialization.IDKey) {
            try {
              await this.api("global/queryRunners", {
                query: `UPDATE Soldier set Specialization = N'${this.Specialization.Specialization}' WHERE Specialization = N'${this.oldName}'`
              });
            } catch (e) {
              console.log(e);
            }
          }
          this.showSuccess("تم حفظ ");
          this.handleSearch(this.search);
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
