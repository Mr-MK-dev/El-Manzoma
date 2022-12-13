<template>
  <div>

    <v-card-title >
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة مكان عمل للزيادة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'أماكن العمل'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip v-if="hasDeleteAccess()" color="transparent">
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.addInternals="{ item }">
        <div style="display: flex; flex-basis: auto;">
          <v-btn
              class="mx-auto"
              @click="actionRouteToWorkPlaceAdditionsFollowers(item)"
              large
              outlined
              color="primary"
          >
            عرض أفراد المكان
          </v-btn>
        </div>




      </template>

    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة مكان عمل للزيادة'"
      :selects="selects"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="workPlaceAddition"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "WorkPlaceAdditions",

  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    workPlaceAddition: {},


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
    selects: {
      WorkPlaceID: {
        table: "followerwork",
        value: "idwork",
        text: "workplace"
      }
    },
    mainTable: {
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
          text: "مكان العمل",
          value: "followerwork.workplace",
          searchValue: "WorkPlaceID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "",
          value: "addInternals",
          searchValue: "addInternals",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),

  methods: {
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "AdditionsWorkPlacesFollowers",
          where: {
            WorkPlaceAdditionsID: item.ID_KEY
          }
        });

        await this.api(`global/delete_all`, {
          table: "WorkPlacesAdditions",
          where: {
            ID_KEY: item.ID_KEY
          }
        });

        this.showSuccess("تم الحذف بنجاح");
        this.findItems({});
      } catch (error) {
        this.showError("تعذر الحذف");
        console.log(error);
      }
    },

    async saveItem(edirableFromTableItem) {
      try {

        if(this.mainTable.items.find(ele=>ele.WorkPlaceID == this.workPlaceAddition.WorkPlaceID) !=null){
          this.showError("هذا المكان مسجل من قبل")
          return ;
        }
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/create_one`,
          {
            table: "WorkPlacesAdditions",
            where: this.workPlaceAddition,
            update: this.workPlaceAddition
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

      this.api("global/get_all", {
        table: "WorkPlacesAdditions",
        include :[{
          model :"followerwork"
        }]
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          this.$set(this.mainTable, "items", data);
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
      this.$set(this, "workPlaceAddition", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionRouteToWorkPlaceAdditionsFollowers(item) {
      this.$router.push(`/AdditionsWorkPlacesFollowers/${item.ID_KEY}`);
    }
  }
};
</script>
