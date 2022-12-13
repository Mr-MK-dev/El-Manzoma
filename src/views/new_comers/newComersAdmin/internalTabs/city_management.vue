<template>
  <div>
    <v-btn
      @click="actionAdd()"
      color="primary"
      large
      outlined
      :clearOption="true"
    >
      إضافة محافظة
    </v-btn>

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
          <!--          <v-btn icon @click="actionDelete(item)" color="red">-->
          <!--            <v-icon>mdi-trash-can</v-icon>-->
          <!--          </v-btn>-->
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title="بيانات المحافطة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="city"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("@/Constant").default;

export default {
  name: "city_management",

  mounted() {
    this.init();
    this.handleSearch();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    city: {},
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
        text: "المحافظة",
        value: "City",
        searchValue: "City",
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
        text: "منطقة التجنيد",
        value: "Rigion",
        searchValue: "Rigion",
        sortable: true,
        type: "select",
        inSearch: true,
        multiple: false,
        inTable: true,
        required: true,
        inModel: true,
        sort: 1
      }
    ],
    selects: {
      Rigion: {
        table: "City",
        value: "Rigion",
        text: "Rigion"
      }
    }
  }),

  methods: {
    handleSearch(data) {
      this.search = data;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...data },
        likes = [],
        multi = [];
      where = this.mapToQuery(where, likes, multi);

      this.api("global/get_all", {
        table: "City",
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
      this.$set(this, "showAddDialog", true);
      this.$set(this, "city", {
        isEdit: false,
        // we need to fix this shit latter and fuck who write this code and this table
        CityID: this.items.length + 1
      });
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "City",
            where: {
              CityID: item.CityID
            }
          });
          this.handleSearch();
        }
      });
    },

    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "city", { ...item, isEdit: true });
    },

    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.city.CityID ? `global/create_one` : `global/update_one`,
          {
            table: "City",
            where: this.city.CityID
              ? {
                  CityID: this.city.CityID
                }
              : {
                  ...this.city
                },
            update: {
              ...this.city
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
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
