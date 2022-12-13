<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        @on-search="findItems"
        @on-add="actionAdd()"
        :clearOption="true"
        title="بحث متقدم في الشهداء"
        addBtnTitle="إضافة بيان شهيد"
    />
    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'الشهداء'"
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
      <template v-slot:item.isSupporter="{ item }">
        <v-chip :color="item.isSupporter == 1 ? 'success' : 'error'">
          {{ item.isSupporter ? "يعول" : "لا يعول" }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
        :title="'إضافة بيان شهيد'"
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
  name: "Martyrs",
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
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Martyr.Level",
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
          value: "Martyr.Name",
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
          value: "Martyr.Unit.Unit",
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
          text: "السلاح",
          value: "Martyr.Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "المؤهل",
          value: "Martyr.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: false,
          inModel: true,
          inSearch: false,
          readOnly: true,

          sort: 1
        },
        {
          text: "العنوان",
          value: "Martyr.Address",
          searchValue: "Address",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الرقم القومي",
          value: "Martyr.IdentityNo",
          searchValue: "IdentityNo",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          readOnly: false,
          inModel: true
        },
        {
          text: "تاريخ الاستشهاد",
          value: "DateOfIncident",
          searchValue: "DateOfIncident",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: false,
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
          text: "اسم الحرب",
          value: "War.War",
          searchValue: "WarID",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "قرار السببيه",
          value: "ReasonOrder",
          searchValue: "ReasonOrder",
          type: "select",
          sortable: true,
          inTable: false,
          inSearch: false,
          inModel: false
        },
        {
          text: "الحالة الاجتماعية",
          value: "Martyr.MartialStatus",
          searchValue: "MartialStatus",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          notMultipleInModel: true,
          inModel: true
        },
        {
          text: "يعول",
          value: "isSupporter",
          searchValue: "isSupporter",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "الديانة",
          value: "Martyr.Religion",
          searchValue: "Religion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          readOnly: true,
          sort: 6
        },
        {
          text: "رقم التليفون",
          value: "Martyr.PhoneNumber",
          searchValue: "PhoneNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 6
        },
        {
          text: "التفاصيل الداخلية",
          value: "ProfileDetails",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
        // ,
        // {
        //   text: "حصل على تكريم",
        //   value: "receivedTakreem",
        //   searchValue: "receivedTakreem",
        //   sortable: false,
        //   inSearch: true,
        //   inModel: false,
        //   inTable: false,
        //   type: "select",
        //   sort: 5
        // },
        // {
        //   text: "حصل على توظيف",
        //   value: "receivedJob",
        //   searchValue: "receivedJob",
        //   sortable: false,
        //   inSearch: true,
        //   inModel: false,
        //   inTable: false,
        //   type: "select",
        //   sort: 5
        // },
        // {
        //   text: "حصل على حج او عمرة",
        //   value: "receivedHajj",
        //   searchValue: "receivedHajj",
        //   sortable: false,
        //   inSearch: true,
        //   inModel: false,
        //   inTable: false,
        //   type: "select",
        //   sort: 5
        // },
        // {
        //   text: "حصل على إطلاق اسم شهيد",
        //   value: "receivedAnnouncment",
        //   searchValue: "receivedAnnouncment",
        //   sortable: false,
        //   inSearch: true,
        //   inModel: false,
        //   inTable: false,
        //   type: "select",
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
      isSupporter: {
        text: "text",
        value: "value",
        data: [
          {text: "يعول", value: true},
          {text: "لا يعول", value: false}
        ]
      },
      receivedTakreem: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ]
      },
      receivedJob: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ]
      },
      receivedHajj: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ]
      },
      receivedAnnouncment: {
        data: [
          {
            text: "نعم",
            value: true
          },
          {
            text: "لا",
            value: false
          }
        ]
      },
      ReasonOrder: {
        table: "ReasonsDecisions",
        value: "Reason",
        text: "Reason"
        // text: "text",
        // value: "text",
        // data: [
        //   {
        //     text: "شهيد"
        //   },
        //   {
        //     text: "وفاه مادة 31"
        //   },
        //   {
        //     text: "أثناء الخدمة وبسببها"
        //   },
        //   {
        //     text: "أثناء الخدمة وليس بسببها"
        //   },
        //   {
        //     text: "في غير أثناء الخدمة وليس بسببها"
        //   },
        //   {
        //     text: "حروب سابقة"
        //   }
        // ]
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
      WarID: {
        table: "Wars",
        value: "ID_KEY",
        text: "War"
        // text: "text",
        // value: "text",
        // data: ["حرب 56", "حرب الاستنزاف"]
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      }
    }
  }),
  watch: {
    // "martyr.Type"(v) {
    //   if (v == "مجند") {
    //     this.findSoldier(this.martyr.ID);
    //   } else if (v == "راتب عالي") {
    //     this.findRateb(this.martyr.ID);
    //   }
    // }
  },
  methods: {
    actionRouteToProfileDetails(item) {
      this.$router.push(
          `/MartyrsProfileIndex/${item.ID}/${item.Kind}/${item.Type}`
      );
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters,
            Kind: "شهيد",
            ReasonOrder: "شهيد",
            UnitID: "",
            WeaponID: "",
            Religion: "",
            MartialStatus: "",
            Name: ""

          },
          likes = ["ID"],
          multi = ["Type"],
          date = ["DateOfIncident"];

      where = this.mapToQuery(where, likes, multi, date);
      console.log("where", where);
      let data = await this.api("global/get_all", {
        table: "MartyrsAndInjuredAndDeath",
        where,
        include: [
          {
            model: "Wars"
          }
        ]
      });
      console.log("data", data);

      let items = [];
      for (const ele of data.data) {
        var martyr = await this.fetchDataBaseOnType(
            ele.ID,
            ele.Type == "مجند"
                ? "Soldier"
                : ele.Type == "ضابط"
                    ? "Officer"
                    : "Rateb",
            "Martyr"
        );
        items.push({
          ...ele,
          ...martyr
        });
      }
      // this code suposed to filter the fildes after getting for the db
      if (filters.WeaponID != null && filters.WeaponID.length > 0) {
        items = items.filter(ele =>
            filters.WeaponID.includes(ele.Martyr.WeaponID)
        );
      }
      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Martyr.Name.includes(filters.Name));
      } else {
        let MartyrKeys = Object.keys(items[0].Martyr);
        let filterKeys = Object.keys(filters);

        let filteredArray = filterKeys.filter(ele => MartyrKeys.includes(ele));

        for (let i = 0; i < filteredArray.length; i++) {
          items = items.filter(ele =>
              filters?.[`${filteredArray[i]}`]?.includes(
                  ele?.Martyr?.[`${filteredArray[i]}`]
              )
          );
        }
      }
      console.log(items);
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
      console.log("martyr", this.martyr);

      try {
        saveItem = await this.api(
            `global/${this.martyr.isEdit ? "update_one" : "create_one"}`,
            {
              table: "MartyrsAndInjuredAndDeath",
              where: !this.martyr.isEdit
                  ? {
                    ...this.martyr,
                    Kind: "شهيد"
                  }
                  : {
                    ID_KEY: this.martyr.ID_KEY
                  },
              update: {
                ...this.martyr
              }
            }
        );
        if (this.martyr.Type.includes("راتب عالي")) {
          await this.api(`global/update_one`, {
            table: "Rateb",
            where: {
              ID: this.martyr.ID
            },
            update: {
              MartialStatus: this.martyr.MartialStatus,
              Address: this.martyr.Address,
              IdentityNo: this.martyr.IdentityNo,
              SoldierTELE: this.martyr.PhoneNumber
            }
          });
        }
        if (this.martyr.Type.includes("ضابط")) {
          await this.api(`global/update_one`, {
            table: "Officers",
            where: {
              ID: this.martyr.ID
            },
            update: {
              MartialStatus: this.martyr.MartialStatus,
              Address: this.martyr.Address,
              IdentityNo: this.martyr.IdentityNo,
              PhoneNumber: this.martyr.PhoneNumber
            }
          });
        }
        if (this.martyr.Type.includes("مجند")) {
          await this.api(`global/update_one`, {
            table: "Soldier",
            where: {
              ID: this.martyr.ID
            },
            update: {
              MartialStatus: this.martyr.MartialStatus,
              Address: this.martyr.Address,
              IdentityNo: this.martyr.IdentityNo,
              SoldierTELE: this.martyr.PhoneNumber
            }
          });
        }

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
      this.$set(this, "martyr", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "martyr", {isEdit: false, ReasonOrder: "شهيد"});

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "martyr", {});
      this.$set(this, "martyr", {
        ...item,
        ...item.Martyr,
        isEdit: true,
        ReasonOrder: "شهيد"
      });

      this.$set(this.createdObject, "model", true);
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let {id, type} = this.del,
          delItem = await this.api("global/delete_all", {
            table: "MartyrsAndInjuredAndDeath",
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
      this.$set(this.martyr, "ID", this.preEditor.ID);
      this.$set(this.martyr, "Type", this.preEditor.Type);
    },
    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Martyr");
      this.$set(this.martyr, "Name", data.Martyr.Name);
      this.$set(this.martyr, "UnitID", data.Martyr.UnitID);
      this.$set(this.martyr, "KnowledgeLevel", data.Martyr.KnowledgeLevel);
      this.$set(this.martyr, "Level", data.Martyr.Level);
      this.$set(this.martyr, "Address", data.Martyr.Address);
      this.$set(this.martyr, "Religion", data.Martyr.Religion);
      this.$set(this.martyr, "MartialStatus", data.Martyr.MartialStatus);
      this.$set(this.martyr, "PhoneNumber", data.Martyr.PhoneNumber);
      this.$set(this.martyr, "IdentityNo", data.Martyr.IdentityNo);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);
      return data;
    }
  }
};
</script>
