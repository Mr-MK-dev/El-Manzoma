<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في التطعيمات المعززة"
      addBtnTitle="إضافة جرعة جديدة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التطعيمات المعززة'"
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
            @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة جرعة جديدة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="vaccinator"
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
  name: "Vaccinators",
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
    vaccinator: {},
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
          readOnly: true,
          inSearch: true,
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
          readOnly: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Person.Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          readOnly: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التطعيم ضد",
          value: "Disease.Name",
          searchValue: "DiseaseID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع التطعيم",
          value: "Vaccine.Name",
          searchValue: "VaccineID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ أخذ الجرعة",
          value: "VaccineDate",
          searchValue: "VaccineDate",
          sortable: true,
          type: "date",
          inSearch: true,
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
          }
          // {
          //   text: "ضابط"
          // }
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
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      },
      DiseaseID: {
        table: "Diseases",
        value: "ID_KEY",
        text: "Name"
      },
      VaccineID: {
        table: "Vaccine",
        value: "ID_KEY",
        text: "Name"
      }
    }
  }),
  watch: {
    "vaccinator.Type"(v) {
      if (v == "مجند") {
        this.findSoldier(this.vaccinator.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "راتب عالي") {
        this.findRateb(this.vaccinator.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      }
      // else if (v == "ضابط") {
      //   this.selects.Level.data = constants.OfficerLevels.data;
      // }
      //
    },
    "vaccinator.DiseasesID"(v) {
      // else if (v == "ضابط") {
      //   this.selects.Level.data = constants.OfficerLevels.data;
      // }
      //
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
        date = ["VaccineDate"];

      where = this.mapToQuery(where, likes, multi, date);
      try {
        let data = await this.api("global/get_all", {
          table: "Vaccinators",
          where,
          include: [
            {
              model: "Diseases"
            },
            {
              model: "Vaccine"
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
      console.log("medical", this.vaccinator);
      saveItem = await this.api(
        `global/${this.vaccinator.isEdit ? "update_one" : "create_one"}`,
        {
          table: "Vaccinators",
          where: !this.vaccinator.isEdit
            ? this.vaccinator
            : {
                ID_KEY: this.vaccinator.ID_KEY
              },
          update: this.vaccinator
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
      this.$set(this, "vaccinator", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "vaccinator", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "vaccinator", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "Vaccinators",
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

      this.$set(this.vaccinator, "ID", this.preEditor.ID);
      this.$set(this.vaccinator, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.vaccinator, "Name", data.Person.Name);
      this.$set(this.vaccinator, "UnitID", data.Person.UnitID);
      this.$set(this.vaccinator, "WeaponID", data.Person.WeaponID);
      this.$set(this.vaccinator, "KnowledgeLevel", data.Person.KnowledgeLevel);
      this.$set(this.vaccinator, "Level", data.Person.Level);
      this.$set(this.vaccinator, "Status", data.Person.Status);
      this.$set(this.vaccinator, "Level", data.Person.Level);
      this.$set(this.vaccinator, "PhoneNumber", data.Person.PhoneNumber);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
