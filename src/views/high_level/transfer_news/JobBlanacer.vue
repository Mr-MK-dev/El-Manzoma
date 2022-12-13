<template>
  <div>
    <!-- <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      إضافة وظيفة على الميزان
    </v-btn> -->
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
    />
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الدعم : {{ totals.Supply }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي من لديه خبرة سابقة : {{ totals.totalNoCurrent }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            السحب : {{ totals.deduction }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            الميزان : {{ totals.Supply - totals.deduction }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <div
      class="cont"
      style="
    display: flex;
    justify-content: center;
"
    >
      <div
        style="display: inline-block;width: 9%;position: relative;top: 130px;"
      >
        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              style="marign = 10px"
              v-for="(item, i) in itemsNames"
              :key="i"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.value"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>

      <div style="display: inline-block; width : 88%">
        <table-bulider
          :headers="mainTable.headers"
          :printer="mainTable.printer"
          :items="mainTable.items"
          :height="400"
          :isExcel="true"
          :title="''"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-xs-right pa-4">{{ item.type }}</td>
              <template v-for="unit in units">
                <td :key="unit + item[unit]" class="text-xs-right pa-4">
                  <v-chip :color="item.color" @click="handelChange(item, unit)">
                    {{ item[unit] }}
                  </v-chip>
                </td>
              </template>
            </tr>
          </template>
        </table-bulider>
      </div>
    </div>

    <editor-dialog-bulider
      :title="''"
      :open="addJobObject.model"
      :loading="addJobObject.loading"
      :fields="addJobObject.headers"
      :selects="selects"
      :data="addBalancer"
      @on-submit="addJob()"
      @on-close="addJobObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="balancer"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<style>
.cont .v-list-item {
  margin: 25px 0;
}
</style>

<script>
const lodash = require("lodash");
const constants = require("../../../Constant").default;

let initHeaders = [
  {
    text: "الوظيفة",
    value: "jobID",
    searchValue: "jobID",
    sortable: true,
    type: "select",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  }
];
export default {
  name: "TransferListBalancer",

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
    // this.findItems({});
    // console.log(this.$route.params.category);
  },
  data: () => ({
    balancer: {},
    addBalancer: {},
    itemsNames: [],
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    addJobObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    addJobTable: {
      headers: [
        {
          text: "الوظيفة",
          value: "UnitID",
          searchValue: "jobID",
          sortable: false,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    totals: {
      deduction: 0,
      Supply: 0,
      totalNoCurrent: 0
    },
    listType: "all",
    searchLoading: false,
    selects: {
      RatebLevel: {
        data: constants.ratebLevels
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      jobID: {
        table: "Jobs",
        value: "ID_KEY",
        text: "Name"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [...initHeaders],
      items: [],
      printer: {},
      printedData: {}
    },
    units: [],
    addData: [
      {
        text: "الرقم العسكري",
        value: "RatebID",
        searchValue: "RatebID",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الاسم",
        value: "Rateb.Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 1
      }
    ],
    blanceItems: [],
    showAddDialog: false,
    addLoading: false,
    addModel: {},
    CurrentJobID: null
  }),
  watch: {},

  methods: {
    actionAdd() {
      this.$set(this.addJobObject, "model", true);
      this.selects.jobID.data = this.selects.jobID.data.filter(ele => {
        return !this.mainTable.headers.find(h => h.text === ele.Unit);
      });
      this.$set(this, "addBalancer", {});
    },
    async addJob() {
      this.$set(this.addJobObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "TransferListJobBlancer",
          where: this.cleanObject({
            TransferListID: this.$route.params.id,
            Category: this.$route.params.category,
            UnitID: this.addBalancer.UnitID
          })
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.addJobObject, "model", false);
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.addJobObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log(error);
      } finally {
        this.$set(this.addJobObject, "loading", false);
      }
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "balancer", {
        ...item,
        isEdit: true
      });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);

      if (!this.balancer.Details.support) {
        this.balancer.Details.support = [];
      }

      this.balancer.Details.support = this.balancer.Details.support.filter(
        ele => ele.Job !== this.CurrentJobID
      );

      this.balancer.Details.support.push({
        Job: this.CurrentJobID,
        count: this.balancer.Supply
      });

      try {
        await this.api(`global/update_one`, {
          table: "TransferListJobBlancer",
          where: {
            ID_KEY: this.balancer.ID_KEY
          },
          update: {
            ...this.balancer,
            Details: JSON.stringify(this.balancer.Details)
          }
        });
        this.createdObject.model = false;
        this.showSuccess("تم حفظ ");
        this.findItems({ jobID: this.CurrentJobID });
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    handelChange(item, unit) {
      if (["الدعم"].indexOf(item.type) > -1) {
        this.actionEdit(this.blanceItems.find(ele => ele.Unit.Unit == unit));
      }
    },
    async findItems(filters) {
      this.totals.deduction = 0;
      this.totals.Supply = 0;
      this.totals.totalNoCurrent = 0;
      this.CurrentJobID = filters.jobID;
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      let JobBlanacer = await this.api("global/get_all", {
        table: "TransferListJobBlancer",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      JobBlanacer.data = JobBlanacer.data.filter(ele =>
        this.$route.params.type == 2
          ? (ele.Unit.Category || "").includes("مجموعة مخابرات")
          : !(ele.Unit.Category || "").includes("مجموعة مخابرات")
      );
      const candidates = await this.api("global/get_all", {
        table: "TransferCandidates",
        include: [
          {
            model: "Rateb",
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      if (JobBlanacer.data.length === 0) {
        let units = await this.api("global/get_all", {
          table: "Unit",
          where: {
            statue: "بالخدمة"
          }
        });

        units = units.data;
        let perparedData = units.map(unit => {
          return {
            UnitID: unit.UnitID,
            TransferListID: this.$route.params.id,
            Details: ""
          };
        });
        await Promise.all(
          perparedData.map(ele =>
            this.api("global/create_one", {
              table: "TransferListJobBlancer",
              where: ele
            })
          )
        );

        this.findItems(filters);
      } else {
        this.blanceItems = JobBlanacer.data.map(ele => ({
          ...ele,
          Details: ele.Details.length ? JSON.parse(ele.Details) : {}
        }));
        let Units = lodash.uniq(JobBlanacer.data.map(ele => ele.Unit.Unit));

        this.units = Units;

        this.mainTable.headers = [
          ...initHeaders,
          {
            text: "البيان",
            value: "type",
            searchValue: "editor",
            sortable: true,
            type: "text",
            inSearch: false,
            inTable: true,
            inModel: false,
            sort: 1
          },
          {
            text: "الدعم",
            value: "Supply",
            searchValue: "Supply",
            sortable: true,
            type: "text",
            inSearch: false,
            inTable: false,
            inModel: true,
            readonly: true,
            sort: 1
          },
          ...Units.map(ele => ({
            text: ele,
            value: ele,
            searchValue: "mortab",
            sortable: true,
            type: "text",
            inSearch: false,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          }))
        ];

        let dataPre = await Promise.all(
          Units.map(async ele => {
            let rateb = await this.api("global/get_all", {
              table: "Rateb",
              include: [
                {
                  model: "Unit",
                  where: {
                    Unit: ele
                  }
                },
                {
                  model: "PreviousJobs"
                }
              ]
            });

            rateb = Object.values(_.groupBy(rateb.data, e => e.ID)).map(
              ele => ({
                ...ele[0],
                PreviousJobs: ele[0].PreviousJobs.ID_KEY
                  ? ele.map(e => e.PreviousJobs)
                  : []
              })
            );
            let total = rateb.filter(r => r.CurrentJobID == filters.jobID)
              .length;

            let totalNoCurrent = rateb.filter(
              r =>
                r.CurrentJobID != filters.jobID &&
                r.PreviousJobs.find(p => p.JobID == filters.jobID)
            );
            let deduction = candidates.data.filter(
              r =>
                r.Rateb.CurrentJobID == filters.jobID &&
                r.Rateb.Unit.Unit == ele
            ).length;
            let support = this.blanceItems
              .find(e => e.Unit.Unit == ele)
              ?.Details?.support?.find(e => e.Job == this.CurrentJobID);

            support = support ? parseInt(support.count) : 0;
            this.totals.deduction += deduction;
            this.totals.Supply += support;
            this.totals.totalNoCurrent += totalNoCurrent.length;

            return {
              Unit: ele,
              total,
              deduction,
              support: support,
              totalNoCurrent: totalNoCurrent.length
            };
          })
        );

        let itemsNames = [
          {
            key: "total",
            value: "الموجود",
            color: "info"
          },
          {
            key: "totalNoCurrent",
            value: "الموجود ولا يعمل بها حاليا",
            color: "info"
          },
          {
            key: "deduction",
            value: "سحب",
            color: "error"
          },
          {
            key: "support",
            value: "الدعم",
            color: "success"
          }
        ];

        this.$set(this, "itemsNames", [...itemsNames]);

        this.$set(
          this.mainTable,
          "items",
          itemsNames.map(ele => {
            let obj = {
              type: ele.value,
              color: ele.color ? ele.color : "transparent",
              UnitID: ele.UnitID
            };
            Units.forEach(unit => {
              obj[unit] = dataPre.find(d => d.Unit == unit)[ele.key];
            });

            return obj;
          })
        );

        this.$set(this.mainTable, "printer", {
          cons: [
            ...itemsNames.map(ele => {
              let obj = {
                type: ele.value,
                color: ele.color ? ele.color : "transparent",
                UnitID: ele.UnitID
              };
              Units.forEach(unit => {
                obj[unit] = dataPre.find(d => d.Unit == unit)[ele.key];
              });

              return obj;
            })
          ],
          excelKey: "cons",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });
      }
    }
  }
};
</script>
