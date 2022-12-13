<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة خبرة سابقة
      </v-btn>
    </v-card-title>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'الخبرات'">
        <template v-slot:item.editor="{ item }">
          <v-chip color="transparent" v-if="isAdmin()">
            <v-btn icon @click="actionEdit(item)" color="primary">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="actionDelete(item)" color="red">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      @on-add="actionAdd()"
      addBtnTitle="إضافة خبرة سابقة"
      title="بيانات الخبرات السابقة"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :selects="selects"
      :data="prejobs"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />
  </div>
</template>
<script>
import _ from "lodash";

const constants = require("@/Constant").default;

export default {
  name: "PreviousJobs",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  async mounted() {
    await this.init();
    await this.findItems({ ID: this.conscripte.ID });
    this.selects.RatebDegreeFromSpecialistSelect.data = _.range(1, 11, 1);
    this.selects.RatebDegreeFromUnitLeaderSelect.data = _.range(1, 11, 1);
    this.selects.RatebDegreeFromBranchHeadSelect.data = _.range(1, 11, 1);
  },
  methods: {
    async actionEdit(item) {
      this.$set(this, "showAddDialog", true);

      this.$set(this, "prejobs", { ...item });
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "PreviousJobs",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({ ID: this.prejobs.RatebID });
        }
      });
    },
    async findItems(filters) {
      const result = await this.api("global/get_all", {
        table: "PreviousJobs",
        include: [{ model: "Jobs" }],
        where: {
          RatebID: filters.ID
        }
      }).then(x => {
        let data = x.data.map(ele => ({
          ...ele,
          WorkStatus:
            ele.WorkStatus === 1 ? "أساسي" : ele.WorkStatus === 2 ? "بديل" : "-"
        }));
        // this.$set(this.mainTable, "items", data);
        this.items = data;
      });
    },
    async actionAdd() {
      this.$set(this, "showAddDialog", true);
      this.$set(this, "prejobs", {
        RatebID: this.prejobs.RatebID,
        isEdit: false
      });

      this.prejobs = {};
    },

    async saveItem() {
      this.prejobs.RatebID = this.conscripte.ID;
      this.$set(this, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          !this.prejobs.ID_KEY ? `global/create_one` : `global/update_one`,
          {
            table: "PreviousJobs",
            where: this.prejobs.ID_KEY
              ? {
                  ID_KEY: this.prejobs.ID_KEY
                }
              : {
                  ...this.prejobs
                },
            update: {
              ...this.prejobs
            }
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ ID: this.prejobs.RatebID });
          this.showAddDialog = false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this, "loading", false);
        this.$set(this, "showAddDialog", false);
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this, "loading", false);
      }
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    showAddDialog: false,
    prejobs: {},
    selects: {
      JobID: {
        table: "Jobs",
        value: "ID_KEY",
        text: "Name"
      },
      RatebDegreeFromSpecialistSelect: {
        data: ["1", "2"]
      },
      RatebDegreeFromUnitLeaderSelect: {
        data: []
      },
      RatebDegreeFromBranchHeadSelect: {
        data: []
      },
      WorkStatus: {
        text: "text",
        value: "value",
        data: [
          {
            text: "أساسي",
            value: 1
          },
          {
            text: "بديل",
            value: 2
          },
          {
            text: "-",
            value: 3
          }
        ]
      }
    },
    headers: [
      {
        text: "",
        value: "editor",
        searchValue: "editor",
        sortable: true,
        inSearch: false,
        inModel: false,
        inTable: true,
        sort: 5
      },
      {
        text: "إسم الوظيفة السابقة",
        value: "Job.Name",
        searchValue: "JobID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      // {
      //   text: "نسبة الأداء( راي المختص )",
      //   value: "RatebDegreeFromSpecialist",
      //   searchValue: "RatebDegreeFromSpecialistSelect",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      // {
      //   text: "نسبة الأداء( راي قائد الوحده )",
      //   value: "RatebDegreeFromUnitLeader",
      //   searchValue: "RatebDegreeFromUnitLeaderSelect",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      // {
      //   text: "نسبة الأداء( راي رئيس الفرع )",
      //   value: "RatebDegreeFromBranchHead",
      //   searchValue: "RatebDegreeFromBranchHeadSelect",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      // {
      //   text: "درجته الوظيفية",
      //   value: "WorkStatus",
      //   searchValue: "WorkStatus",
      //   sortable: true,
      //   type: "select",
      //   inSearch: true,
      //   inTable: true,
      //   inModel: true,
      //   sort: 1
      // },
      {
        text: "ملاحظات",
        value: "Notes",
        searchValue: "Notes",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    search: ""
  })
};
</script>
