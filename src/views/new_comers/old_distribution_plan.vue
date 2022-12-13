<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
      :addButton="true"
      :clearOption="true"
      addBtnTitle="إضافة شريحة مخالفة"
    />

    <v-card class="mt-8" v-if="items.length > 0">
      <v-card-title>
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="items.length == 0"
          :data="printer"
          :fab="false"
        ></printer-menu>
      </v-card-title>
      <v-divider></v-divider>
      <v-data-table
        :headers="headers.filter(h => h.inTable)"
        :items="items"
        hide-default-header
        fixed-header
        multi-sort
        class="my-awesome-table"
        :items-per-page="120"
        :group-by="search.groubBy"
      >
        <template v-slot:header="table">
          <table-header-filters
            :items="items"
            :table="table"
            :filters.sync="tableFilters"
          ></table-header-filters>
        </template>
        <template v-slot:footer="table">
          <table-footer-filters
            :filters.sync="tableFilters"
            :table="table"
          ></table-footer-filters>
        </template>
        <template v-slot:group.header="{ items, isOpen, toggle }">
          <th colspan="30">
            <v-icon @click="toggle"
              >{{ isOpen ? "mdi-minus" : "mdi-plus" }}
            </v-icon>
            {{
              search.groubBy == "Unit.Directionforunit"
                ? items[0]["Unit"]["Directionforunit"]
                : items[0][search.groubBy]
            }}
          </th>
        </template>
        <template v-slot:item.actionsStart="{ item }">
          <v-chip class="transparent">
            <v-btn icon @click="handleClick(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="newDist.model"
      :loading="newDist.loading"
      :fields="newDist.headers"
      :selects="selects"
      :data="newDistItem"
      @on-close="newDist.model = false"
      @on-submit="addNew()"
    >
    </editor-dialog-bulider>

    <editor-dialog-bulider
      :open="copyModel.model"
      :loading="copyModel.loading"
      :fields="copyModel.headers"
      :selects="selects"
      :data="copyModelItem"
      @on-close="copyModel.model = false"
      @on-submit="copyOne()"
      title="نسخ معلومات مقترح سابق"
    >
    </editor-dialog-bulider>

    <editor-dialog-bulider
      :open="rowEditModel.model"
      :loading="rowEditModel.loading"
      :fields="headers"
      :selects="selects"
      :data="rowItem"
      @on-close="rowEditModel.model = false"
      @on-submit="save()"
      title="تعديل مقترج توزيع الوحدة"
    >
    </editor-dialog-bulider>
  </div>
</template>

