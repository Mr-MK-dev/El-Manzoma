<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الالتماسات العامة"
      addBtnTitle="إضافة التماس جديد"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الإلتماسات العامة'"
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
      <template v-slot:item.IsVerified="{ item }">
        <v-chip
            :color="item.IsVerified ? 'success' : 'error'"
        >
          {{ item.IsVerified ? "تم التصديق" : "لم يتم التصديق" }}
        </v-chip>
      </template>

    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة التماس'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="generalRequest"
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
  name: "GeneralRequests",
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
    generalRequest: {},
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
          text: "الدرجة",
          value: "Person.Level",
          searchValue: "Level",
          type: "select",
          sortable: true,
          inTable: true,
          multiple: true,
          readOnly: true,
          inSearch: true,
          inModel: true
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
          text: "الوحدة",
          value: "Person.Unit.Unit",
          searchValue: "UnitID",
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
          text: "تاريخ  الإلتماس",
          value: "DateOfRequest",
          searchValue: "DateOfRequest",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },
        {
          text: "تاريخ التصديق",
          value: "VerificationDate",
          searchValue: "VerificationDate",
          sortable: true,
          type: "date",
          inTable: true,
          inSearch: true,
          inModel: true,
          sort: 1
        },
        {
          text: " بيان الالتماس",
          value: "SecretariatVerification",
          searchValue: "SecretariatVerification",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "المستفيد من التصديق",
          value: "RequestBeneficial",
          searchValue: "RequestBeneficial",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الحالة",
          value: "Person.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          multiple: true,
          inTable: true,
          inSearch: true,
          readOnly: true,
          inModel: true
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
          text: "نوع الإلتماس",
          value: "RequestType",
          searchValue: "RequestType",
          type: "select",
          sortable: true,
          isInvisible: true,
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true
        },

        {
          text: "المبلغ المنصرف",
          value: "spentAmount",
          searchValue: "spentAmount",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم الهاتف",
          value: "Person.PhoneNumber",
          searchValue: "PhoneNumber",
          sortable: true,
          type: "text",
          isInvisible:true,
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },

        {
          text: "تم التصديق",
          value: "IsVerified",
          searchValue: "IsVerified",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم التصديق",
          value: "VerificationNumber",
          searchValue: "VerificationNumber",
          sortable: true,
          type: "text",
          isInvisible:true,
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "النتيجة",
          value: "Result",
          searchValue: "Result",
          sortable: true,
          type: "text",
          isInvisible:true,
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
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
      RequestType: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مالي"
          },
          {
            text: "معاش"
          },
          {
            text: "شخصي"
          }
        ]
      },
      IsVerified: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تم التصديق",
            value :true
          },
          {
            text: "لم يتم التصديق",
            value: false
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
      }
    }
  }),
  watch: {
    "generalRequest.Type"(v) {
      if (v == "مجند") {
        this.findSoldier(this.generalRequest.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "راتب عالي") {
        this.findRateb(this.generalRequest.ID);
        this.selects.Level.data = constants.SoldierLevel.data;
      } else if (v == "ضابط") {
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
          Name: ""
        },
        likes = ["ID", "Name"],
        multi = [],
        date = ["DateOfRequest", "VerificationDate"];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "GeneralRequests",
        where
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

      if (filters.Name && filters.Name != "" ) {
        items = items.filter(ele => ele.Person.Name.includes(filters.Name));
      } else {
        if( items.length >0){
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

      }

      console.log("Items ara" , items);
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
      console.log("general", this.generalRequest);
      saveItem = await this.api(
        `global/${this.generalRequest.isEdit ? "update_one" : "create_one"}`,
        {
          table: "GeneralRequests",
          where: !this.generalRequest.isEdit
            ? this.generalRequest
            : {
                ID_KEY: this.generalRequest.ID_KEY
              },
          update: this.generalRequest
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
      this.$set(this, "generalRequest", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "generalRequest", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "generalRequest", {
        ...item,
        ...item.Person,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "GeneralRequests",
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

      this.$set(this.generalRequest, "ID", this.preEditor.ID);
      this.$set(this.generalRequest, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Person");
      this.$set(this.generalRequest, "Name", data.Person.Name);
      this.$set(this.generalRequest, "UnitID", data.Person.UnitID);
      this.$set(
        this.generalRequest,
        "KnowledgeLevel",
        data.Person.KnowledgeLevel
      );
      this.$set(this.generalRequest, "Level", data.Person.Level);
      this.$set(this.generalRequest, "Address", data.Person.Address);
      this.$set(this.generalRequest, "Religion", data.Person.Religion);
      this.$set(
        this.generalRequest,
        "MartialStatus",
        data.Person.MartialStatus
      );
      this.$set(this.generalRequest, "PhoneNumber", data.Person.PhoneNumber);
      this.$set(this.generalRequest, "IdentityNo", data.Person.IdentityNo);
      this.$set(this.generalRequest, "Status", data.Person.Status);
      this.$set(this.generalRequest, "Level", data.Person.Level);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
