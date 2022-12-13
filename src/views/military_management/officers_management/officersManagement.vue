<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        :loading="searchLoading"
        @on-search="findAllOfficers"
        @on-add="actionAdd()"
        :clearOption="true"
        title="بحث متقدم "
        :addButton="true"
        addBtnTitle="إضافة ضابط"
    />




    <v-card-title>
      <v-row>
        <v-btn
            class="mx-auto"
            @click="resetOccasional"
            large
            outlined
            color="primary"
        >
          إعادة رصيد العارضة للكل
        </v-btn>
        <v-btn
            class="mx-auto"
            @click="resetAnnual"
            large
            outlined
            color="primary"
        >
          إعادة رصيد السنوية للكل
        </v-btn>
      </v-row>

    </v-card-title>


    <table-bulider
        :headers="mainTable.headers"
        :items="mainTable.items"
        :title="'الضباط'"
        :printer="mainTable.printer"
    >
      <template v-slot:item.edit="{ item }">
        <v-chip color="transparent" @click="deleteOfficer(item)">
          <v-icon color="error">mdi-delete</v-icon>
        </v-chip>
        <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </table-bulider>

    <editor-dialog-bulider
        :title="''"
        :open="createdObject.model"
        :loading="createdObject.loading"
        :fields="mainTable.headers"
        :data="officer"
        :selects="selects"
        @on-submit="saveItem()"
        @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
