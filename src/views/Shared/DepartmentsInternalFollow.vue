<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المتابعة الداخلية للقسم"
      addBtnTitle="إضافة متابعة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المتابعة الداخلية'"
    >
      <template v-if="hasEditAccess()" v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            color="transparent"
            @click="actionDelete(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.isDoneText="{ item }">
        <v-chip
          :disabled="!hasEditAccess()"
          @click="actionDone(item)"
          :color="item.color"
        >
          {{ item.isDoneText }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة متابعة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="followup"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "DepartmentsInternalFollow",
  props: {
    departmentType: {
      type: String,
      default: "sss"
    }
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

  mounted() {
    this.init();
  },
  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },

    followup: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "actionsStart",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: false,
          sort: 1
        },
        {
          text: "الموضوع",
          value: "Subject",
          searchValue: "Subject",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "ما تم",
          value: "WhatsDone",
          searchValue: "WhatsDone",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المنتظر",
          value: "Expected",
          searchValue: "Expected",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الانتهاء",
          value: "EndDate",
          searchValue: "EndDate",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "تمام التنفيذ",
          value: "isDoneText",
          searchValue: "isDoneText",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        }

      ],
      items: [],
      printer: []
    },
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Continuity: {
        text: "text",
        value: "text",
        data: [
          {
            text: "متابع"
          },
          {
            text: "غير متابع"
          }
        ]
      },
      isDoneText: {
        text: "isDoneText",
        value: "isDoneText",
        data: [
          {
            isDoneText: "تم التنفيذ"
          },
          {
            isDoneText: "لم يتم التنفيذ"
          }
        ]
      }
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "DepartmentsInternalFollow",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },

    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          DepartmentType: this.$route.params.departmentType,
        },
        likes = [],
        multi = [],
        date = ['EndDate'];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "DepartmentsInternalFollow",
        where
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              isDoneText: ele.isDone ? "أنتهت" : "لم تنتهي",
              color: ele.isDone ? "success" : "gray",
              isDone: ele.isDone
            })),
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      this.$set(
        this.followup,
        "DepartmentType",
        this.$route.params.departmentType
      );

      console.log("FollowUp"   , this.followup);

      saveItem = await this.api(
        `global/${this.followup.isEdit ? "update_one" : "create_one"}`,
        {
          table: "DepartmentsInternalFollow",
          where: !this.followup.isEdit
            ? this.followup
            : {
                ID_KEY: this.followup.ID_KEY
              },
          update: this.followup
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems({});
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "followup", {});

      this.$set(this, "followup", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "followup", {
        ...item,
        isEdit: true
      });
    },
    actionDone(item) {
      console.log(item);
      this.$confirm(`هل انت متاكد من تغيير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          try {
            await this.api(`global/update_one`, {
              table: "DepartmentsInternalFollow",
              where: {
                ID_KEY: item.ID_KEY
              },
              update: {
                isDone: !item.isDone
              }
            });
            this.findItems({});
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  }
};
</script>
