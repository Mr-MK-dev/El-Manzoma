<template>
  <div>
    <!-- <search-bulider
      :fields="headers"
      :selects="selects"
      :addButton="false"
      @on-search="handleSearch"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في مرشحين النشرة"
    /> -->

    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Internals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <comparison-details-internals
            ref="internals"
            :parentFilters="true"
          ></comparison-details-internals>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي التوصيات : {{ totals.totalRecommendations }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي ما تم من التوصيات : {{ totals.totalDoneRecommendations }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي الإلتماسات :
            {{ totals.totalRequests }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي ما تم من الإلتماسات :
            {{ totals.totalDoneRequests }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي توصيات المخابرات :
            {{ totals.totalIntelligence }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            إجمالي ما تم من توصيات المخابرات :
            {{ totals.totalDoneIntelligence }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <table-bulider
      :title="''"
      :headers="headers"
      :items="items"
      :printer="printer"
      :isExcel="true"
    >
      <template v-slot:item.ComparisonDetails="{ item }">
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.ComparisonStats="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="openStats(item)" color="primary">
            <v-icon>mdi-google-analytics</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>

      <template v-slot:item.DecisionNotes="{ item }">
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(item, i) in item.DecisionNotes.split(' - - ')"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      title=" بيانات التوزيعة  "
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="allocationComparison"
    />
    <editor-dialog-bulider />
    <v-dialog scrollable v-model="statsDialog.model">
      <v-container class="grey lighten-5">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              كل التوصيات : {{ statsDialog.item.allRecomendations }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              ما تم من توصيات : {{ statsDialog.item.RecommendationCandidates }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              كل الإلتماسات : {{ statsDialog.item.allRequests }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              ما تم من الإلتماسات : {{ statsDialog.item.RequestedCandidates }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              السحب من الصف : {{ statsDialog.item.safDeduction }}
            </v-card>
          </v-col>
          <!--          <v-col cols="12" sm="6">-->
          <!--            <v-card class="pa-2" outlined tile>-->
          <!--              الدعم المطلوب للصف : {{ statsDialog.item.safSupply }}-->
          <!--            </v-card>-->
          <!--          </v-col>-->
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              الدعم للصف : {{ statsDialog.item.safActualSupply }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              السحب من الكاتب : {{ statsDialog.item.writerDeduction }}
            </v-card>
          </v-col>
          <!--          <v-col cols="12" sm="6">-->
          <!--            <v-card class="pa-2" outlined tile>-->
          <!--              الدعم المطلوب الكاتب : {{ statsDialog.item.writerSupply }}-->
          <!--            </v-card>-->
          <!--          </v-col>-->
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              الدعم الكاتب : {{ statsDialog.item.writerActualSupply }}
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              السحب من السائق : {{ statsDialog.item.driverDeduction }}
            </v-card>
          </v-col>
          <!--          <v-col cols="12" sm="6">-->
          <!--            <v-card class="pa-2" outlined tile>-->
          <!--              الدعم المطلوب السائق : {{ statsDialog.item.driverSupply }}-->
          <!--            </v-card>-->
          <!--          </v-col>-->
          <v-col cols="12" sm="6">
            <v-card class="pa-2" outlined tile>
              الدعم السائق : {{ statsDialog.item.driverActualSupply }}
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-dialog>
  </div>
</template>

<script>
const lodash = require("lodash");
export default {
  name: "AllocationComparison",

  mounted() {
    this.init();
    this.handleSearch({});
  },

  components: {
    ComparisonDetailsInternals: () =>
      import("@/views/high_level/transfer_news/ComparisonDetails")
  },

  watch: {
    "secondOne.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  data: () => ({
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    statsDialog: {
      model: false,
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
      totalRecommendations: 0,
      totalDoneRecommendations: 0,
      totalDoneRequests: 0,
      totalRequests: 0,
      totalDoneIntelligence: 0,
      totalIntelligence: 0
    },
    loading: false,
    search: {},
    searchLoading: false,
    showAddDialog: false,
    allocationComparison: {},
    items: [],
    currentItems: [],
    printer: [],
    headers: [
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
    ],
    selects: {
      UnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
      }
    },

    selectedTime: null,
    transferList: {
      Name: ""
    }
  }),

  methods: {
    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.headers.forEach(function(obj) {});
        // this.$refs.internals.gradeDetails.SoliderID = item.SoliderID;
        // this.$set(
        //   this.$refs.internals.gradeDetails,
        //   "SoliderID",
        //   item.SoliderID
        // );

        await this.$refs.internals.findItems({});
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 3000);
      }
    },
    openStats(item) {
      console.log("item", item);
      this.$set(this.statsDialog, "item", item);
      this.$set(this.statsDialog, "model", true);
    },
    async handleSearch() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      this.$set(this, "currentItems", []);
      try {
        let transferAlocation = await this.api("global/get_all", {
          table: "TransferAllocation",
          include: [{ model: "Unit" }, { model: "Rateb" }],

          where: {
            TransferListID: this.$route.params.id
          }
        });
        let transferBalancer = await this.api("global/get_all", {
          table: "TransferListBalancer",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.$route.params.id
          }
        });
        let transferJobBalancer = await this.api("global/get_all", {
          table: "TransferListJobBlancer",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.$route.params.id
          }
        });
        let transferRecommendations = await this.api("global/get_all", {
          table: "RatebRecommendations",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.$route.params.id
          }
        });
        let transferIntelligence = await this.api("global/get_all", {
          table: "TransferIntelligence",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.$route.params.id
          }
        });
        let transferRequests = await this.api("global/get_all", {
          table: "Requests",
          include: [{ model: "Unit" }],
          where: {
            TransferListID: this.$route.params.id
          }
        });
        this.api("global/get_all", {
          table: "TransferListUnits",
          where: { TransferListID: this.$route.params.id },
          include: [
            {
              model: "Unit"
            }
          ]
        }).then(async x => {
          console.log(
            "transferRecommendations.data",
            transferRecommendations.data
          );
          console.log("transferAlocation.data", transferAlocation.data);
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
              TotalAllocated: transferAlocation.data.filter(
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
              safDeduction: transferAlocation.data.filter(
                e =>
                  e.Rateb.UnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("صف")
              ).length,
              safSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("صف")
                )?.Supply || 0,
              safActualSupply: transferAlocation.data.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("صف")
              ).length,
              writerDeduction: transferAlocation.data.filter(
                e =>
                  e.Rateb.UnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("كاتب")
              ).length,
              writerSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("كاتب")
                )?.Supply || 0,
              writerActualSupply: transferAlocation.data.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("كاتب")
              ).length,
              driverDeduction: transferAlocation.data.filter(
                e =>
                  e.Rateb.UnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("سائق")
              ).length,
              driverSupply:
                transferBalancer.data.find(
                  e => e.UnitID == ele.UnitID && e.Category.includes("سائق")
                )?.Supply || 0,
              driverActualSupply: transferAlocation.data.filter(
                e =>
                  e.TransferedUnitID == ele.UnitID &&
                  e.Rateb.RatebCategory.includes("سائق")
              ).length
            };
          });
          this.totals.totalDoneRecommendations = transferAlocation.data.filter(
            ele => ele.ReasonType == "Recommendation"
          ).length;
          this.totals.totalDoneRequests = transferAlocation.data.filter(
            ele => ele.ReasonType == "Request"
          ).length;
          this.totals.totalRecommendations = transferRecommendations.data.filter(
            ele => ele.isCertified
          ).length;
          this.totals.totalRequests = transferRequests.data.filter(
            ele => ele.isCertified
          ).length;
          this.totals.totalDoneIntelligence = transferAlocation.data.filter(
            ele => ele.ReasonType == "forceTransfers"
          ).length;
          this.totals.totalIntelligence = transferIntelligence.data.length;
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
          this.$set(this, "items", data);
          this.$set(this, "printer", {
            data: this.items,
            excelKey: "data",
            excelHeaders: this.headers.filter(f => f.inTable),
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