export default {
  name: "officersManagement",
  mounted() {
    this.init();
    this.findAllOfficers({});
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    officer: {
      OccasionalDaysCount:7,
      AnnualDaysCount:15
    },
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
          text: "قوة الشعبة",
          value: "Branch.Name",
          searchValue: "BranchID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: false
        },
        {
          text: "الوظيفة",
          value: "Job",
          searchValue: "Job",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          type: "text",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: false
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
          text: "الفئة",
          value: "OfficerCategory",
          searchValue: "OfficerCategory",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الرتبة",
          value: "OfficerLevel",
          searchValue: "OfficerLevel",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: false,
          readOnly: false,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          multiple: false,
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "المحافظة",
          value: "City.City",
          searchValue: "CityID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        {
          text: "نوع الأجازة",
          value: "VacationType",
          searchValue: "VacationType",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: true
        },
        // {
        //   text: "عارضة",
        //   value: "Occasional",
        //   searchValue: "Occasional",
        //   type: "select",
        //   inTable: true,
        //   required: true,
        //   inModel: true,
        //   inSearch: true
        // },
        // {
        //   text: "سنوية",
        //   value: "Yearly",
        //   searchValue: "Yearly",
        //   type: "select",
        //   inTable: true,
        //   required: true,
        //   inModel: true,
        //   inSearch: true
        // },
        {
          text: "الديانة",
          value: "Religion",
          searchValue: "Religion",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "الحالة الإجتماعية",
          value: "MartialStatus",
          searchValue: "MartialStatus",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        },
        {
          text: "العنوان",
          value: "Address",
          searchValue: "Address",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "رصيد عارضة",
          value: "OccasionalDaysCount",
          searchValue: "OccasionalDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "رصيد سنوية",
          value: "AnnualDaysCount",
          searchValue: "AnnualDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "رصيد عارضة متبقي",
          value: "RemainingOccasionalDaysCount",
          searchValue: "RemainingOccasionalDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: false
        },
        {
          text: "رصيد سنوية  متبقي",
          value: "RemainingAnnualDaysCount",
          searchValue: "RemainingAnnualDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: false,
          inSearch: false
        }
        // {
        //   text: "الرقم القومي",
        //   value: "IdentityNo",
        //   searchValue: "IdentityNo",
        //   type: "text",
        //   inTable: true,
        //   required: false,
        //   inModel: true,
        //   inSearch: false
        // },
        // {
        //   text: "رقم التليفون",
        //   value: "PhoneNumber",
        //   searchValue: "PhoneNumber",
        //   type: "text",
        //   inTable: true,
        //   required: false,
        //   inModel: true,
        //   inSearch: false
        // }
      ],
      items: [],
      printer: []
    },
    selects: {
      OfficerCategory: {
        text: "text",
        value: "text",
        data: constants.OfficerCategory.data
      },
      OfficerLevel: {
        text: "text",
        value: "text",
        data: [
          "ملازم",
          "ملازم أ",
          "نقيب",
          "رائد",
          "رائد أ ح",
          "مقدم",
          "مقدم أ ح",
          "عقيد",
          "عقيد أ ح",
          "عميد",
          "عميد أ ح",
          "لواء",
          "لواء أ ح",
          "فريق",
          "فريق أ ح"
        ]
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      BranchID: {
        table: "Branches",
        text: "Name",
        value: "ID_KEY"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Status: {
        text: "text",
        value: "text",
        data: [{text: "بالخدمة"}, {text: "منتهى خدمته"}]
      },
      VacationType: {
        text: "text",
        value: "text",
        data: [{text: "مبيت"}, {text: "راحات أسبوعية"}, {text: "ميدانية"}]
      },
      Yearly: {
        text: "text",
        value: "text",
        data: [{text: 10}, {text: 11}, {text: 15}]
      },
      Occasional: {
        text: "text",
        value: "text",
        data: [{text: 0}, {text: 4}, {text: 7}]
      },
      Job: {
        text: "text",
        value: "text",
        data: [
          {text: "رئيس"},
          {text: "نائب"},
          {text: "قائد"},
          {text: "قائد 2"}
        ]
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      }
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
  methods: {
    async findAllOfficers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
            ...filters
          },
          likes = ["ID", "Name"],
          multi = [];

      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(where, likes, multi),

          table: "MilitaryManagementOfficers",
          include: [
            {
              model: "Unit"
            },
            {
              model: "Weapon"
            },
            {
              model: "Branches"
            },
            {
              model: "City"
            }
          ]
        });
        this.$set(this.mainTable, "items", result.data);
        this.$set(this.mainTable, "printer", {
          data: result.data,
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
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      this.$set(this, "officer", {
        ...this.officer,
        RemainingOccasionalDaysCount: this.officer.OccasionalDaysCount,
        RemainingAnnualDaysCount: this.officer.AnnualDaysCount
      })
      try {
        saveItem = await this.api(
            !this.officer.isEdit ? `global/create_one` : `global/update_one`,
            {
              table: "MilitaryManagementOfficers",
              where: !this.officer.isEdit
                  ? this.officer
                  : {
                    ID: this.officer.ID
                  },
              update: this.officer
            }
        );
        if (saveItem && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findAllOfficers({});
          this.createdObject, "model", false;
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

    actionAdd() {
      this.$set(this, "officer", {isEdit: false ,
        OccasionalDaysCount:7,
        AnnualDaysCount:15});
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "officer", {
        ...item,
        isEdit: true
      });
    },

    async deleteOfficer(item) {
      this.$set(this.del, "loading", true);

      // here will create all attached units with null
      let {id, type} = this.del,
          delItem = await this.api("global/delete_all", {
            table: "MilitaryManagementOfficers",
            where: {
              ID: item.ID
            }
          });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findAllOfficers({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    },
    async resetOccasional() {
      for (const ele of this.mainTable.items) {
        await this.api("global/update_one" , {
          table :"MilitaryManagementOfficers" ,
          where :{
            ID: ele.ID
          },
          update :{
            OccasionalDaysCount: 7,
            RemainingOccasionalDaysCount :7
          }
        })
      }
      this.findAllOfficers({});

    },
    async resetAnnual() {
      for (const ele of this.mainTable.items) {
        console.log("ELEmenT" , ele);
        await this.api("global/update_one" , {
          table :"MilitaryManagementOfficers" ,
          where :{
            ID : ele.ID
          },
          update :{
            AnnualDaysCount: 15,
            RemainingAnnualDaysCount :15
          }
        });
      }
      this.findAllOfficers({});

    },
  }
};
</script>
