<template>
  <div class="Categories_Dailes">
    <!--    <search-bulider-->
    <!--      :fields="mainTable.headers"-->
    <!--      :selects="selects"-->
    <!--      @on-search="findItems"-->
    <!--      :search="search"-->
    <!--      :clearOption="true"-->
    <!--      title="بحث متقدم في الراتب العالي"-->
    <!--      :addButton="false"-->
    <!--    />-->
    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :loading="searchLoading"
        :title="'نتائج اليومية عددية للراتب العالي'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<style></style>

<script>
const constants = require("../../../../../Constant").default;
const types = require("../../../../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const lodash = require("lodash");
const displayTypes = types.displayTypes;

const basicHeaders = [
  // {
  //   text: "إحصائيات",
  //   value: "ComparisonStats",
  //   searchValue: "ComparisonStats",
  //   sortable: true,
  //   type: "text",
  //   inSearch: true,
  //   inTable: true,
  //   inModel: true,
  //   sort: 1
  // },
  {
    text: "الوحدات",
    value: "unit",
    searchValue: "UnitID",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: true,
    inModel: false,
    sort: 1
  },
  {
    text: "الخارج من الصف",
    value: "safDeduction",
    searchValue: "safDeduction",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الداخل من الصف",
    value: "safActualSupply",
    searchValue: "safActualSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "دعم الصف",
    value: "safSupply",
    searchValue: "safSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الخارج من السائق",
    value: "driverDeduction",
    searchValue: "driverDeduction",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الداخل من السائق",
    value: "driverActualSupply",
    searchValue: "driverActualSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "دعم السائق",
    value: "driverSupply",
    searchValue: "driverSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الخارج من الكاتب",
    value: "writerDeduction",
    searchValue: "writerDeduction",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الداخل من الكاتب",
    value: "writerActualSupply",
    searchValue: "writerActualSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "دعم الكاتب",
    value: "writerSupply",
    searchValue: "writerSupply",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "إجمالي التوزيع",
    value: "TotalAllocated",
    searchValue: "TotalAllocated",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "التوصيات",
    value: "RecommendationCandidates",
    searchValue: "RecommendationCandidates",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "الإلتماسات",
    value: "RequestedCandidates",
    searchValue: "RequestedCandidates",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  },
  {
    text: "توزيعات المخابرات",
    value: "transferedIntelligence",
    searchValue: "transferedIntelligence",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: true,
    sort: 1
  }
];

export default {
  name: "UnitesWithPointsStats",
  props: {
    items: {
      default: []
    }
  },
  async mounted() {
    await this.init();
    // await this.getRecuEndDateOptions();
    await this.findItems();
  },
  data: () => ({
    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [...basicHeaders, ...[]],
      items: [],
      printer: {}
    },
    componentName: "UnitesWithPointsStats",
    selects: {
      directions: {
        text: "Name",
        value: "Name",
        table: "Sectors"
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Type: {
        text: "text",
        value: "value",
        data: [
          {
            text: "التجميعات قتالية",
            value: displayTypes.collections
          },
          {
            text: "الوحدات محددة",
            value: displayTypes.unites
          }
        ]
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      Weapon: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      console.log(this.items);
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      try {
        // let transferAlocation = await this.api("global/get_all", {
        //   table: "TransferAllocationSnapshot",
        //   include: [{ model: "Unit" }, { model: "Rateb" }],
        //
        //   where: {
        //     TransferListID: this.items[0].TransferListID,
        //     Name: this.items[0].Name
        //   }
        // });
        let transferBalancer = await this.api("global/get_all", {
          table: "TransferListBalancer",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.items[1].TransferListID
          }
        });
        let transferJobBalancer = await this.api("global/get_all", {
          table: "TransferListJobBlancer",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.items[1].TransferListID
          }
        });
        let transferRecommendations = await this.api("global/get_all", {
          table: "RatebRecommendations",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.items[1].TransferListID
          }
        });
        let transferIntelligence = await this.api("global/get_all", {
          table: "TransferIntelligence",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.items[1].TransferListID
          }
        });
        let transferRequests = await this.api("global/get_all", {
          table: "Requests",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.items[1].TransferListID
          }
        });
        this.api("global/get_all", {
          table: "TransferListUnits",
          where: { TransferListID: this.items[1].TransferListID },
          include: [
            {
              model: "Unit"
            }
          ]
        }).then(async x => {
          let jobbalancer = transferJobBalancer.data.map(ele => ({
            ...ele,
            Details: ele?.Details?.length ? JSON.parse(ele.Details) : {}
          }));
          let data = x.data.map(ele => {
            return {
              ...ele,
              unit: ele.Unit.Unit,
              supply: transferBalancer.data.find(e => e.UnitID == ele.UnitID)
                ?.Supply,
              TotalAllocated: this.items.filter(
                e => e.TransferedUnitID == ele.UnitID
              ).length,
              allRecomendations: transferRecommendations.data.filter(
                e => e.RecommendedUnitID == ele.UnitID
              ).length,
              allRequests: transferRequests.data.filter(
                e => e.RecommendedUnitID == ele.UnitID
              ).length,
              transferedIntelligence: transferIntelligence.data.filter(
                e => e.RecommendedUnitID == ele.UnitID
              ).length,
              RecommendationCandidates: transferRecommendations.data.filter(
                e => e.RecommendedUnitID == ele.UnitID && e.isCertified
              ).length,
              RequestedCandidates: transferRequests.data.filter(
                e => e.RecommendedUnitID == ele.UnitID && e.isCertified
              ).length,
              jobSupply:
                jobbalancer
                  .find(e => e.Unit.UnitID == ele.UnitID)
                  ?.Details?.support?.reduce(
                    (prev, cur) => prev + parseInt(cur["count"]),
                    0
                  ) || 0,
              safDeduction: this.items.filter(
                e =>
                  e.OldUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("صف")
              ).length,
              safSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("صف")
                )?.Supply || 0,
              safActualSupply: this.items.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("صف")
              ).length,
              writerDeduction: this.items.filter(
                e =>
                  e.OldUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("كاتب")
              ).length,
              writerSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("كاتب")
                )?.Supply || 0,
              writerActualSupply: this.items.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("كاتب")
              ).length,
              driverDeduction: this.items.filter(
                e =>
                  e.OldUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("سائق")
              ).length,
              driverSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("سائق")
                )?.Supply || 0,
              driverActualSupply: this.items.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("سائق")
              ).length
            };
          });
          // this.totals.totalDoneRecommendations = this.items.data.filter(
          //   ele => ele.ReasonType == "Recommendation"
          // ).length;
          // this.totals.totalDoneRequests = this.items.data.filter(
          //   ele => ele.ReasonType == "Request"
          // ).length;
          // this.totals.totalRecommendations = transferRecommendations.data.filter(
          //   ele => ele.isCertified
          // ).length;
          // this.totals.totalRequests = transferRequests.data.filter(
          //   ele => ele.isCertified
          // ).length;
          // this.totals.totalDoneIntelligence = this.items.data.filter(
          //   ele => ele.ReasonType == "forceTransfers"
          // ).length;
          // this.totals.totalIntelligence = transferIntelligence.data.length;
          data.push({
            unit: "الإجمالي",
            safDeduction: lodash.sumBy(data, ele => ele.safDeduction),
            safSupply: lodash.sumBy(data, ele => ele.safSupply),
            safActualSupply: lodash.sumBy(data, ele => ele.safActualSupply),
            writerDeduction: lodash.sumBy(data, ele => ele.writerDeduction),
            writerSupply: lodash.sumBy(data, ele => ele.writerSupply),
            writerActualSupply: lodash.sumBy(
              data,
              ele => ele.writerActualSupply
            ),
            driverDeduction: lodash.sumBy(data, ele => ele.driverDeduction),
            driverSupply: lodash.sumBy(data, ele => ele.driverSupply),
            driverActualSupply: lodash.sumBy(
              data,
              ele => ele.driverActualSupply
            ),
            TotalAllocated: lodash.sumBy(data, ele => ele.TotalAllocated),
            transferedIntelligence: lodash.sumBy(
              data,
              ele => ele.transferedIntelligence
            ),
            RequestedCandidates: lodash.sumBy(
              data,
              ele => ele.RequestedCandidates
            ),
            RecommendationCandidates: lodash.sumBy(
              data,
              ele => ele.RecommendationCandidates
            )
          });
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable),
            hasParent: true
          });
        });
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
