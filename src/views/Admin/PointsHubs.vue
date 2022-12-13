<template>
  <div>
    <search-bulider
      v-if="!parentFilters"
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في السرايا"
      addBtnTitle="إضافة سرية"
    />
    <v-card>
      <v-progress-circular
        v-if="searchLoading"
        indeterminate
        color="success"
      ></v-progress-circular>
      <v-card-title>
        <v-btn
          v-if="hasEditAccess() && parentFilters"
          @click="actionAdd()"
          large
          outlined
          color="primary"
        >
          إضافة سرية
        </v-btn>
      </v-card-title>
    </v-card>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'السرايا'"
    >
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.actionsStart="{ item }"
      >
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="openPointsModel(item)" color="primary">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn icon @click="deleteItem(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isHeadQuarter="{ item }">
        <v-chip :color="item.isHeadQuarter == 1 ? 'success' : 'error'">
          {{ item.isHeadQuarter ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.isBian="{ item }">
        <v-chip :color="item.isBian == 1 ? 'success' : 'error'">
          {{ item.isBian ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog
      persistent
      v-model="PointsModel.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="PointsModel.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <pointsView ref="pointsView"> </pointsView>

          <!-- <jobsMoratab ref="jobs" :parentFilters="true"></jobsMoratab> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="pointHub"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

const PointsView = require("./Points");

export default {
  name: "PointHub",
  props: {
    parentFilters: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
  },
  components: {
    PointsView: () => import("@/views/Admin/Points.vue")
  },
  data: () => ({
    pointHub: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    PointsModel: {
      model: false
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "قيادة كتيبة",
          value: "isHeadQuarter",
          searchValue: "isHeadQuarter",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "بيان ملحقين/مهمة تدربية",
          value: "isBian",
          searchValue: "isBian",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        // {
        //   text: "عدد الظباط",
        //   value: "OfficerCount",
        //   searchValue: "OfficerCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        // {
        //   text: "عدد الجنود",
        //   value: "SoldierCount",
        //   searchValue: "SoldierCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        // {
        //   text: "عدد الراتب العالي",
        //   value: "RatebCount",
        //   searchValue: "RatebCount",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        {
          text: "الوحدة التابعة لها",
          value: "Unit.Unit",
          searchValue: "Unit_ID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "pointHub",
    selects: {
      Unit_ID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  methods: {
    async openPointsModel(item) {
      this.$set(this.PointsModel, "model", true);
      if (this.$refs.pointsView) {
        this.$refs.pointsView.mountChildModel(item.ID_KEY);
      } else {
        setTimeout(() => {
          this.openPointsModel(item);
        }, 2000);
      }
    },
    async deleteItem(item) {
      try {
        await this.api(`global/delete_all`, {
          table: "PointHub",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
        this.showSuccess("تم الحذف بنجاح");
        this.findItems(this.search);
      } catch (error) {
        this.showError("تعذر الحذف");
        console.log(error);
      }
    },
    async saveItem(edirableFromTableItem) {
      if (!this.pointHub.Name) {
        return this.showError("برجاء اضافة اسم");
      }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.pointHub.isEdit ? "update_one" : "create_one"}`,
          {
            table: "PointHub",
            where: !this.pointHub.isEdit
              ? this.pointHub
              : {
                  ID_KEY: this.pointHub.ID_KEY
                },
            update: this.pointHub
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems(this.search);
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      try {
        this.search = filters;
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = {
            ...this.search,
            ...filters
          },
          likes = ["ID_KEY"],
          multi = [];
        where = this.mapToQuery(where, likes, multi);
        const x = await this.api("global/get_all", {
          table: "PointHub",
          include: [
            {
              model: "Unit"
            }
          ],
          where
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "pointHub", {
        Unit_ID: this.pointHub.Unit_ID,
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "pointHub", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
