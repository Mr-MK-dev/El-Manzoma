<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المصابين"
      addBtnTitle="إضافة بيان مصاب"
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
      <template v-slot:item.isSupporter="{ item }">
        <v-chip :color="item.isSupporter == 1 ? 'success' : 'error'">
          {{ item.isSupporter ? "يعول" : "لا يعول" }}
        </v-chip>
      </template>
      <template v-slot:item.isFollowed="{ item }">
        <v-chip :color="item.isSupporter == 1 ? 'success' : 'error'">
          {{ item.isFollowed ? "متابع" : "غير متابع" }}
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة بيان مصاب'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="injured"
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
    preEditor: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    injured: {},
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
          isInvisible :true,
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Injured.Level",
          searchValue: "Level",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Injured.Name",
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
          value: "Injured.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          multiple: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Injured.Weapon.Weapon",
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
          value: "Injured.KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: false,
          isInvisible :true,
          inModel: false,
          multiple: true,
          inSearch: true,
          readOnly: true,

          sort: 1
        },
        {
          text: "العنوان",
          value: "Injured.Address",
          searchValue: "Address",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "الرقم القومي",
          value: "Injured.IdentityNo",
          searchValue: "IdentityNo",
          type: "text",
          sortable: true,
          inTable: true,
          isInvisible :true,
          inSearch: false,
          readOnly: true,
          inModel: false
        },
        {
          text: "تاريخ الاصابة",
          value: "DateOfIncident",
          searchValue: "DateOfIncident",
          type: "date",
          sortable: true,
          inTable: true,
          isInvisible :false,
          inSearch: true,
          required: false,
          inModel: true
        },
        {
          text: "ملخص الوقعة",
          value: "IncidentSummary",
          searchValue: "IncidentSummary",
          type: "text",
          sortable: true,
          inTable: true,
          isInvisible :false,
          inSearch: false,
          required: true,
          inModel: true
        },
        {
          text: "قرار السببيه",
          value: "ReasonOrder",
          searchValue: "ReasonOrder",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "قرار المجلس الطبي",
          value: "MedicalCouncilOrder",
          searchValue: "MedicalCouncilOrder",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "قرار الشفاء النهائي",
          value: "LastRecoveryOrder",
          searchValue: "LastRecoveryOrder",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "نسبة العجز",
          value: "DisabilityRatio",
          searchValue: "DisabilityRatio",
          type: "text",
          sortable: true,
          isInvisible :true,
          inTable: false,
          inSearch: false,
          inModel: true
        },
        {
          text: "حالة المصاب",
          value: "PatientCondition",
          searchValue: "PatientCondition",
          type: "select",
          sortable: true,
          isInvisible :true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "تصنيف الإصابة",
          value: "InjuryCategory",
          searchValue: "InjuryCategory",
          type: "select",
          sortable: true,
          isInvisible :true,
          inTable: false,
          inSearch: true,
          inModel: true
        },
        {
          text: "متابع",
          value: "isFollowed",
          searchValue: "isFollowed",
          type: "select",
          sortable: true,
          inTable: true,
          isInvisible :true,
          inSearch: true,
          inModel: true
        },
        {
          text: "الحالة الاجتماعية",
          value: "Injured.MartialStatus",
          searchValue: "MartialStatus",
          type: "select",
          sortable: true,
          inTable: true,
          isInvisible :false,
          multiple: true,
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
          isInvisible :true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "الديانة",
          value: "Injured.Religion",
          searchValue: "Religion",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          isInvisible: true,
          inTable: false,
          inModel: true,
          readOnly: true,
          sort: 6
        },
        {
          text: "رقم التليفون",
          value: "Injured.PhoneNumber",
          searchValue: "PhoneNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          isInvisible :true,
          inTable: false,
          inModel: true,
          sort: 6
        },
        {
          text: "التفاصيل الداخلية",
          value: "ProfileDetails",
          searchValue: "",
          sortable: true,
          inSearch: false,
          isInvisible :false,
          inModel: false,
          inTable: true,
          sort: 5
        }
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
          { text: "يعول", value: true },
          { text: "لا يعول", value: false }
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
      MedicalCouncilOrder: {
        text: "text",
        value: "text",
        data: [
          {
            text: "لائق"
          },
          {
            text: "لائق مستوى أدنى"
          },
          {
            text: "غير لائق"
          }
        ]
      },
      LastRecoveryOrder: {
        text: "text",
        value: "text",
        data: [
          {
            text: "شفي بعاهه"
          },
          {
            text: "شفي بدون عاهه"
          },
          {
            text: "لم يتم صدور قرار الشفاء"
          }
        ]
      },
      PatientCondition: {
        text: "text",
        value: "text",
        data: [
          {
            text: "على قيد الحياة"
          },
          {
            text: "متوفي"
          }
        ]
      },
      InjuryCategory: {
        text: "text",
        value: "text",
        data: [
          {
            text: "احداث جارية"
          },
          {
            text: "اعمال تهريب وتسلل"
          }
        ]
      },
      isFollowed: {
        data: [
          {
            text: "متابع",
            value: true
          },
          {
            text: "غير متابع",
            value: false
          },
          {
            text: "الكل",
            value: null
          }
        ]
      },
      ReasonOrder: {
        table: "ReasonsDecisions",
        value: "Reason",
        text: "Reason"
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
          Kind: "مصاب",
          receivedTakreem: "",
          receivedJob: "",
          receivedHajj: "",
          receivedAnnouncment: "",
          UnitID: "",
          Religion: "",
          Level: "",
          KnowledgeLevel: "",
          MartialStatus: "",
          Name: ""
        },
        likes = ["ID", "Name"],
        // ignore=["receivedAnnouncment","receivedHajj","receivedJob","receivedTakreem"],
        multi = ["Type"],
        date = ["DateOfIncident"];

      where = this.mapToQuery(where, likes, multi, date);
      let data = await this.api("global/get_all", {
        table: "MartyrsAndInjuredAndDeath",
        where,
        include: [
          {
            model: "Wars"
          }
        ]
      });

      let items = [];
      for (const ele of data.data) {
        var injured = await this.fetchDataBaseOnType(
          ele.ID,
          ele.Type == "مجند"
            ? "Soldier"
            : ele.Type == "ضابط"
            ? "Officer"
            : "Rateb",
          "Injured"
        );
        items.push({
          ...ele,
          ...injured
        });
      }
      if (filters.WeaponID != null && filters.WeaponID.length > 0) {
        items = items.filter(ele =>
          filters.WeaponID.includes(ele.Injured.WeaponID)
        );
      }
      if (filters.Name && filters.Name != "") {
        items = items.filter(ele => ele.Injured.Name.includes(filters.Name));
      } else {
        let injuredKeys = Object.keys(items[0].Injured);
        let filterKeys = Object.keys(filters);
        let filteredArray = filterKeys?.filter(ele =>
          injuredKeys?.includes(ele)
        );

        for (let i = 0; i < filteredArray.length; i++) {
          console.log("keys", filteredArray[i]);
          items = items?.filter(ele =>
            filters?.[`${filteredArray[i]}`]?.includes(
              ele?.Injured?.[`${filteredArray[i]}`]
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
      console.log("injured", this.injured);

      try {
        saveItem = await this.api(
          `global/${this.injured.isEdit ? "update_one" : "create_one"}`,
          {
            table: "MartyrsAndInjuredAndDeath",
            where: !this.injured.isEdit
              ? {
                  ...this.injured,
                  Kind: "مصاب"
                }
              : {
                  ID_KEY: this.injured.ID_KEY
                },
            update: {
              ...this.injured
            }
          }
        );

        if (this.injured.Type.includes("راتب عالي")) {
          console.log("THis rateb is " , this.injured);
          await this.api(`global/update_one`, {
            table: "Rateb",
            where: {
              ID: this.injured.ID
            },
            update: {
              MartialStatus: this.injured.MartialStatus,
              Address: this.injured.Address,
              IdentityNo: this.injured.IdentityNo,
              SoldierTELE: this.injured.PhoneNumber
            }
          });
        }
        if (this.injured.Type.includes("ضابط")) {
          console.log("THis officer is " , this.injured);
          await this.api(`global/update_one`, {
            table: "Officers",
            where: {
              ID: this.injured.ID
            },
            update: {
              MartialStatus: this.injured.MartialStatus,
              Address: this.injured.Address,
              IdentityNo: this.injured.IdentityNo,
              PhoneNumber: this.injured.PhoneNumber
            }
          });
        }
        if (this.injured.Type.includes("مجند")) {
          console.log("THis soldier is " , this.injured);

          await this.api(`global/update_one`, {
            table: "Soldier",
            where: {
              ID: this.injured.ID
            },
            update: {
              MartialStatus: this.injured.MartialStatus,
              Address: this.injured.Address,
              IdentityNo: this.injured.IdentityNo,
              SoldierTELE: this.injured.PhoneNumber
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
      this.$set(this, "injured", {});
      this.$set(this, "preEditor", {});

      this.$set(this, "injured", { isEdit: false });

      this.$set(this.TypeObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this, "injured", {});
      this.$set(this, "injured", {
        ...item,
        ...item.Injured,
        isEdit: true
      });

      this.$set(this.createdObject, "model", true);
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
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
      this.$set(this.injured, "ID", this.preEditor.ID);
      this.$set(this.injured, "Type", this.preEditor.Type);
    },

    async findIDData(ID, type) {
      this.$set(this.createdObject, "loading", true);

      let data = await this.fetchDataBaseOnType(ID, type, "Injured");
      this.$set(this.injured, "Name", data.Injured.Name);
      this.$set(this.injured, "UnitID", data.Injured.UnitID);
      this.$set(this.injured, "KnowledgeLevel", data.Injured.KnowledgeLevel);
      this.$set(this.injured, "Level", data.Injured.Level);
      this.$set(this.injured, "Address", data.Injured.Address);
      this.$set(this.injured, "Religion", data.Injured.Religion);
      this.$set(this.injured, "MartialStatus", data.Injured.MartialStatus);
      this.$set(this.injured, "PhoneNumber", data.Injured.PhoneNumber);
      this.$set(this.injured, "IdentityNo", data.Injured.IdentityNo);
      console.log("ReturnedObject Is", data);
      this.$set(this.createdObject, "model", true);
      this.$set(this.createdObject, "loading", false);

      return data;
    }
  }
};
</script>
