<template>
  <div>
    <table-bulider :headers="headers" :items="items" :title="''">
      <template v-if="hasEditAccess()" v-slot:item.editor="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isSpecial="{ item }">
        <v-chip :color="item.isSpecial == 1 ? 'success' : 'error'">
          {{ item.isSpecial ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.isHardWork="{ item }">
        <v-chip :color="item.isHardWork == 1 ? 'success' : 'error'">
          {{ item.isHardWork ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      title="بيانات تقييم الوحدات"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="Rate"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../../Constant").default;

export default {
  name: "Rate",

  mounted() {
    this.init();
    this.findItems();
  },

  data: () => ({
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    Rate: {},
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
        text: "اسم الوحدة",
        value: "Unit",
        searchValue: "Unit",
        sortable: true,
        type: "text",
        inSearch: false,
        multiple: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      },
      {
        text: "مميزة",
        value: "isSpecial",
        searchValue: "isSpecial",
        sortable: true,
        type: "checkbox",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "خدمة صعبة",
        value: "isHardWork",
        searchValue: "isHardWork",
        sortable: true,
        type: "checkbox",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "نوع المجهود المادي",
        value: "extraProfitType",
        searchValue: "extraProfitType",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    selects: {
      extraProfitType: {
        data: [
          {
            text: "مجهود عالي"
          },
          {
            text: "مجهود متوسط"
          },
          {
            text: "بدون مجهود"
          }
        ]
      }
    }
  }),

  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "Rate", { ...item, isEdit: true });
    },
    findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.api("global/get_all", {
        table: "Unit"
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
      this.Rate = {};
    },
    async saveItem() {
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.Rate.UnitID ? `global/create_one` : `global/update_one`,
          {
            table: "Unit",
            where: this.Rate.UnitID
              ? {
                  UnitID: this.Rate.UnitID
                }
              : {
                  ...this.Rate
                },
            update: {
              ...this.Rate
            }
          }
        );
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems();
          this.Rate = {};
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
