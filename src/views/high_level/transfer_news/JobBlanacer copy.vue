<template>
  <div>
    <table-bulider
      :headers="stats.headers"
      :printer="stats.printer"
      :items="stats.items"
      :height="200"
      :isExcel="true"
      :title="' احصائية للوظائف'"
    >
    </table-bulider>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      show-expand
      :isExcel="true"
      :title="' ميزان النشرة للوظائف الحرجة'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasEditAccess()">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog
      persistent
      v-model="selectedUintDailog.model"
      scrollable
      max-width="1000"
    >
      <v-card>
        <v-card-title>
          <v-btn @click="selectedUintDailog.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <table-bulider
            :headers="selectedUintDailog.headers"
            :height="200"
            :printer="selectedUintDailog.printer"
            :items="selectedUintDailog.items"
            :isExcel="true"
            :title="' الاشخاص العاملين بالوظائف الحرجة'"
          >
          </table-bulider>
        </v-card-text>

        <v-card-text>
          <v-card-text>
            <v-btn
              v-if="!showSearch"
              class="mx-auto"
              @click="addToSupport()"
              large
              outlined
              color="primary"
            >
              اضافة الي الدعم
            </v-btn>
          </v-card-text>

          <table-bulider
            :headers="selectedUintDailog.SupportHeaders"
            :printer="selectedUintDailog.support.printer"
            :height="200"
            :items="selectedUintDailog.supportData"
            :isExcel="true"
            :title="' الدعم'"
          >
            <template v-slot:item.editor="{ item }">
              <v-chip color="transparent" v-if="hasDeleteAccess()">
                <v-btn icon @click="actionDelete(item)" color="red">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </v-chip>
            </template>
          </table-bulider>
        </v-card-text>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      title=""
      :open="supportDailog.mode"
      :selects="supportDailog.selects"
      @on-close="supportDailog.mode = false"
      :fields="supportDailog.headers"
      :data="supportDailog.data"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../../Constant").default;

