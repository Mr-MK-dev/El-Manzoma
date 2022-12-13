<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في التحقيقات"
      addBtnTitle="إضافة تحقيق"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التحقيقات'"
    >
      <template v-if="hasEditAccess()" v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="transparent" @click="deleteItem(item)">
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.isFollowed="{ item }">
        <v-chip :color="item.isFollowed == 1 ? 'success' : 'error'">
          {{ item.isFollowed ? "متابع" : "غير متابع" }}
        </v-chip>
      </template>
      <template v-slot:item.isPapersCompleted="{ item }">
        <v-chip :color="item.isPapersCompleted == 1 ? 'success' : 'error'">
          {{ item.isPapersCompleted ? "تم الانتهاء" : "لم يتم الانتهاء" }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة تحقيق'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="investigation"
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
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "Investigations",
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
    preEditor: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    investigation: {},
    search: {},
    searchLoading: false,
    TypeObject: {
      model: false,
      item: {}
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
    mainTable: {
      headers: [
        {
          text: "البيانات الاساسية",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
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
        },
        {
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Person.Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: false,
          required: true,
          multiple: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Person.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Person.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          multiple: true,
          sort: 1
        },
        {
          text: "تاريخ التحقيق",
          value: "DateOfInvestigation",
          searchValue: "DateOfInvestigation",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ الواقعة",
          value: "DateOfIncident",
          searchValue: "DateOfIncident",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "ملخص الواقعة",
          value: "IncidentSummary",
          searchValue: "IncidentSummary",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "مكان الواقعة",
          value: "IncidentPlace",
          searchValue: "IncidentPlace",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "التصرف",
          value: "Action",
          searchValue: "Action",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "متهمين اخريين",
          value: "AnotherSuspects",
          searchValue: "AnotherSuspects",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "الجزاء",
          value: "Penalty",
          searchValue: "Penalty",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "مواد الإتهام",
          value: "Laws",
          searchValue: "Laws",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "المتابعه",
          value: "isFollowed",
          searchValue: "isFollowed",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "إنتهاء الأوراق",
          value: "isPapersCompleted",
          searchValue: "isPapersCompleted",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: false,
          inModel: true
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
      Action: {
        text: "text",
        value: "text",
        data: [
          {
            text: "حفظ الأوراق"
          },
          {
            text: "جزاء إنضباطي"
          },
          {
            text: "إحالة الأوراق للنيابة المختصة"
          },
          {
            text: "إحالة الأوراق للمحكمة العسكرية"
          }
        ]
      },
      ReasonOrder: {
        table: "ReasonsDecisions",
        value: "Reason",
        text: "Reason"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      Level: {
        text: "text",
        value: "text",
        data: [...constants.SoldierLevel.data, ...constants.OfficerLevels.data]
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          UnitID: "",
          Religion: ""
        },
        likes = ["ID", "Name"],
        multi = ["Type"],
        date = ["DateOfIncident", "DateOfInvestigation"];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where", where);
      let data = await this.api("global/get_all", {
        table: "Investigations",
        where
      });
      console.log("data", data);

      let items = [];
      for (const ele of data.data) {
        var Person = await this.fetchDataBaseOnType(
          ele.ID,
          ele.Type == "مجند"
            ? "Soldier"
            : ele.Type == "ضابط"
            ? "Officer"
            : "Rateb",
          "Person"
        );
        items.push({
          ...ele,
          ...Person
        });
      }
      let PersonKeys = Object.keys(items[0].Person);
      let filterKeys = Object.keys(filters);

      let filteredArray = filterKeys.filter(ele => PersonKeys.includes(ele));

      for (let i = 0; i < filteredArray.length; i++) {
        console.log("keys", filteredArray[i]);
        items = items.filter(ele =>
          filters?.[`${filteredArray[i]}`]?.includes(
            ele?.Person?.[`${filteredArray[i]}`]
          )
        );
      }

      this.$set(this.mainTable, "items", items);
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      console.log("investigation", this.investigation);

      try {
        saveItem = await this.api(
          `global/${this.investigation.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Investigations",
            where: !this.investigation.isEdit
              ? {
                  ...this.investigation
                }
              : {
                  ID_KEY: this.investigation.ID_KEY
                },
            update: {
              ...this.investigation
            }
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          console.log("SavedItem", saveItem);
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
      } catch (error) {
        console.log("error", error);
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "investigation", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "investigation", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "investigation", {});
      this.$set(this, "investigation", {
        ...item,
        ...item.investigation,
        isEdit: true
      });

      this.$set(this.createdObject, "model", true);
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Investigations",
          where: {
            ID_KEY: item.ID_KEY
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

    CompleteEditorData() {
      this.$set(this.TypeObject, "model", false);
      this.$set(this.createdObject, "loading", true);

      if (this.preEditor.Type == "مجند") {
        this.findIDData(this.preEditor.ID, "Soldier");
      } else if (this.preEditor.Type == "راتب عالي") {
        this.findIDData(this.preEditor.ID, "Rateb");
      } else if (this.preEditor.Type == "ضابط") {
        this.findIDData(this.preEditor.ID, "Officer");
      }
      this.$set(this.investigation, "ID", this.preEditor.ID);
      this.$set(this.investigation, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "investigation");
      this.$set(this.investigation, "Name", data.investigation.Name);
      this.$set(this.investigation, "UnitID", data.investigation.UnitID);
      this.$set(
        this.investigation,
        "KnowledgeLevel",
        data.investigation.KnowledgeLevel
      );
      this.$set(this.investigation, "Level", data.investigation.Level);
      this.$set(this.investigation, "Address", data.investigation.Address);
      this.$set(this.investigation, "Religion", data.investigation.Religion);
      this.$set(
        this.investigation,
        "MartialStatus",
        data.investigation.MartialStatus
      );
      this.$set(
        this.investigation,
        "PhoneNumber",
        data.investigation.PhoneNumber
      );
      this.$set(
        this.investigation,
        "IdentityNo",
        data.investigation.IdentityNo
      );
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);
      return data;
    }
  }
};
</script>
