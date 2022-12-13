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
    <table-bulider
      :wordFile="'/officers_management/unit_officers_report'"
      :isExcel="true"
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
  name: "UnitsOfficers",
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
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
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
          value: "Commitment",
          searchValue: "Commitment",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "المدة من",
          value: "DateFrom",
          searchValue: "DateFrom",
          type: "date",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "المدة إلى",
          value: "DateTo",
          searchValue: "DateTo",
          type: "date",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "ملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
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
      UnitID: {
        table: "Unit",
        text: "Unit",
        value: "UnitID"
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
      Commitment: {
        text: "text",
        value: "text",
        data: [{ text: "موجود" }, { text: "غير موجود" }]
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
          ...filters
        },
        likes = ["ID", "Name"],
        multi = [];

      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(where, likes, multi),

          table: "UnitsOfficers",
          include: [
            {
              model: "Unit"
            }
          ]
        });
        const data = result.data.map(ele => ({
          ...ele,
          CurrentDate: this.formatDate(new Date())
        }));
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", {
          data: data,
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
            table: "UnitsOfficers",
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
          await this.findAllOfficers({});
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
          table: "UnitsOfficers",
          where: {
            ID: item.ID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findAllOfficers({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
