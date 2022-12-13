<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المصابين"
      addBtnTitle="إضافة بيان"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المصابين'"
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

      <template v-if="hasEditAccess()" v-slot:item.ProfileDetails="{ item }">
        <v-chip icon color="primary" @click="actionRouteToProfileDetails(item)">
          <v-icon>mdi-information-variant</v-icon>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة بيان مصاب'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="martyr"
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
  name: "Injured",
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

    martyr: {},
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
          readOnly: true,
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
          inTable: false,
          isInvisible :true,
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
          text: "الرقم القومي",
          value: "Person.IdentityNo",
          searchValue: "IdentityNo",
          sortable: true,
          type: "text",
          isInvisible :true,
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم التلفون",
          value: "Person.PhoneNumber",
          searchValue: "PhoneNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          isInvisible :true,
          inTable: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },

        {
          text: "العنوان",
          value: "Person.Address",
          searchValue: "Address",
          sortable: true,
          type: "text",
          inSearch: false,
          isInvisible :true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "المستشفي المعالج",
          value: "Hospital.Name",
          searchValue: "HospitalID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },
        {
          text: "تاريخ الاصابه",
          value: "EnterDate",
          searchValue: "EnterDate",
          type: "date",
          sortable: true,
          inTable: true,
          isInvisible :true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ الدخول",
          value: "EntryDate",
          searchValue: "EntryDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "تاريخ الخروج",
          value: "LeaveDate",
          searchValue: "LeaveDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "بيان حالة الإصابة",
          value: "InjuredStatusDescription",
          searchValue: "InjuredStatusDescription",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },

        {
          text: "ملاحظات الطبية",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "ملخص الواقعة",
          value: "IncidentSummary",
          searchValue: "IncidentSummary",
          type: "text",
          isInvisible :false,
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الوحدة",
          value: "Person.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: true,
          type: "select",
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
          multiple: true,
          sortable: true,
          inTable: true,
          inSearch: true,
          readOnly: true,
          inModel: true
        }

        // {
        //   text: "التفاصيل الداخلية",
        //   value: "ProfileDetails",
        //   searchValue: "",
        //   sortable: true,
        //   inSearch: false,
        //   inModel: false,
        //   inTable: true,
        //   sort: 5
        // }
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

      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
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
      HospitalID: {
        table: "Hospital",
        value: "ID_KEY",
        text: "Name"
      }
    }
  }),
  watch: {
    "martyr.Type"(v) {
      if (v == "مجند") {
        this.findSoldier(this.martyr.ID);
      } else if (v == "راتب عالي") {
        this.findRateb(this.martyr.ID);
      }
    }
  },
  methods: {
    actionRouteToProfileDetails(item) {
      this.$router.push(`/MartyrsProfileIndex/${item.ID}/${item.Kind}`);
    },
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
        multi = ["EnterDate"],
        date = ["EnterDate", "EntryDate", "LeaveDate"];

      where = this.mapToQuery(where, likes, multi, date);

      try {
        let data = await this.api("global/get_all", {
          table: "InjuredHospitals",
          where,
          include: [
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

        if (filters.Name && filters.Name != "") {
          items = items.filter(ele => ele.Person.Name.includes(filters.Name));
        } else {
          let PersonKeys = Object.keys(items[0]?.Person);
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
        console.log("Data", items);
        this.$set(this.mainTable, "items", items);
        console.log("Data", data.data);
        let printer = {
          data: [
            ...items.map(ele => ({
              ...ele
            }))
          ],
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(
            f => f.inTable && f.text.length
          )
        };
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      }
      this.$set(this, "searchLoading", false);
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      console.log("sdfsdf" , this.martyr);
      saveItem = await this.api(
        `global/${this.martyr.isEdit ? "update_one" : "create_one"}`,
        {
          table: "InjuredHospitals",
          where: !this.martyr.isEdit
            ? { ...this.martyr, Kind: "مصاب" }
            : {
                ID_KEY: this.martyr.ID_KEY
              },
          update: this.martyr
        }
      );


      if (this.martyr.Type.includes("راتب عالي")) {
        console.log("THis rateb is " , this.martyr);
        await this.api(`global/update_one`, {
          table: "Rateb",
          where: {
            ID: this.martyr.ID
          },
          update: {
            Address: this.martyr.Address,
            IdentityNo: this.martyr.IdentityNo,
            SoldierTELE: this.martyr.PhoneNumber
          }
        });
      }
      if (this.martyr.Type.includes("ضابط")) {
        console.log("THis officer is " , this.martyr);
        await this.api(`global/update_one`, {
          table: "Officers",
          where: {
            ID: this.martyr.ID
          },
          update: {
            Address: this.martyr.Address,
            IdentityNo: this.martyr.IdentityNo,
            PhoneNumber: this.martyr.PhoneNumber
          }
        });
      }
      if (this.martyr.Type.includes("مجند")) {
        console.log("THis soldier is " , this.martyr);

        await this.api(`global/update_one`, {
          table: "Soldier",
          where: {
            ID: this.martyr.ID
          },
          update: {
            Address: this.martyr.Address,
            IdentityNo: this.martyr.IdentityNo,
            SoldierTELE: this.martyr.PhoneNumber
          }
        });
      }


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
      this.$set(this, "martyr", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "martyr", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "martyr", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "InjuredHospitals",
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

      this.$set(this.martyr, "ID", this.preEditor.ID);
      this.$set(this.martyr, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.martyr, "Name", data.Person.Name);
      this.$set(this.martyr, "UnitID", data.Person.UnitID);
      this.$set(this.martyr, "KnowledgeLevel", data.Person.KnowledgeLevel);
      this.$set(this.martyr, "Level", data.Person.Level);
      this.$set(this.martyr, "Status", data.Person.Status);
      this.$set(this.martyr, "Level", data.Person.Level);
      this.$set(this.martyr, "PhoneNumber", data.Person.PhoneNumber);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
