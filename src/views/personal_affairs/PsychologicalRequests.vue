<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الحالات النفسية"
      addBtnTitle="إضافة حالة جديدة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الحالات النفسية'"
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
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة حالة جديدة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="medicalRequest"
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
export default {
  name: "PsychologicalRequests",
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
    preEditor: {},
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

    medicalRequest: {},
    search: {},
    searchLoading: false,
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
          readOnly: true,
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
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Person.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          required: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Person.Level",
          searchValue: "Level",
          type: "select",
          sortable: true,
          multiple: true,
          readOnly: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "الحالة",
          value: "Person.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          multiple: true,
          readOnly: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "الوحدة",
          value: "Person.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          readOnly: true,
          multiple: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ  الدخول",
          value: "DateOfEntrance",
          searchValue: "DateOfEntrance",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "تاريخ  الخروج",
          value: "DateOfLeave",
          searchValue: "DateOfLeave",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "المستشفى",
          value: "Hospital.Name",
          searchValue: "HospitalID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Person.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          readOnly: true,
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "موقف الللجنة النفسية",
          value: "PsychoPreview",
          searchValue: "PsychoPreview",
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "موقف الانتقاء و التوجيه",
          value: "SelectionPreview",
          searchValue: "SelectionPreview",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "حالة المتابعة",
          value: "FollowStatus",
          searchValue: "FollowStatus",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع المرض",
          value: "IllnessType",
          searchValue: "IllnessType",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "قرار اللجنة",
          value: "CommitteeDecision",
          searchValue: "CommitteeDecision",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "العقوبة الموقعة",
          value: "Punishment",
          searchValue: "Punishment",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "قرار السببية",
          value: "CausationDecision",
          searchValue: "CausationDecision",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم السببية",
          value: "CausationNumber",
          searchValue: "CausationNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ السببية",
          value: "CausationDate",
          searchValue: "CausationDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
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
      FollowStatus: {
        text: "text",
        value: "text",
        data: [
          {
            text: "يتابع"
          },
          {
            text: "لا يتابع"
          }
        ]
      },
      PsychoPreview: {
        text: "text",
        value: "text",
        data: [
          {
            text: "تم العرض"
          },
          {
            text: "لم يتم العرض"
          }
        ]
      },
      SelectionPreview: {
        text: "text",
        value: "text",
        data: [
          {
            text: "تم العرض"
          },
          {
            text: "لم يتم العرض"
          }
        ]
      },
      IllnessType: {
        text: "text",
        value: "text",
        data: [
          {
            text: "عصاب مزمن شديد"
          },
          {
            text: "مرض عقلي"
          },
          {
            text: "اضطراب شخصية"
          },
          {
            text: "صرع"
          },
          {
            text: "أمراض اخرى"
          }
        ]
      },
      CommitteeDecision: {
        text: "text",
        value: "text",
        data: [
          {
            text: "لائق"
          },
          {
            text: "غير لائق"
          },
          {
            text: "لائق للمستوى الأدنى"
          },
          {
            text: "متمارض"
          },
          {
            text: "لم يتم عرضه"
          }
        ]
      },
      CausationDecision: {
        text: "text",
        value: "text",
        data: [
          {
            text: "قبل الخدمة و ليس بسببها"
          },
          {
            text: "أثناء الخدمة و ليس بسببها"
          },
          {
            text: "أثناء الخدمة وبسببها"
          },
          {
            text: "أثناء الخدمة وبسببها طبقا للمادة 31"
          },
          {
            text: "لم يصدر له قرار"
          }
        ]
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
      RequestBeneficial: {
        text: "text",
        value: "text",
        data: constants.beneficials.data
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      HospitalID: {
        table: "Hospital",
        value: "ID_KEY",
        text: "Name"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        table: "RecStages",
        value: "ID",
        text: "Name"
      }
    }
  }),
  watch: {
    "medicalRequest.Type"(v) {
      if (v == "مجند") {
        this.findSoldier(this.medicalRequest.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "راتب عالي") {
        this.findRateb(this.medicalRequest.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "ضابط") {
        this.findOfficer(this.medicalRequest.ID);
        this.selects.Level.data = constants.OfficerLevels.data;
      }
    }
  },
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          UnitID: "",
          Religion: "",
          Level: "",
          KnowledgeLevel: "",
          MartialStatus: "",
          WeaponID: "",
          Name: ""
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["DateOfEntrance", "DateOfLeave", "CausationDate"];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where", where);

      let data = await this.api("global/get_all", {
        table: "PsychologicalRequests",
        where,
        include: [
          {
            model: "Unit"
          },
          {
            model: "Hospital"
          }
        ]
      });
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
      console.log("Data", items);

      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Person.Name.includes(filters.Name));
      } else {
        let PersonKeys = Object.keys(items[0].Person);
        let filterKeys = Object.keys(filters);
        let filteredArray = filterKeys?.filter(ele =>
          PersonKeys?.includes(ele)
        );

        for (let i = 0; i < filteredArray.length; i++) {
          console.log("keys", filteredArray[i]);
          items = items?.filter(ele =>
            filters?.[`${filteredArray[i]}`]?.includes(
              ele?.Person?.[`${filteredArray[i]}`]
            )
          );
        }
      }

      this.$set(this.mainTable, "items", items);
      this.$set(this.mainTable, "printer", {
        data: items,
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable),
        hasParent: true
      });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      console.log("medical", this.medicalRequest);
      saveItem = await this.api(
        `global/${this.medicalRequest.isEdit ? "update_one" : "create_one"}`,
        {
          table: "PsychologicalRequests",
          where: !this.medicalRequest.isEdit
            ? this.medicalRequest
            : {
                ID_KEY: this.medicalRequest.ID_KEY
              },
          update: this.medicalRequest
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
      this.$set(this, "medicalRequest", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "medicalRequest", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "medicalRequest", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "PsychologicalRequests",
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

      if (this.preEditor.Type == "مجند") {
        this.findIDData(this.preEditor.ID, "Soldier");
      } else if (this.preEditor.Type == "راتب عالي") {
        this.findIDData(this.preEditor.ID, "Rateb");
      } else if (this.preEditor.Type == "ضابط") {
        this.findIDData(this.preEditor.ID, "Officer");
      }

      this.$set(this.medicalRequest, "ID", this.preEditor.ID);
      this.$set(this.medicalRequest, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.medicalRequest, "Name", data.Person.Name);
      this.$set(this.medicalRequest, "UnitID", data.Person.UnitID);
      this.$set(
        this.medicalRequest,
        "KnowledgeLevel",
        data.Person.KnowledgeLevel
      );
      this.$set(this.medicalRequest, "Level", data.Person.Level);
      this.$set(this.medicalRequest, "Address", data.Person.Address);
      this.$set(this.medicalRequest, "Religion", data.Person.Religion);
      this.$set(
        this.medicalRequest,
        "KnowledgeLevel",
        data.Person.KnowledgeLevel
      );
      this.$set(
        this.medicalRequest,
        "MartialStatus",
        data.Person.MartialStatus
      );
      this.$set(this.medicalRequest, "PhoneNumber", data.Person.PhoneNumber);
      this.$set(this.medicalRequest, "IdentityNo", data.Person.IdentityNo);
      this.$set(this.medicalRequest, "Status", data.Person.Status);
      this.$set(this.medicalRequest, "Level", data.Person.Level);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
