<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المتفوقين دراسيا"
      addBtnTitle="إضافة طالب جديد"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المتفوقين دراسيا'"
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
      <template v-slot:item.HonorText="{ item }">
        <v-chip @click="actionHonor(item)" :color="item.color">
          {{ item.HonorText }}
        </v-chip>
      </template>
      <template v-slot:item.RejectText="{ item }">
        <v-chip @click="actionRemove(item)" :color="item.colorReject">
          {{ item.RejectText }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة متفوق دراسيا'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="academicallyExcellent"
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
    <editor-dialog-bulider
      :title="'عملية الإستبعاد'"
      :open="showRemoveDialog"
      :loading="searchLoading"
      :fields="removeData"
      :data="removedItem"
      @on-close="showRemoveDialog = false"
      @on-submit="actionReject(removedItem)"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
export default {
  name: "AcademicallyExcellence",
  async mounted() {
    this.init();
    this.selects.HonorYear.data = _.range(2010, 3000, 1);
    await this.fetchCertificatesWithRewards();
  },
  data: () => ({
    showRemoveDialog: false,

    removedItem: {},
    removeData: [
      {
        text: "سبب الإستبعاد",
        value: "RejectNotes",
        searchValue: "RejectNotes",
        sortable: true,
        type: "textarea",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    isRemovedData: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
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
    preEditor: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    academicallyExcellent: {},
    search: {},
    certificatesWithRewards: [],
    searchLoading: false,
    removeLoading: false,
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
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Person.Level",
          searchValue: "Level",
          type: "select",
          sortable: true,
          multiple: true,
          inTable: true,
          inSearch: true,
          readOnly: true,
          inModel: true
        },
        {
          text: "الدرجة وقت التكريم",
          value: "HonoringLevel",
          searchValue: "HonoringLevel",
          type: "select",
          sortable: true,
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
          multiple: true,
          readOnly: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "اسم الطالب",
          value: "ChildName",
          searchValue: "ChildName",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الشهادة",
          value: "DegreeType",
          searchValue: "DegreeType",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Degree",
          searchValue: "Degree",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "النسبة",
          value: "Percent",
          searchValue: "Percent",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "حالة الإستبعاد",
          value: "RejectText",
          searchValue: "isReject",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          sort: 1
        },
        {
          text: "عام التكريم",
          value: "HonorYear",
          searchValue: "HonorYear",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          multiple: true,
          sort: 1
        },
        {
          text: "التكريم",
          value: "Honor",
          searchValue: "Honor",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "حالة التكريم",
          value: "HonorText",
          searchValue: "isHonor",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      DegreeType: {
        text: "text",
        value: "text"
        // data: [
        //   {
        //     text: "اعدادية"
        //   },
        //   {
        //     text: "ثانوية"
        //   },
        //   {
        //     text: "جامعية"
        //   },
        //   {
        //     text: "دراسات عليا"
        //   }
        // ]
      },
      isHonor: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تم التكريم",
            value: true
          },
          {
            text: "لم يتم التكريم",
            value: false
          }
        ]
      },
      isReject: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تم الإستبعاد",
            value: true
          },
          {
            text: "لم يتم الإستبعاد",
            value: false
          }
        ]
      },
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "راتب عالي"
          },
          {
            text: "ضابط"
          }
        ]
      },
      HonorYear: {
        text: "text",
        value: "text",
        data: []
      },
      Nesba: {
        text: "text",
        value: "text",
        data: ["جيد جدا مع مرتبة الشرف", "امتياز مع مرتبة الشرف"]
      },
      Level: {
        text: "text",
        value: "text",
        data: [...constants.SoldierLevel.data, ...constants.OfficerLevels.data]
      },
      HonoringLevel: {
        text: "text",
        value: "text",
        data: [...constants.SoldierLevel.data, ...constants.OfficerLevels.data]
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  watch: {
    "academicallyExcellent.Type"(v) {
      if (v == "راتب عالي") {
        this.findRateb(this.academicallyExcellent.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "ضابط") {
        this.selects.Level.data = constants.OfficerLevels.data;
      }
    },
    "academicallyExcellent.isReject"(v) {
      if (v) {
        this.mainTable.headers.find(
          ele => ele.searchValue == "RejectNotes"
        ).inModel = true;
      }
    },
    "academicallyExcellent.DegreeType"(v) {
      this.academicallyExcellent.Honor = this.certificatesWithRewards.find(
        ele => ele.Certificate === v
      ).Reward;

      if (v.includes("دراسا")) {
        this.mainTable.headers.find(ele => ele.value == "Percent").type =
          "select";
        this.mainTable.headers.find(ele => ele.value == "Percent").searchValue =
          "Nesba";
      } else {
        this.mainTable.headers.find(ele => ele.value == "Percent").type =
          "text";
        this.mainTable.headers.find(ele => ele.value == "Percent").searchValue =
          "Percent";
      }
    }
  },
  methods: {
    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    actionReject(item) {
      this.$set(this, "searchLoading", true);

      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isReject) {
              await this.api(`global/update_one`, {
                table: "AcademicallyExcellence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isReject: false,
                  RejectNotes: this.academicallyExcellent.RejectNotes
                }
              });
            } else if (!item.isReject) {
              await this.api(`global/update_one`, {
                table: "AcademicallyExcellence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isReject: true,
                  RejectNotes: this.academicallyExcellent.RejectNotes
                }
              });
            }
            this.findItems({});
            this.$set(this, "showRemoveDialog", false);
            this.$set(this, "searchLoading", false);
          }
        })
        .catch(e => {
          this.handleError(e);
        });
    },
    actionHonor(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isHonor) {
              await this.api(`global/update_one`, {
                table: "AcademicallyExcellence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHonor: false
                }
              });
            } else if (!item.isHonor) {
              await this.api(`global/update_one`, {
                table: "AcademicallyExcellence",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHonor: true
                }
              });
            }
            await this.findItems({});
          }
        })
        .catch(e => {
          this.handleError(e);
        });
    },

    async fetchCertificatesWithRewards() {
      let data = await this.api("global/get_all", {
        table: "CertificatesWithRewards"
      });

      this.$set(this, "certificatesWithRewards", data.data);

      this.selects.DegreeType.data = data.data.map(ele => ele.Certificate);
    },
    async findItems(filters) {
      this.$set(this, "items", []);
      let where = {
          ...filters,
          UnitID: "",
          Religion: "",
          Level: "",
          KnowledgeLevel: "",
          MartialStatus: "",
          Name: ""
        },
        likes = ["ID", "Name"],
        multi = ["HonorYear"],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      let x = await this.api("global/get_all", {
        table: "AcademicallyExcellence",
        where,
        include: [
          {
            model: "Unit"
          }
        ]
      });
      let data = x.data.map(ele => ({
        ...ele,
        HonorText: ele.isHonor ? "تم التكريم" : "لم يتم التكريم",
        color: ele.isHonor ? "success" : "gray",
        RejectText: ele.isReject ? "تم الإستبعاد" : "لم يتم الإستبعاد",
        colorReject: ele.isReject ? "error" : "gray"
      }));
      let items = [];
      for (const ele of data) {
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
      console.log("medical", this.academicallyExcellent);
      saveItem = await this.api(
        `global/${
          this.academicallyExcellent.isEdit ? "update_one" : "create_one"
        }`,
        {
          table: "AcademicallyExcellence",
          where: !this.academicallyExcellent.isEdit
            ? this.academicallyExcellent
            : {
                ID_KEY: this.academicallyExcellent.ID_KEY
              },
          update: this.academicallyExcellent
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
      this.$set(this, "academicallyExcellent", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "academicallyExcellent", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "academicallyExcellent", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "AcademicallyExcellence",
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

      this.$set(this.academicallyExcellent, "ID", this.preEditor.ID);
      this.$set(this.academicallyExcellent, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.academicallyExcellent, "Name", data.Person.Name);
      this.$set(this.academicallyExcellent, "UnitID", data.Person.UnitID);
      this.$set(
        this.academicallyExcellent,
        "KnowledgeLevel",
        data.Person.KnowledgeLevel
      );
      this.$set(this.academicallyExcellent, "Level", data.Person.Level);
      this.$set(this.academicallyExcellent, "Status", data.Person.Status);
      this.$set(this.academicallyExcellent, "Level", data.Person.Level);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