<style>
.my-awesome-table thead th span :first-of-type {
  width: 300px;
  display: flex !important;
}
</style>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "distributed_suggest",
  mounted() {
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  watch: {
    "rowItem.High"(newValue) {
      this.calculateRawValues();
    },
    "rowItem.AboveAvg"(newValue) {
      this.calculateRawValues();
    },
    "rowItem.Avg"(newValue) {
      this.calculateRawValues();
    },
    "rowItem.Normal"(newValue) {
      this.calculateRawValues();
    }
  },
  data: () => ({
    newDistItem: {},
    copyModelItem: {},
    rowItem: {},
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    newDist: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {},
      headers: [
        {
          text: "الوحدة",
          value: "UnitID",
          searchValue: "UnitID",
          sortable: true,
          inEdit: false,
          type: "select",
          inModel: true,
          cols: 3,
          sort: 2
        }
      ]
    },
    copyModel: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {},
      headers: []
    },
    rowEditModel: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {
      groubBy: "Unit.Directionforunit"
    },
    searchLoading: false,
    headers: [
      {
        text: "",
        value: "actionsStart",
        searchValue: "actionsStart",
        sortable: false,
        inTable: true,
        sort: 0
      },
      {
        text: "الاتجاه",
        value: "Unit.Directionforunit",
        sortable: true,
        inEdit: false,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الوحدة",
        value: "Unit.Unit",
        sortable: true,
        inEdit: false,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "حرب",
        value: "PayWar",
        searchValue: "PayWar",
        sortable: true,
        inModel: true,
        type: "text",

        inSearch: false,
        inTable: true,
        cols: 3,
        readOnly: true,

        sort: 2
      },
      {
        text: "سياسة",
        value: "PayPolitics",
        searchValue: "PayPolitics",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,

        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: " الموجود بدون الراتب العالي",
        value: "ExistWithoutHighPay",
        searchValue: "ExistWithoutHighPay",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,

        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "المسرح",
        value: "ReleasedOne",
        searchValue: "ReleasedOne",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,

        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الموجود بعد المسرح / عليا",
        value: "hightAfterRelease",
        searchValue: "hightAfterRelease",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الموجود بعد المسرح / فوق متوسطة",
        value: "apovAverageAfterRelease",
        searchValue: "apovAverageAfterRelease",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        readOnly: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الموجود بعد المسرح / متوسطة",
        value: "averageAfterRelease",
        searchValue: "averageAfterRelease",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        readOnly: true,
        sort: 2
      },
      {
        text: "الموجود بعد المسرح / عادة",
        value: "normalAfterRelease",
        searchValue: "normalAfterRelease",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        readOnly: true,
        sort: 2
      },
      {
        text: "الموجود بعد المسرح / اجمالي",
        value: "TotalAfterRelease",
        searchValue: "TotalAfterRelease",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2,
        readOnly: true
      },
      {
        text: "نسبة حرب",
        value: "NWarOne",
        searchValue: "NWarOne",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "نسبة سياسة",
        value: "NPoliticsOne",
        searchValue: "NPoliticsOne",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الامداد / عليا",
        value: "High",
        searchValue: "High",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الامداد/ فوق متوسطة",
        value: "AboveAvg",
        searchValue: "AboveAvg",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: " الامداد / متوسطه",
        value: "Avg",
        searchValue: "Avg",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الامداد / عادة",
        value: "Normal",
        searchValue: "Normal",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الامداد / الاجمالي",
        value: "Total",
        searchValue: "Total",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "الموجود بعد الامداد",
        value: "AfterSupply",
        searchValue: "AfterSupply",
        sortable: true,
        inModel: true,
        type: "text",
        inSearch: false,
        readOnly: true,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "نسبة حرب بعد الامداد",
        value: "NWarTwo",
        searchValue: "NWarTwo",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: " نسبة سياسة بعد الامداد",
        value: "NPoliticsTwo",
        searchValue: "NPoliticsTwo",
        sortable: true,
        inModel: true,
        type: "text",
        readOnly: true,
        inSearch: false,
        inTable: true,
        cols: 3,
        sort: 2
      },
      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",

        sortable: true,
        inEdit: false,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      },
      {
        text: "نوع التوزيع",
        value: "RecommendTypes",
        searchValue: "RecommendTypes",
        sortable: true,
        inEdit: false,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        searchValue: "Name",
        table: "RecStages"
      },
      RecommendTypes: {
        text: "text",
        value: "text",
        searchValue: "text",
        data: constants.RecommendTypes.data
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        searchValue: "UnitID",
        text: "Unit"
      },
      groupBy: {
        text: "text",
        value: "value",
        searchValue: "value",
        data: [
          {
            text: "الاتجاه",
            value: "Unit.Directionforunit"
          },
          {
            text: "حرب",
            value: "PayWar"
          }
        ]
      }
    },
    printer: {}
  }),
  methods: {
    async findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        RecuStage: this.search.RecuStage,
        PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`
      };
      this.$set(this, "groupBy", this.search.groubBy);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "DistributionSuggestion",
          where,
          include: [
            {
              model: "Unit"
            }
          ]
        });
        const unitsSalaries = await this.api(`global/queryRunners`, {
          query: `
               select Coalesce ( SUM(El_Moratab),0) mortab , Coalesce ( SUM(Siasa) ,0) siasa, UNIT_NAME from SMGeneral 
                WHERE Khedma_Type in (  N'مجند' , N'رع/مجند') and Feaa_Code = N'صف'
                group by UNIT_NAME
            `
        });

        let data = await Promise.all(
          x.data.map(async ele => {
            let unit = unitsSalaries.data.find(
              slaray => slaray.UNIT_NAME === ele.Unit.Unit
            );
            const totalSoliders = await this.api("global/queryRunners", {
              query: `
                      select  Coalesce ( count(ID),0) totalSoliderCount  from Soldier
                      join Unit on Unit.UnitID = Soldier.UnitID where Unit = N'${ele.Unit.Unit}'
                      and RecuEndDate > getdate()
                      and Status = N'بالخدمة'
                      and SoldierCategory  like N'صف' 
                      and WeaponID = ${constants.harsHododId}
                  `
            });

            const totalSolidersAfterTsra7 = await this.api(
              "global/queryRunners",
              {
                query: `
                      select  Coalesce ( count(ID),0) totalSoliderCount , KnowledgeLevel  from Soldier
                      join Unit on Unit.UnitID = Soldier.UnitID 
                      where Unit = N'${ele.Unit.Unit}'
                      and RecuEndDate > '${
                        this.selects.RecuStage.data.find(
                          ele => ele.text === this.search.RecuStage
                        ).year
                      }'
                      and Status = N'بالخدمة'
                      and SoldierCategory  like N'صف' 
                      and WeaponID = ${constants.harsHododId}
                    	GROUP by KnowledgeLevel
                  `
              }
            );
            let TotalAfterRelease = totalSolidersAfterTsra7.data.reduce(
              (perv, ele) => ele.totalSoliderCount + perv,
              0
            );
            const Total =
                parseInt(ele.Avg) +
                parseInt(ele.High) +
                parseInt(ele.Normal) +
                parseInt(ele.AboveAvg),
              AfterSupply = Total + TotalAfterRelease,
              PayPolitics = unit ? unit.siasa : ele.PayPolitics,
              PayWar = unit ? unit.mortab : ele.PayWar,
              NWarOne = Math.ceil((TotalAfterRelease / PayWar) * 100) + "%",
              NPoliticsOne =
                Math.ceil((TotalAfterRelease / PayWar) * 100) + "%",
              NWarTwo = Math.ceil((AfterSupply / PayWar) * 100) + "%",
              NPoliticsTwo = Math.ceil((AfterSupply / PayPolitics) * 100) + "%";

            let getSoliderCount = value =>
              (
                totalSolidersAfterTsra7.data.find(
                  ele => ele.KnowledgeLevel == value
                ) || {}
              ).totalSoliderCount || 0;

            return {
              ...ele,
              PayPolitics,
              PayWar,
              ExistWithoutHighPay: totalSoliders.data[0].totalSoliderCount,
              TotalAfterRelease,
              ReleasedOne:
                totalSoliders.data[0].totalSoliderCount - TotalAfterRelease,
              hightAfterRelease: getSoliderCount(constants.levelMappingEn.High),
              apovAverageAfterRelease: getSoliderCount(
                constants.levelMappingEn.AboveAvg
              ),
              averageAfterRelease: getSoliderCount(
                constants.levelMappingEn.Avg
              ),
              normalAfterRelease: getSoliderCount(
                constants.levelMappingEn.Normal
              ),
              AfterSupply,
              NWarTwo,
              NPoliticsTwo,
              NWarOne,
              NPoliticsOne
            };
          })
        );

        if (data.length == 0) {
          this.api("global/queryRunners", {
            query: `SELECT  DISTINCT PlanName FROM NewAFRAAD.dbo.DistributionSuggestion`
          }).then(data => {
            this.$set(this.copyModel, "model", true);
            this.$set(this.copyModel, "headers", [
              {
                text: "المقترح",
                value: "PlanName",
                searchValue: "PlanName",
                searchValue: "PlanName",
                searchValue: "PlanName",
                sortable: true,
                inTable: true,
                type: "select",
                inSearch: false,
                inTable: true,
                inModel: true,
                cols: 6,
                sort: 2
              }
            ]);
            this.selects.PlanName = {
              data: data.data,
              text: "PlanName",
              value: "PlanName"
            };
          });
        }
        let printer = {
          cons: [...data],
          excelKey: "cons",
          excelHeaders: this.headers.filter(f => f.inTable)
        };
        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async copyOne() {
      let data;
      try {
        data = await this.api("global/get_all", {
          table: "DistributionSuggestion",
          where: {
            PlanName: this.copyModelItem.PlanName
          },
          include: [
            {
              model: "Unit"
            }
          ]
        });
        data.data.forEach(ele => {
          this.api("global/create_one", {
            table: "DistributionSuggestion",
            where: {
              AboveAvg: ele.AboveAvg,
              AfterSupply: ele.AfterSupply,
              Avg: ele.Avg,
              ExistWithoutHighPay: ele.ExistWithoutHighPay,
              High: ele.High,
              NPoliticsOne: ele.NPoliticsOne,
              NPoliticsTwo: ele.NPoliticsTwo,
              NWarOne: ele.NWarOne,
              NWarTwo: ele.NWarTwo,
              Normal: ele.Normal,
              PayPolitics: ele.PayPolitics,
              PayWar: ele.PayWar,
              RecuStage: this.search.RecuStage,
              PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`,
              ReleasedOne: ele.ReleasedOne,
              Total: ele.Total,
              TotalAfterRelease: ele.TotalAfterRelease,
              UnitID: ele.UnitID
            }
          }).then(res => {});
        });
        this.$set(this.copyModel, "model", false);
      } catch (e) {
        this.handleError(e);
      }
    },
    handleClick(v) {
      this.$set(this.rowEditModel, "model", true);
      this.$set(this, "rowItem", v);
    },
    save() {
      this.api("global/update_one", {
        where: {
          RecuStage: this.rowItem.RecuStage,
          UnitID: this.rowItem.UnitID,
          PlanName: this.rowItem.PlanName
        },
        update: this.rowItem,
        table: "DistributionSuggestion"
      }).then(x => {
        this.items[
          this.items.findIndex(
            ele => ele.UnitID == this.rowEditModel.item.UnitID
          )
        ] = this.rowItem;
        this.$set(this.rowEditModel, "model", false);
        this.showSuccess("تم الحفظ");
      });
    },
    addNew() {
      this.api("global/get_one", {
        table: "DistributionSuggestion",
        where: {
          UnitID: this.newDistItem.UnitID
        }
      }).then(x => {
        let newObject = {
          ...x.data,
          RecuStage: this.search.RecuStage,
          PlanName: `${this.search.RecommendTypes} ${this.search.RecuStage}`,
          UnitID: this.newDistItem.UnitID
        };

        this.api("global/create_one", {
          table: "DistributionSuggestion",
          where: newObject
        }).then(rs => {
          this.$set(this.newDist, "model", false);
          this.showSuccess("تم الحفظ");
          setTimeout(ele => {
            this.findItems();
          }, 1000);
        });
      });
    },
    actionAdd() {
      this.$set(this.newDist, "model", true);
      const addedUnits = this.items.map(ele => ele.UnitID);
      this.$set(
        this.newDist,
        "data",
        this.selects["UnitID"].data.filter(ele => {
          return addedUnits.indexOf(ele.UnitID) == -1;
        })
      );
    },
    calculateRawValues() {
      let ele = this.rowItem;

      const Total =
          parseInt(ele.Avg) +
          parseInt(ele.High) +
          parseInt(ele.Normal) +
          parseInt(ele.AboveAvg),
        AfterSupply = Total + ele.TotalAfterRelease,
        NWarTwo = Math.ceil((AfterSupply / ele.PayWar) * 100) + "%",
        NPoliticsTwo = Math.ceil((AfterSupply / ele.PayPolitics) * 100) + "%";

      this.rowItem = {
        ...this.rowItem,
        AfterSupply,
        NWarTwo,
        NPoliticsTwo,
        Total
      };
    }
  }
};
</script>
