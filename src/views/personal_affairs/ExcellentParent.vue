<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في  الاباء المثاليين"
      addBtnTitle="إضافة اب او ام مثاليين"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الأب المثالي وأم المثالية'"
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
      :title="'إضافة اب و أم مثالي'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="excellentParent"
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
  name: "ExcellentParent",
  async mounted() {
    this.init();
    this.selects.HonorYear.data = _.range(2010, 3000, 1);
    await this.fetchGradesWithRewards();
  },
  data: () => ({
    showRemoveDialog: false,
    removeLoading: false,
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
    gradesWithRewards: [],
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
    excellentParent: {},
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
          text: "القائم بالترشيح",
          value: "Person.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          readOnly: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Person.Level",
          searchValue: "Level",
          type: "select",
          sortable: true,
          inTable: true,
          readOnly: true,
          inSearch: true,
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
          readOnly: true,
          inSearch: true,
          inTable: true,
          multiple: true,
          inModel: true,
          sort: 1
        },
        {
          text: "صلة القرابة",
          value: "ParentType",
          searchValue: "ParentType",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "اسم",
          value: "ParentName",
          searchValue: "ParentName",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
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
          text: "المركز",
          value: "Place",
          searchValue: "Place",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
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
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "أسباب الرفض",
          value: "RejectNotes",
          searchValue: "RejectNotes",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      ParentType: {
        text: "text",
        value: "text",
        data: [
          {
            text: "أب"
          },
          {
            text: "أم"
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
      Place: {
        text: "text",
        value: "text",
        data: []
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
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  watch: {
    "excellentParent.Type"(v) {
      if (v == "راتب عالي") {
        this.findRateb(this.excellentParent.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "ضابط") {
        this.selects.Level.data = constants.OfficerLevels.data;
      }
    },
    "excellentParent.isReject"(v) {
      if (v) {
        this.mainTable.headers.find(
          ele => ele.searchValue == "RejectNotes"
        ).inModel = true;
      }
    },
    "excellentParent.Place"(v) {
      this.excellentParent.Honor = this.gradesWithRewards.find(
        ele => ele.Grade === v
      ).Reward;
    }
  },
  methods: {
    actionRemove(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    async fetchGradesWithRewards() {
      let data = await this.api("global/get_all", {
        table: "GradesWithRewards"
      });

      this.$set(this, "gradesWithRewards", data.data);

      this.selects.Place.data = data.data.map(ele => ele.Grade);
    },
    actionHonor(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            if (item.isHonor) {
              await this.api(`global/update_one`, {
                table: "ExcellentParent",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHonor: false
                }
              });
            } else if (!item.isHonor) {
              await this.api(`global/update_one`, {
                table: "ExcellentParent",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isHonor: true
                }
              });
            }
            this.findItems({});
          }
        })
        .catch(e => {
          this.handleError(e);
        });
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
                table: "ExcellentParent",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isReject: false,
                  RejectNotes: this.removedItem.RejectNotes
                }
              });
            } else if (!item.isReject) {
              await this.api(`global/update_one`, {
                table: "ExcellentParent",
                where: {
                  ID_KEY: item.ID_KEY
                },
                update: {
                  isReject: true,
                  RejectNotes: this.removedItem.RejectNotes
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
      let data = await this.api("global/get_all", {
        table: "ExcellentParent",
        where,
        include: [
          {
            model: "Unit"
          }
        ]
      });
      data = data.data.map(ele => ({
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
      console.log("medical", this.excellentParent);
      saveItem = await this.api(
        `global/${this.excellentParent.ID_KEY ? "update_one" : "create_one"}`,
        {
          table: "ExcellentParent",
          where: !this.excellentParent.ID_KEY
            ? this.excellentParent
            : {
                ID_KEY: this.excellentParent.ID_KEY
              },
          update: this.excellentParent
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
      this.$set(this, "excellentParent", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "excellentParent", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "excellentParent", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "ExcellentParent",
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

      this.$set(this.excellentParent, "ID", this.preEditor.ID);
      this.$set(this.excellentParent, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.excellentParent, "Name", data.Person.Name);
      this.$set(this.excellentParent, "UnitID", data.Person.UnitID);
      this.$set(
        this.excellentParent,
        "KnowledgeLevel",
        data.Person.KnowledgeLevel
      );
      this.$set(this.excellentParent, "Level", data.Person.Level);
      this.$set(this.excellentParent, "Status", data.Person.Status);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
