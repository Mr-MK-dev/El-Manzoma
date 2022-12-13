<template>
  <div>
    <v-card-title>
      <v-btn @click="actionAdd" large outlined color="primary">
        إضافة شريحة مخالفة
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :wordFile="'/new_commers/distripution_plan'"
      :isExcel="true"
      :title="''"
    >
      <template v-slot:item.totalAfter="{ item }">
        {{ item.totalBefore - item.Leavers }}
      </template>
      <template v-slot:item.totalAfterSupply="{ item }">
        {{
          item.totalBefore -
            item.Leavers +
            item.HighSupply +
            item.AboveAvgSupply +
            item.AvgSupply +
            item.NormalSupply
        }}
      </template>
      <template v-slot:item.percentAfterSupply="{ item }">
        {{
          Math.round(
            ((item.totalBefore -
              item.Leavers +
              item.HighSupply +
              item.AboveAvgSupply +
              item.AvgSupply +
              item.NormalSupply) /
              item.Moratab) *
              100
          )
        }}%
      </template>
      <template v-slot:item.TotalSupply="{ item }">
        {{
          Math.round(
            item.HighSupply +
              item.AboveAvgSupply +
              item.AvgSupply +
              item.NormalSupply
          )
        }}
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="falseLayerObject.model"
      :loading="falseLayerObject.loading"
      :fields="falseLayerHeaders"
      :selects="selects"
      :data="layer"
      @on-submit="addFalseLayer()"
      @on-close="falseLayerObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="imdad"
      @on-submit="saveImdad()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "distriputionpPlanDetails",

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

  mounted() {
    this.init();
    this.getRecuEndDateOptions();
    this.findItems({});
  },

  data: () => ({
    layer: {},
    imdad: {},
    falseLayerObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    totals: {
      deduction: 0,
      Supply: 0
    },
    searchLoading: false,
    selects: {
      RatebLevel: {
        data: constants.ratebLevels
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
          },
          {
            text: "الشريحتين",
            value: "1-2"
          }
        ]
      },
      RatebCategory: constants.SoldierCategory
    },
    falseLayerHeaders: [
      {
        text: "الوحدة",
        value: "Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        required: true,
        sort: 1
      }
    ],
    mainTable: {
      headers: [
        {
          text: "الإمداد",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          readOnly: true,
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
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
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          multiple: true,
          sort: 1
        },
        {
          text: "المرتب",
          value: "Moratab",
          searchValue: "Moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "السياسة",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عليا",
          value: "High",
          searchValue: "High",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "فوق المتوسطة",
          value: "AboveAvg",
          searchValue: "AboveAvg",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "متوسطة",
          value: "Avg",
          searchValue: "Avg",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عادة",
          value: "Normal",
          searchValue: "Normal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الموجود قبل المسرح",
          value: "totalBefore",
          searchValue: "totalBefore",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "مسرج العليا",
          value: "HighLeavers",
          searchValue: "HighLeavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مسرح فوق المتوسط",
          value: "AboveAvgLeavers",
          searchValue: "AboveAvgLeavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "مسرح المتوسطة",
          value: "AvgLeavers",
          searchValue: "AvgLeavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "مسرح العادة",
          value: "NormalLeavers",
          searchValue: "NormalLeavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "إجمالي المسرح",
          value: "Leavers",
          searchValue: "Leavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إجمالي بعد المسرح",
          value: "totalAfter",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم عليا",
          value: "HighSupply",
          searchValue: "HighSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم فوق المتوسطة",
          value: "AboveAvgSupply",
          searchValue: "AboveAvgSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم متوسطة",
          value: "AvgSupply",
          searchValue: "AvgSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "دعم عادة",
          value: "NormalSupply",
          searchValue: "NormalSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "اجمالي الدعم",
          value: "TotalSupply",
          searchValue: "TotalSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "موجود بعد الدعم",
          value: "totalAfterSupply",
          searchValue: "totalAfterSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "النسبة بعد الإمداد",
          value: "percentAfterSupply",
          searchValue: "percentAfterSupply",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  watch: {
    imdad: {
      handler(val) {
        this.$set(
          this.imdad,
          "totalAfterSupply",
          +val.NormalSupply +
            +val.AvgSupply +
            +val.AboveAvgSupply +
            +val.HighSupply +
            +val.totalBefore -
            val.Leavers
        );
        this.$set(
          this.imdad,
          "percentAfterSupply",
          Math.round(
            ((+val.NormalSupply +
              +val.AvgSupply +
              +val.AboveAvgSupply +
              +val.HighSupply +
              +val.totalBefore -
              val.Leavers) /
              val.Moratab) *
              100
          )
        );
      },
      deep: true
    }
  },

  methods: {
    async saveImdad(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api("global/update_one", {
          table: "distriputionPlanStats",
          where: {
            ID_KEY: this.imdad.ID_KEY
          },
          update: this.imdad
        });

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
    async addFalseLayer() {
      this.$set(this.falseLayerObject, "loading", true);

      let list = {};
      await this.api("global/get_one", {
        table: "distriputionPlanList",
        where: { ID_KEY: this.$route.params.id }
      })
        .then(x => {
          list.RecuEndDate = x.data.RecuEndDate;
          let saveItem = this.api("global/create_one", {
            table: "distriputionPlanStats",
            where: {
              UnitID: this.layer.UnitID,
              distriputionPlanID: this.$route.params.id
            }
          });
          if (saveItem) {
            this.$set(this.falseLayerObject, "loading", false);
            this.showSuccess("تم الاضافة بنجاح");
            this.$set(this, "layer", {});
            this.$set(this.falseLayerObject, "model", false);
            this.findItems({});
          } else {
            this.$set(this.falseLayerObject, "loading", false);
            this.showError("حدث خطا اقناء  اضافة البيانات");
            this.$set(this.falseLayerObject, "model", false);
          }
        })
        .catch(error => {
          this.handleError(error);
        })
        .finally(() => {});

      let saveItem;
    },
    actionAdd() {
      this.$set(this.falseLayerObject, "model", true);
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
    async getUnitStats(UnitID) {
      let list = {};
      await this.api("global/get_one", {
        table: "distriputionPlanList",
        where: { ID_KEY: this.$route.params.id }
      })
        .then(x => {
          list.RecuEndDate = x.data.RecuEndDate;
        })
        .catch(error => {
          this.handleError(error);
        })
        .finally(() => {});
      this.api("global/get_all", {
        table: "Soldier",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          WeaponID: 52,
          SoldierCategory: "صف",
          Status: "بالخدمة",
          UnitID: UnitID
        })
      })
        .then(async x => {
          const Mortabat = await this.api("global/get_all", {
            table: "MortabatDuties",
            include: [
              {
                model: "Unit"
              }
            ],
            where: this.cleanObject({
              UnitID: UnitID,
              Category: "صف",
              ServiceType: {
                $not: "راتب عالى"
              }
            })
          });
          const Leavers = await this.api("global/get_all", {
            table: "Soldier",
            include: [
              {
                model: "Unit"
              }
            ],
            where: this.cleanObject({
              UnitID: UnitID,
              WeaponID: 52,
              SoldierCategory: "صف",
              Status: "بالخدمة",
              RecuEndDate: list.RecuEndDate
            })
          });

          let SoldiersGroupedByUnitID = lodash.groupBy(
            x.data,
            ele => ele?.UnitID
          );
          const distripution_report = Object.keys(SoldiersGroupedByUnitID).map(
            key => ({
              distriputionPlanID: this.$route.params.id,
              UnitID: key,
              Moratab: Mortabat.data
                .filter(e => e?.UnitID == key)
                .reduce((prev, curr) => prev + curr?.Moratab, 0),
              Siasa: Mortabat.data
                .filter(e => e?.UnitID == key)
                .reduce((prev, curr) => prev + curr?.Siasa, 0),
              High: SoldiersGroupedByUnitID[key].filter(
                e => e.KnowledgeLevel == "عليا"
              ).length,
              AboveAvg: SoldiersGroupedByUnitID[key].filter(
                e => e.KnowledgeLevel == "فوق متوسطة"
              ).length,
              Avg: SoldiersGroupedByUnitID[key].filter(
                e => e.KnowledgeLevel == "متوسطه"
              ).length,
              Normal: SoldiersGroupedByUnitID[key].filter(
                e => e.KnowledgeLevel == "عادة"
              ).length,
              totalBefore: SoldiersGroupedByUnitID[key].length,
              Leavers: Leavers.data.filter(e => e?.UnitID == key).length,

              HighLeavers: Leavers.data.filter(
                e => e?.UnitID == key && e.KnowledgeLevel == "عليا"
              ).length,
              AboveAvgLeavers: Leavers.data.filter(
                e => e?.UnitID == key && e.KnowledgeLevel == "فوق متوسطة"
              ).length,
              AvgLeavers: Leavers.data.filter(
                e => e?.UnitID == key && e.KnowledgeLevel == "متوسطه"
              ).length,
              NormalLeavers: Leavers.data.filter(
                e => e?.UnitID == key && e.KnowledgeLevel == "عادة"
              ).length
            })
          );
        })
        .catch(error => {
          this.handleError(error);
        })
        .finally(() => {});
    },
    async findItems(filters) {
      console.log("id", this.$route.params.id);
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [""],
        multi = [""];

      where = this.mapToQuery(where, likes, multi);
      try {
        let Soldiers = await this.api("global/get_all", {
          table: "Soldier",
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
        let x = await this.api("global/get_all", {
          table: "distriputionPlanStats",
          include: [
            {
              model: "Unit"
            },
            {
              model: "distriputionPlanList"
            }
          ],
          where: this.cleanObject({
            distriputionPlanID: this.$route.params.id
          })
        });

        let dateBeforeMonth = new Date(
          x.data[0].distriputionPlanList.RecuEndDate
        );
        let dateAftertwoMonth = new Date(
          x.data[0].distriputionPlanList.RecuEndDate
        );
        dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);
        dateAftertwoMonth.setMonth(dateAftertwoMonth.getMonth() + 2);
        console.log("Date before 1 month", this.formatDate(dateBeforeMonth));
        console.log("Date after 1 month", this.formatDate(dateAftertwoMonth));

        let stats = x.data.map(ele => ({
          ...ele,
          preTotal: Soldiers.data.filter(
            e =>
              e.UnitID == ele.UnitID &&
              e.RecuStage != ele.distriputionPlanList.RecuStage
          ).length,
          Moratab: Mortabat.data
            .filter(e => e.UnitID == ele.UnitID)
            .reduce((prev, curr) => prev + curr.Moratab, 0),
          Siasa: Mortabat.data
            .filter(e => e.UnitID == ele.UnitID)
            .reduce((prev, curr) => prev + curr.Siasa, 0),
          High: Soldiers.data.filter(
            e => e.UnitID == ele.UnitID && e.KnowledgeLevel == "عليا"&&
                e.RecuEndDate > this.formatDate(dateBeforeMonth)
          ).length,
          AboveAvg: Soldiers.data.filter(
            e => e.UnitID == ele.UnitID && e.KnowledgeLevel == "فوق متوسطة"&&
                e.RecuEndDate > this.formatDate(dateBeforeMonth)
          ).length,
          Avg: Soldiers.data.filter(
            e => e.UnitID == ele.UnitID && e.KnowledgeLevel == "متوسطه"&&
                e.RecuEndDate > this.formatDate(dateBeforeMonth)
          ).length,
          Normal: Soldiers.data.filter(
            e => e.UnitID == ele.UnitID && e.KnowledgeLevel == "عادة" &&
                e.RecuEndDate > this.formatDate(dateBeforeMonth)
          ).length,
          totalBefore: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              el.RecuEndDate > this.formatDate(dateBeforeMonth)
          ).length,
          HighLeavers: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              el.KnowledgeLevel == "عليا" &&
              (el.RecuEndDate == ele.distriputionPlanList.RecuEndDate ||
                el.RecuEndDate == this.formatDate(dateAftertwoMonth))
          ).length,
          AboveAvgLeavers: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              el.KnowledgeLevel == "فوق متوسطة" &&
              (el.RecuEndDate == ele.distriputionPlanList.RecuEndDate ||
                el.RecuEndDate == this.formatDate(dateAftertwoMonth))
          ).length,
          AvgLeavers: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              el.KnowledgeLevel == "متوسطه" &&
              (el.RecuEndDate == ele.distriputionPlanList.RecuEndDate ||
                el.RecuEndDate == this.formatDate(dateAftertwoMonth))
          ).length,
          NormalLeavers: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              el.KnowledgeLevel == "عادة" &&
              (el.RecuEndDate == ele.distriputionPlanList.RecuEndDate ||
                el.RecuEndDate == this.formatDate(dateAftertwoMonth))
          ).length,
          Leavers: Soldiers.data.filter(
            el =>
              el.UnitID == ele.UnitID &&
              (el.RecuEndDate == ele.distriputionPlanList.RecuEndDate ||
                el.RecuEndDate == this.formatDate(dateAftertwoMonth))
          ).length
        }));
        console.log("data", stats);
        this.$set(this.mainTable, "items", stats);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "imdad", {
        ...item
      });
    }
  }
};
</script>
