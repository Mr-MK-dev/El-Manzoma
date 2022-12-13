<template>
  <div>
    <v-card-title v-if="isAdmin()">
      <v-spacer />
      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة خطة مراجعة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطط المراجعة'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip v-if="hasDeleteAccess()" color="transparent">
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.actionToDetails="{ item }">
        <v-chip icon color="primary" @click="actionRouteToDetails(item)">
          <v-icon>mdi-information-variant</v-icon>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة خطة مراجعة'"
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
  name: "review_plan",
  mounted() {
    this.findItems({});
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
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
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الخطة",
          value: "ReviewPlanDate",
          searchValue: "ReviewPlanDate",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "",
          value: "actionToDetails",
          searchValue: "actionToDetails",
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
          table: "reviewPlanListDetails",
          where: {
            reviewPlanID: item.ID_KEY
          }
        });

        await this.api(`global/delete_all`, {
          table: "reviewPlanList",
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
        saveItem = await this.api(
          `global/${this.plan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "reviewPlanList",
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
        table: "reviewPlanList"
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

    actionRouteToDetails(item) {
      this.$router.push(
        `/review_plan_list_details/${item.ID_KEY}/${this.$route.params.departmentType}`
      );
    }
  }
};
</script>
