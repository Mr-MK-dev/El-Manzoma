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
        اضافة نشرة الانتقالات
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :isExcel="true"
      :title="'خطط التوزيع'"
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
          v-if="isAdmin() || hasEditAccess()"
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
      <template v-slot:item.toComparison="{ item }" icon color="primary">
        <v-chip @click="routeToComparison(item)">
          <v-icon>mdi-information-variant</v-icon>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'اضافة خطة توزيع'"
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
  name: "distripution_plan",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.init();
    this.getRecuEndDateOptions();
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
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي",
            value: "1"
          },
          {
            text: "الشريحة الثانية",
            value: "2"
          }
        ]
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
          text: "لشريحة",
          value: "SupplyLayer",
          searchValue: "SupplyLayer",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "دفعة التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
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
          inModel: false,
          sort: 1
        },
        {
          text: "تفاصيل المخطط",
          value: "fillTransferList",
          searchValue: "fillTransferList",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "مقارنة المخطط بالموجود الفعلي المرحلة",
          value: "toComparison",
          searchValue: "toComparison",
          sortable: true,
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
          table: "distriputionPlanStats",
          where: {
            distriputionPlanID: item.ID_KEY
          }
        });

        await this.api(`global/delete_all`, {
          table: "distriputionPlanList",
          where: {
            ID_KEY: item.ID_KEY
          }
        });

        this.showSuccess("تم الحذف بنجاح");
        this.findItems({});
      } catch (error) {
        this.showError("تعذر الحذف");
        this.handleError(error);
      }
    },
    routeToComparison(item) {
      this.$router.push(
        `DistriputionComparison/${item.ID_KEY}/${item.RecuStage}`
      );
    },
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where Status like N'%بالخدمة%'  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      // this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
      // this.allUnites = [...this.selects.unitIds.data];
    },
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        this.$set(
          this.plan,
          "Name",
          " خطة توزيع المرحلة " + this.plan.RecuStage
        );
        saveItem = await this.api(
          `global/${this.plan.isEdit ? "update_one" : "create_one"}`,
          {
            table: "distriputionPlanList",
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
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async fillPlanData(item) {
      this.$set(this, "loading", true);
      let finish;
      let dateBeforeMonth = new Date(item.RecuEndDate);
      let dateAftertwoMonth = new Date(item.RecuEndDate);
      dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);
      dateAftertwoMonth.setMonth(dateAftertwoMonth.getMonth() + 2);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Unit",
              where: this.cleanObject({
                $or: [
                  {
                    SupplyLayer: "1-2"
                  },
                  {
                    SupplyLayer: item.SupplyLayer
                  }
                ]
              })
            }
          ],
          where: this.cleanObject({
            WeaponID: 52,
            SoldierCategory: "صف",
            Status: "بالخدمة"
          })
        });
        const Mortabat = await this.api("global/get_all", {
          table: "MortabatDuties",
          include: [
            {
              model: "Unit"
            }
          ],
          where: this.cleanObject({
            WeaponID: 52,
            Category: "صف",
            ServiceType: {
              $ne: "راتب عالى"
            }
          })
        });
        console.log("Mortabat", Mortabat);
        const Leavers = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Unit",
              where: this.cleanObject({
                $or: [
                  {
                    SupplyLayer: "1-2"
                  },
                  {
                    SupplyLayer: item.SupplyLayer
                  }
                ]
              })
            }
          ],
          where: this.cleanObject({
            SoldierCategory: "صف",
            Status: "بالخدمة",
            RecuEndDate: [item.RecuEndDate, dateAftertwoMonth]
          })
        });

        let SoldiersGroupedByUnitID = lodash.groupBy(
          x.data,
          ele => ele?.UnitID
        );
        const distripution_report = Object.keys(SoldiersGroupedByUnitID).map(
          key => ({
            distriputionPlanID: item.ID_KEY,
            UnitID: key
            // Moratab: Mortabat.data
            //   .filter(e => e.UnitID == key)
            //   .reduce((prev, curr) => prev + curr.Moratab, 0),
            // Siasa: Mortabat.data
            //   .filter(e => e.UnitID == key)
            //   .reduce((prev, curr) => prev + curr.Siasa, 0),
            // High: SoldiersGroupedByUnitID[key].filter(
            //   e => e.KnowledgeLevel == "عليا"
            // ).length,
            // AboveAvg: SoldiersGroupedByUnitID[key].filter(
            //   e => e.KnowledgeLevel == "فوق متوسطة"
            // ).length,
            // Avg: SoldiersGroupedByUnitID[key].filter(
            //   e => e.KnowledgeLevel == "متوسطه"
            // ).length,
            // Normal: SoldiersGroupedByUnitID[key].filter(
            //   e => e.KnowledgeLevel == "عادة"
            // ).length,
            // totalBefore: SoldiersGroupedByUnitID[key].length,
            // Leavers: Leavers.data.filter(e => e?.UnitID == key).length,

            // HighLeavers: Leavers.data.filter(
            //   e => e?.UnitID == key && e.KnowledgeLevel == "عليا"
            // ).length,
            // AboveAvgLeavers: Leavers.data.filter(
            //   e => e?.UnitID == key && e.KnowledgeLevel == "فوق متوسطة"
            // ).length,
            // AvgLeavers: Leavers.data.filter(
            //   e => e?.UnitID == key && e.KnowledgeLevel == "متوسطه"
            // ).length,
            // NormalLeavers: Leavers.data.filter(
            //   e => e?.UnitID == key && e.KnowledgeLevel == "عادة"
            // ).length
          })
        );

        console.log(distripution_report);
        for (let i = 0; i < distripution_report.length; i++) {
          finish = await this.api("global/create_one", {
            table: "distriputionPlanStats",
            where: distripution_report[i]
          });
        }
        if (finish) {
          await this.api("global/update_one", {
            table: "distriputionPlanList",
            where: { ID_KEY: item.ID_KEY },
            update: { isFilled: true }
          });
          this.$set(this, "loading", false);
          this.$set(this, "showFillDialog", false);
          this.showSuccess("تم إضافة بيانات الخطه");
          await this.findItems({});
        } else {
          this.$set(this, "loading", false);
          this.$set(this, "showFillDialog", false);

          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
      } catch (error) {
        this.handleError(error);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        dates = [],
        multi = [];

      where = this.mapToQuery(where, likes, multi, dates);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "distriputionPlanList"
        });
        let data = x.data.map(ele => ({
          ...ele
        }));
        this.$set(this.mainTable, "items", data);

        this.$set(this.mainTable, "printer", {
          cons: [...data],
          excelKey: "cons",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async actionAdd() {
      this.$set(this, "plan", {
        isEdit: false
      });
      if (this.id) {
        await this.findOne(this.id);
      }
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
      this.$router.push(`/distriputionpPlanDetails/${item.ID_KEY}`);
    }
  }
};
</script>