export default {
  name: "JobBlanacer",
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

  async mounted() {
    this.init();
    await this.findItems({});
  },
  data: () => ({
    balancer: {},
    supportDailog: {
      mode: false,
      data: {},
      selects: {
        Job: {
          text: "Name",
          value: "ID_KEY",
          data: []
        }
      },
      headers: [
        {
          text: "الوظيفة",
          value: "Job",
          searchValue: "Job",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "العدد",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        }
      ]
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
    listType: "all",
    searchLoading: false,
    selects: {
      JobID: {
        table: "Jobs",
        value: "ID_KEY",
        text: "Name"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "اجمالي السحب",
          value: "deductionTotal",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },

        {
          text: "اجمالي الدعم",
          value: "supportTotal",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },

        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    valdationJobs: [],
    units: [],
    selectedUintDailog: {
      model: false,
      unitId: 0,
      supportData: [],
      support: {
        items: [],
        headers: []
      },
      items: [],
      headers: [
        {
          text: "الوظيفة",
          value: "Job",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },

        {
          text: "العدد",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        }
      ],
      SupportHeaders: [
        {
          text: "",
          value: "editor",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوظيفة",
          value: "JobName",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },

        {
          text: "العدد",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        }
      ]
    },
    blanceItems: [],
    TotalSupport: [],
    showAddDialog: false,
    addLoading: false,
    addModel: {},
    groupedByCritcalJobs: [],
    groupedCandsWhichHasCritcalJobs: {},
    stats: {
      headers: [
        {
          text: "الوظيفة",
          value: "Job",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "السحب",
          value: "deduction",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الدعم",
          value: "support",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "المتبقي",
          value: "rest",
          searchValue: "",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        }
      ],
      items: []
    }
  }),
  watch: {},

  methods: {
    async actionDelete(item) {
      console.log(item);

      let unitData = this.mainTable.items.find(
        ele => ele.UnitID == this.selectedUintDailog.unitId
      );

      unitData.Details.support.splice(
        unitData.Details.support.findIndex(ele => ele.Job == item.Job),
        1
      );

      let saveItem;
      try {
        await this.api(`global/update_one`, {
          table: "TransferListJobBlancer",
          where: {
            ID_KEY: unitData.ID_KEY
          },
          update: { ...unitData, Details: JSON.stringify(unitData.Details) }
        });

        this.showSuccess("تم حفظ ");
        this.findItems({});
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    addToSupport() {
      this.$set(this.supportDailog, "mode", true);
      this.$set(this.supportDailog, "data", {
        unitId: this.selectedUintDailog.unitId
      });
    },
    actionEdit(item) {
      this.$set(this.selectedUintDailog, "model", true);
      this.$set(this.selectedUintDailog, "unitId", item.UnitID);
      item.Details.support = (item.Details.support || []).map(ele => {
        ele.JobName = this.selects.JobID.data.find(
          j => j.ID_KEY == ele.Job
        )?.Name;
        return ele;
      });

      this.$set(this.selectedUintDailog, "supportData", item.Details.support);

      if (this.groupedCandsWhichHasCritcalJobs[item.UnitID]) {
        let groupedByJob = lodash.groupBy(
          this.groupedCandsWhichHasCritcalJobs[item.UnitID],
          ele => ele.Job.Name
        );
        this.selectedUintDailog.items = Object.keys(groupedByJob).map(ele => ({
          Job: ele,
          count: groupedByJob[ele].length
        }));
      }
    },
    async saveItem() {
      let unitData = this.mainTable.items.find(
        ele => (ele.UnitID = this.supportDailog.data.unitId)
      );
      let jobValdation = this.valdationJobs.find(
        ele => ele.JobID == this.supportDailog.data.Job
      );

      let maxNumber =
        jobValdation.items.filter(
          ele => ele.UnitID != this.supportDailog.data.unitId
        ).length - jobValdation.support;

      if (maxNumber < parseInt(this.supportDailog.data.count)) {
        this.showError(` ${maxNumber} اقصي عدد للاضافة هو  `);
        return;
      }

      if (!unitData.Details.support) {
        unitData.Details.support = [];
      }
      unitData.Details.support.push(this.supportDailog.data);

      try {
        await this.api(`global/update_one`, {
          table: "TransferListJobBlancer",
          where: {
            ID_KEY: unitData.ID_KEY
          },
          update: { ...unitData, Details: JSON.stringify(unitData.Details) }
        });
        this.supportDailog.mode = false;
        this.selectedUintDailog.model = false;
        this.showSuccess("تم حفظ ");
        this.findItems({});
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
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

      if (JobBlanacer.data.length === 0) {
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

        const groupByUnit = await lodash.groupBy(
          candidates.data,
          ele => ele.Rateb?.UnitID
        );
        let perparedData = Object.keys(groupByUnit).map(UnitID => {
          return {
            UnitID,
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
      }
      const candidates = await this.api("global/get_all", {
        table: "TransferCandidates",
        include: [
          {
            model: "Rateb",
            include: [
              {
                model: "PreviousJobs",
                include: [{ model: "Jobs" }]
              },
              { model: "Jobs" }
            ]
          }
        ],
        where: this.cleanObject({
          TransferListID: this.$route.params.id
        })
      });

      let groupedCandsWhichHasCritcalJobs = Object.values(
        lodash.groupBy(candidates.data, ele => ele.Rateb.ID)
      )
        .map(ele => ({
          ...ele[0].Rateb,
          PreviousJobs: ele[0].Rateb.PreviousJobs.ID_KEY
            ? ele.map(r => r.Rateb.PreviousJobs)
            : []
        }))
        .filter(ele => ele.Job?.isCritical);

      this.groupedByCritcalJobs = lodash.groupBy(
        groupedCandsWhichHasCritcalJobs,
        ele => ele.Job.ID_KEY
      );
      this.TotalSupport = lodash.flatten(
        this.mainTable.items.map(ele =>
          ele.Details.support ? ele.Details.support : []
        )
      );

      Object.keys(this.groupedByCritcalJobs).map(key => {
        return {
          JobID: key,
          Job: this.groupedByCritcalJobs[key][0].Job.Name,
          items: this.groupedByCritcalJobs[key],
          support: this.TotalSupport.filter(ele => ele.Job === key).reduce(
            (prev, cur) => prev + cur.count,
            0
          )
        };
      });
      this.valdationJobs = Object.keys(this.groupedByCritcalJobs).map(key => {
        return {
          JobID: key,
          Job: this.groupedByCritcalJobs[key][0].Job.Name,
          items: this.groupedByCritcalJobs[key],
          support: this.TotalSupport.filter(ele => ele.Job == key).reduce(
            (prev, cur) => prev + parseInt(cur.count),
            0
          )
        };
      });

      this.stats.items = this.valdationJobs.map(ele => ({
        Job: ele.Job,
        support: ele.support,
        deduction: ele.items.length,
        rest: ele.items.length - ele.support
      }));

      this.supportDailog.selects.Job.data = lodash
        .uniqBy(
          lodash.flatten(Object.values(groupedCandsWhichHasCritcalJobs)),
          ele => ele.Job.ID_KEY
        )
        .map(ele => ele.Job);

      this.groupedCandsWhichHasCritcalJobs = lodash.groupBy(
        groupedCandsWhichHasCritcalJobs,
        ele => ele.UnitID
      );

      this.$set(
        this.mainTable,
        "items",
        JobBlanacer.data.map(ele => {
          let Details = ele.Details.length ? JSON.parse(ele.Details) : {};
          let support = (Details.support || []).map(ele => {
            ele.JobName = this.selects.JobID.data.find(
              j => j.ID_KEY == ele.Job
            )?.Name;
            return ele;
          });

          let deduction = [];

          if (this.groupedCandsWhichHasCritcalJobs[ele.UnitID]) {
            let groupedByJob = lodash.groupBy(
              this.groupedCandsWhichHasCritcalJobs[ele.UnitID],
              ele => ele.Job.Name
            );
            deduction = Object.keys(groupedByJob).map(eleJ => ({
              Job: eleJ,
              count: groupedByJob[eleJ].length
            }));
          }
          return {
            ...ele,
            deduction,
            deductionTotal: deduction.reduce(
              (prev, cur) => prev + cur.count,
              0
            ),
            support,
            supportTotal: deduction.reduce((prev, cur) => prev + cur.count, 0),

            Details: ele.Details.length ? JSON.parse(ele.Details) : {}
          };
        })
      );
    }
  }
};
</script>
