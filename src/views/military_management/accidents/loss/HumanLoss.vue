<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        :loading="searchLoading"
        @on-search="findAccidentHumanLoss"
        :clearOption="true"
        title="بحث متقدم "
        :addButton="true"
        addBtnTitle="إضافة خسائر"
        @on-add="actionAdd()"
    />

    <table-bulider
        :headers="mainTable.headers"
        :items="mainTable.items"
        :title="'الخسائر الأخرى الخاصة بالحادثة'"
        :printer="mainTable.printer"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="actionDelete(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.IsDeathReportExecuted="{ item }">
        <v-chip
            :color="item.IsDeathReportExecuted == 1 ? 'success' : 'error'"
        >
          {{ item.IsDeathReportExecuted ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.IsMartyrdomReportExecuted="{ item }">
        <v-chip
            :color="item.IsMartyrdomReportExecuted == 1 ? 'success' : 'error'"
        >
          {{ item.IsMartyrdomReportExecuted ? "نعم" : "لا" }}
        </v-chip>
      </template>
        <template v-slot:item.IsInjuryHealed="{ item }">
        <v-chip
            :color="item.IsInjuryHealed == 1 ? 'success' : 'error'"
        >
          {{ item.IsInjuryHealed ? "تم الشفاء" : "لم يتم الشفاء" }}
        </v-chip>
      </template>
              <template v-slot:item.IsHealedWithDeformity="{ item }">
        <v-chip
            :color="item.IsHealedWithDeformity == 1 ? 'success' : 'error'"
        >
          {{ item.IsHealedWithDeformity ? "شفي بعاهة" : "شفي بدون عاهة" }}
        </v-chip>
      </template>
      <template v-slot:item.CommitteeDecisionForFitting="{ item }">
        <v-chip
            :color="item.CommitteeDecisionForFitting == 1 ? 'success' : 'error'"
        >
          {{ item.CommitteeDecisionForFitting ? "لائق للخدمة" : "غير لائق للخدمة" }}
        </v-chip>
      </template>

    </table-bulider>

    <editor-dialog-bulider
        :title="'إضافة  خسائر بشرية'"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :selects="selects"
        :data="humanLoss"
        @on-submit="saveItem()"
        @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
    <editor-dialog-bulider
        :title="'إختيار النوع'"
        :open="TypeObject.model"
        :loading="createdObject.loading"
        :fields="KindEditor.headers"
        :selects="selects"
        :data="preEditor"
        @on-submit="CompleteEditorData()"
        @on-close="TypeObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../../../Constant").default;


export default {
  name: "HumanLoss",

  mounted() {
    this.init();
    this.findAccidentHumanLoss({});
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    KindEditor: {
      headers: [
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
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
        }
      ]
    },

    TypeObject: {
      model: false,
      item: {}
    },
    preEditor: {},

    humanLoss: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: false,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },

        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          type: "text",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          type: "text",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "نوع الموقف",
          value: "LossStatus",
          searchValue: "LossStatus",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "صدور قرار الوفاة",
          value: "IsDeathReportExecuted",
          searchValue: "IsDeathReportExecuted",
          type: "select",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: true
        },
        {
          text: "صدور قرار الشهادة",
          value: "IsMartyrdomReportExecuted",
          searchValue: "IsMartyrdomReportExecuted",
          type: "select",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: true
        },
        {
          text: "حالة الشفاء",
          value: "IsHealedWithDeformity",
          searchValue: "IsHealedWithDeformity",
          type: "select",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: true
        },
        {
          text: "قرار اللجنة للياقة الطبية",
          value: "CommitteeDecisionForFitting",
          searchValue: "CommitteeDecisionForFitting",
          type: "select",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: true
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
      ],
      items: [],
      printer: []
    },
    selects: {
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مجند"
          },
          {
            text: "راتب عالي"
          },
          {
            text: "ضابط"
          }
        ]
      },
      LossStatus: {
        text: "text",
        value: "text",
        data: [
          {
            text: "اصابة"
          },
          {
            text: "وفاة"
          },
          {
            text: "استشهاد"
          }
        ]
      },
      IsDeathReportExecuted: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تعم",
            value: true
          }, {
            text: "لا",
            value: false
          },
        ]
      },
      IsMartyrdomReportExecuted: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تعم",
            value: true
          }, {
            text: "لا",
            value: false
          },
        ]
      },
      IsHealedWithDeformity: {
        text: "text",
        value: "value",
        data: [
          {
            text: "شفي بعاهة",
            value: true
          }, {
            text: "شفي بدون عاهة",
            value: false
          },
        ]
      }, CommitteeDecisionForFitting: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لائق للخدمة",
            value: true
          }, {
            text: "غير لائق للخدمة",
            value: false
          },
        ]
      },

    },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  watch: {

    "humanLoss.LossStatus"(v) {

      const deathReportFieldIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "IsDeathReportExecuted"
      );
      const martyrdomReportFieldIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "IsMartyrdomReportExecuted"
      );
      const deformityFieldIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "IsHealedWithDeformity"
      );
      const committeeDecisionFieldIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "CommitteeDecisionForFitting"
      );

      this.mainTable.headers[deathReportFieldIndex].inModel = false;
      this.mainTable.headers[martyrdomReportFieldIndex].inModel = false;
      this.mainTable.headers[deformityFieldIndex].inModel = false;
      this.mainTable.headers[committeeDecisionFieldIndex].inModel = false;
      if (v === "اصابة") {
        this.mainTable.headers[deformityFieldIndex].inModel = true;
      }
      else if(v === "استشهاد"){
        this.mainTable.headers[martyrdomReportFieldIndex].inModel = true;
      }
      else if(v === "وفاة"){
        this.mainTable.headers[deathReportFieldIndex].inModel = true;
      }
    },
    "humanLoss.IsHealedWithDeformity"(v) {
      const committeeDecisionFieldIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "CommitteeDecisionForFitting"
      );

      this.mainTable.headers[committeeDecisionFieldIndex].inModel = false;
      if (v ===true) {
        this.mainTable.headers[committeeDecisionFieldIndex].inModel = true;
      }
    },
  },
  methods: {
    async findAccidentHumanLoss(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
            ...filters,
            AccidentID: this.$route.params.id
          },
          likes = ["Name"],
          multi = [];
      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(where, likes, multi),
          table: "HumanLoss",
        });

        let returnedItems  =[];


        result.data.map(ele=>{
          returnedItems.push({
            ...ele,
            // IsDeathReportExecuted : ele.IsDeathReportExecuted ===true?  "نعم" :"لا",
            // IsMartyrdomReportExecuted : ele.IsMartyrdomReportExecuted===true ?   "نعم" :"لا",
            // IsInjuryHealed : ele.IsInjuryHealed===true ?  "تم الشفاء" :"لم يتم الشفاء",
            // IsHealedWithDeformity : ele.IsHealedWithDeformity===true ?  "شفي بعاهة" :"شفي بدون عاهة",
            // CommitteeDecisionForFitting : ele.CommitteeDecisionForFitting ===true?  "لائق للخدمة" :"غير لائق للخدمة",
          })
        })

        this.$set(this.mainTable, "items", returnedItems);
        this.$set(this.mainTable, "printer", {
          data: returnedItems,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", false);
      let saveItem;
      this.$set(this, "humanLoss", {...this.humanLoss, AccidentID: this.$route.params.id})
      try {
        saveItem = await this.api(
            `global/${this.humanLoss.isEdit ? "update_one" : "create_one"}`,
            {
              table: "HumanLoss",
              where: !this.humanLoss.isEdit
                  ? this.humanLoss
                  : {
                    ID_KEY: this.humanLoss.ID_KEY
                  },
              update: this.humanLoss
            }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findAccidentHumanLoss({});
          this.$set(this.createdObject, "model", false);

        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");

        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من حذف هذه الخسائر ؟`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "HumanLoss",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          await this.findAccidentHumanLoss({});
        }
      });
    },
    actionAdd() {
      this.$set(this, "humanLoss", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "humanLoss", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "humanLoss" +
          "", {
        ...item,
        isEdit: true
      });
    },


    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.$set(this.createdObject, "loading", true);

      if (this.preEditor.Type == "مجند") {
        this.findIDData(this.preEditor.ID, "Soldier");
      } else if (this.preEditor.Type == "راتب عالي") {
        this.findIDData(this.preEditor.ID, "Rateb");
      } else if (this.preEditor.Type == "ضابط") {
        this.$set(this.createdObject, "loading", true);
        this.$set(this.createdObject, "model", true);
        this.$set(this.createdObject, "loading", false);

      }
      this.$set(this.humanLoss, "ID", this.preEditor.ID);
      this.$set(this.humanLoss, "Type", this.preEditor.Type);
    },

    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.humanLoss, "Name", data.Person.Name);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }

  }
};
</script>
