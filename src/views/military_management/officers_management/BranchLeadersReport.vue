<template>
  <div>
    <table-bulider
      :wordFile="'/officers_management/branch_leaders_report'"
      :isExcel="true"
      :headers="mainTable.headers"
      :items="mainTable.items"
      :title="'تمام رؤساء ونواب الشعب والافرع بقيادة قوات حرس الحدود'"
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
    officer: {},
    searchLoading: false,

    mainTable: {
      headers: [
        {
          text: "الشعبة/الفرع",
          value: "Branch.Name",
          searchValue: "BranchID",
          type: "select",
          inTable: true,
          required: true,
          inModel: true,
          inSearch: false
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
          text: "التمام",
          value: "Status",
          searchValue: "Status",
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
          text: "المده من",
          value: "DateFrom",
          searchValue: "DateFrom",
          multiple: false,
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "المده إلى",
          value: "DateTo",
          searchValue: "DateTo",
          multiple: false,
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: true
        }
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
        data: [{ text: "بالخدمة" }, { text: "منتهى خدمته" }]
      },
      VacationType: {
        text: "text",
        value: "text",
        data: [{ text: "مبيت" }, { text: "راحات أسبوعية" }, { text: "ميدانية" }]
      },
      Yearly: {
        text: "text",
        value: "text",
        data: [{ text: 10 }, { text: 11 }, { text: 15 }]
      },
      Occasional: {
        text: "text",
        value: "text",
        data: [{ text: "0" }, { text: 4 }, { text: 7 }]
      },
      Job: {
        text: "text",
        value: "text",
        data: [
          { text: "رئيس" },
          { text: "نائب" },
          { text: "قائد" },
          { text: "قائد 2" }
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
          ...filters,
          Job: ["رئيس", "نائب", "قائد", "قائد 2"]
        },
        likes = ["ID", "Name"],
        multi = ["Job"];

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
        const VacationsResult = await this.api("global/get_all", {
          table: "OfficerVacations",
          include: [
            {
              model: "Vacations"
            }
          ]
        });
        const MissionsResult = await this.api("global/get_all", {
          table: "OfficerMissions",
          include: [
            {
              model: "Missions"
            }
          ]
        });
        console.log("MR", MissionsResult);
        console.log("VR", VacationsResult);

        const returnedItems = result.data
          .map(ele => ({
            ...ele,
            Status:
              MissionsResult.data.find(m => m.ID == ele.ID)?.Mission?.Name ||
              VacationsResult.data.find(m => m.ID == ele.ID)?.Vacation?.Name ||
              "موجود",
            DateFrom:
              MissionsResult.data.find(m => m.ID == ele.ID)?.DateFrom ||
              VacationsResult.data.find(m => m.ID == ele.ID)?.DateFrom,
            DateTo:
              MissionsResult.data.find(m => m.ID == ele.ID)?.DateTo ||
              VacationsResult.data.find(m => m.ID == ele.ID)?.DateTo,
            Notes:
              MissionsResult.data.find(m => m.ID == ele.ID)?.Notes ||
              VacationsResult.data.find(m => m.ID == ele.ID)?.Notes,
            CurrentDate: this.formatDate(new Date())
          }))
          .filter(
            e =>
              (new Date(e.DateFrom) <= new Date(e.CurrentDate) &&
                new Date(e.DateTo) >= new Date(e.CurrentDate)) ||
              e.Status == "موجود"
          );
        console.log("ri", returnedItems);

        this.$set(this.mainTable, "items", returnedItems);
        this.$set(this.mainTable, "printer", {
          data: returnedItems,
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
      this.$set(this, "officer", { isEdit: false });
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
      let { id, type } = this.del,
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
    }
  }
};
</script>
