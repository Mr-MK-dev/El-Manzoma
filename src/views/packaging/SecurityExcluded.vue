<template>
  <div>

    <v-btn @click="actionAdd()" large outlined color="primary">
      اضافة فرد مستيعد امنيا
    </v-btn>

    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'المستبعدين أمنيا'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.SecurityExcludedFromPackaging="{ item }">
        <v-chip :color="item.SecurityExcludedFromPackaging == 1 ? 'success' : 'error'">
          {{ item.SecurityExcludedFromPackaging ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
        :title="'اضافة فرد مستبعد أمنيا'"
        :open="createdObject.model"
        :loading="searchLoading"
        :fields="mainTable.headers"
        :data="securityExcluded"
        @on-close="createdObject.model = false"
        @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "SecurityExcluded",
  props: {},
  mounted() {
    this.findItems({});
  },
  data: () => ({
    securityExcluded: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    showFillDialog: false,

    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "City.City",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }, {
          text: "مستبعد أمنيا",
          value: "SecurityExcludedFromPackaging",
          searchValue: "SecurityExcludedFromPackaging",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toPlans",
          searchValue: "toPlans",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toCompletePlan",
          searchValue: "toCompletePlan",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "",
          value: "toCompensationLossPlan",
          searchValue: "toCompensationLossPlan",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من حذف هذا الشخص من خطة التعبئة`, {
        title: ``
      }).then(async res => {
        if (res) {
          let updateItem = await this.api(`global/update_one`, {
            table: "Soldier",
            where: {
              ID : item.ID
            },
            update :{
              SecurityExcludedFromPackaging :false
            }
          });

          if (updateItem.ok) {
            this.findItems({});
          } else {
            console.log("failed");
          }
        }
      });
    },

    async saveItem(edirableFromTableItem) {
      try {

        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
            `global/update_one`,
            {
              table: "Soldier",
              where: {
                ID: this.securityExcluded.ID
              },
              update: {
                SecurityExcludedFromPackaging: true
              }
            }
        );


        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters
          },
          likes = ["ID"],
          dates = [],
          multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      this.api("global/get_all", {
        table: "Soldier",
        where: {
          SecurityExcludedFromPackaging: true
        },
        include: [
          {model: "Unit"}
        ]
      })
          .then(x => {
            this.$set(this.mainTable, "items", x.data);
          })
          .catch(error => {
            console.log("error", error);
            this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          })
          .finally(() => {
            this.$set(this, "searchLoading", false);
          });
    },
    async actionAdd() {
      this.$set(this, "securityExcluded", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

  }
};
</script>
