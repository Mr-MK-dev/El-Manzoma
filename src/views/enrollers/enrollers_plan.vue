<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      :selects="selects"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title=""
      addBtnTitle="إضافة خطة توزيع "
    />
    <!-- <editor-dialog-bulider
      title="بيانات المقترح"
      :open="showFillDialog"
      @on-close="showFillDialog = false"
      :loading="loading"
      :fields="addOptions"
      :data="FillOption"
      @on-submit="fillPlanData()"
    />
    <editor-dialog-bulider /> -->

    <v-card-title v-if="id">
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة مخطط الحاق
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطط الاحاق'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip v-if="hasDeleteAccess()" color="transparent">
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.fillTransferList="{ item }">
        <v-chip
          icon
          color="primary"
          @click="
            item.isFilled == 1 ? actionRouteToDetails(item) : fillPlanData(item)
          "
        >
          <v-icon v-if="item.isFilled">mdi-information-variant</v-icon>
          <v-icon v-if="!item.isFilled">mdi-arrow-up-bold-box-outline</v-icon>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة خطة الحاق'"
      :selects="selects"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :data="plan"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "enrollers_plan",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    plan: {},
    FillOption: {},

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
    // addOptions: [
    //   {
    //     text: "المدة من",
    //     value: "TimeStart",
    //     searchValue: "TimeStart",
    //     sortable: false,
    //     type: "text",
    //     inSearch: false,
    //     inTable: false,
    //     inModel: true,
    //     sort: 1
    //   }
    //   // {
    //   //   text: "المدة الى",
    //   //   value: "TimeTo",
    //   //   searchValue: "TimeTo",
    //   //   sortable: false,
    //   //   type: "text",
    //   //   inSearch: false,
    //   //   inTable: false,
    //   //   inModel: true,
    //   //   sort: 1
    //   // },
    // ],
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
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
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
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
          required: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "fillTransferList",
          searchValue: "fillTransferList",
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
          table: "enrollersPlanDetails",
          where: {
            EnrollersPlanID: item.ID_KEY
          }
        });

        await this.api(`global/delete_all`, {
          table: "enrollersPlanList",
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
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        this.$set(
          this.plan,
          "Name",
          " خطة الحاق المرحلة " + this.plan.RecuStage
        );
        saveItem = await this.api(
          `global/${this.plan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "enrollersPlanList",
            where: !this.plan.isEdit
              ? this.plan
              : {
                  ID_KEY: this.plan.ID_KEY
                },
            update: this.plan
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
    async fillPlanData(item) {
      this.$set(this, "loading", true);
      let finish;
      this.api("global/get_all", {
        table: "followerwork",
        where: this.cleanObject({})
      })
        .then(async x => {
          let workplacesGroupedByID = lodash.groupBy(
            x.data,
            ele => ele?.idwork
          );

          const enrollers_plan_report = Object.keys(workplacesGroupedByID).map(
            key => ({
              EnrollersPlanID: item.ID_KEY,
              WorkPlaceID: key
            })
          );

          for (let i = 0; i < enrollers_plan_report.length; i++) {
            finish = await this.api("global/create_one", {
              table: "enrollersPlanDetails",
              where: enrollers_plan_report[i]
            });
          }
          if (finish) {
            await this.api("global/update_one", {
              table: "enrollersPlanList",
              where: { ID_KEY: item.ID_KEY },
              update: { isFilled: true }
            });
            this.$set(this, "loading", false);
            this.$set(this, "showFillDialog", false);
            this.showSuccess("تم إضافة بيانات الخطه");
            this.findItems({});
          } else {
            this.$set(this, "loading", false);
            this.$set(this, "showFillDialog", false);

            this.showError("تعذر حفظ  في قاعدة البيانات");
          }
        })
        .catch(error => {
          console.log("error", error);
          this.showError("تعذر حفظ  في قاعدة البيانات");
        })
        .finally(() => {});
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        dates = [],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      this.api("global/get_all", {
        table: "enrollersPlanList"
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
      this.$set(this, "plan", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionFillData(item) {
      this.$set(this, "showFillDialog", true);
      this.$set(this, "plan", {
        ...item
      });
    },
    actionRouteToDetails(item) {
      this.$router.push(`/enrollers_plan_details/${item.ID_KEY}`);
    }
  }
};
</script>
