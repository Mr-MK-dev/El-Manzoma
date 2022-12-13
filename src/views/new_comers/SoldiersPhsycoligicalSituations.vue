<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المواقف النفسية للمجندين"
      addBtnTitle="إضافة موقف نفسي"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المواقف النفسية'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.Continuity="{ item }">
        <v-chip
          @click="actionCertificatie(item)"
          :color="item.Continuity == 1 ? 'success' : 'gray'"
        >
          {{ item.Continuity ? "متابع" : "غير متابع" }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            color="transparent"
            @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة موقف'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="situation"
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
  name: "SoldiersPhsycoligicalSituation",
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
    situation: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "Soldier.RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Soldier.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Soldier.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "الموقف",
          value: "Situation",
          searchValue: "Situation",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "المؤيد",
          value: "Advocate",
          searchValue: "Advocate",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "تاريخ الموقف",
          value: "SituationDate",
          searchValue: "SituationDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "المتابعة",
          value: "Continuity",
          searchValue: "Continuity",
          sortable: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: false,
          sort: 6
        },
        {
          text: "الاجراء المتخذ",
          value: "TakenAction",
          searchValue: "TakenAction",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: false,
          sort: 6
        },
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
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
      }
    }
  }),
  watch: {
    "situation.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["SituationDate"];

      where = this.mapToQuery(where, likes, multi, date);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "SoldiersPhsycoligicalSituations",
          where: this.cleanObject({
            ID: where.ID
          }),
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                Name: where.Name,
                RecuStage: where.RecuStage,
                KnowledgeLevel: where.KnowledgeLevel,
                Status: where.Status
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });
        let data = x.data,
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
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      if (this.situation.TakenAction) {
        this.$set(this.situation, "Continuity", false);
      }

      saveItem = await this.api(
        `global/${this.situation.isEdit ? "update_one" : "create_one"}`,
        {
          table: "SoldiersPhsycoligicalSituations",
          where: !this.situation.isEdit
            ? this.situation
            : {
                SituationID: this.situation.SituationID
              },
          update: this.situation
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
      this.$set(this, "situation", {});

      this.$set(this, "situation", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.findOne(item.ID);
      this.$set(this.createdObject, "model", true);
      this.$set(this, "situation", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "SoldiersPhsycoligicalSituations",
          where: {
            SituationID: item.SituationID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },
    actionCertificatie(item) {
      console.log(item);
      this.$confirm(`هل انت متاكد من تغيير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          try {
            await this.api(`global/update_one`, {
              table: "SoldiersPhsycoligicalSituations",
              where: {
                SituationID: item.SituationID
              },
              update: {
                Continuity: !item.Continuity
              }
            });
            this.findItems({});
          } catch (error) {
            this.handleError(error);
          }
        }
      });
    },
    findOne(ID) {
      if (ID.length > 10) {
        this.$set(this.createdObject, "loading", true);

        this.api("global/get_one", {
          table: "Soldier",
          where: { ID }
        })
          .then(x => {
            this.$set(this.situation, "Name", x.data.Name);
          })
          .catch(error => {
            this.$set(this.situation, "Name", "");
          })
          .finally(() => {
            this.$set(this.createdObject, "loading", false);
          });
      }
    }
  }
};
</script>
