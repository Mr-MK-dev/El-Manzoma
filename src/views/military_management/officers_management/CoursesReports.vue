<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findAllVacations"
      :search="search"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="false"
      addBtnTitle="إضافة أجازة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :wordFile="'/officers_management/courses_report'"
      :isExcel="true"
      :title="'الدورات والفرق'"
      :printer="mainTable.printer"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
export default {
  name: "CoursesReports",
  async mounted() {
    await this.init();
    const weekInMls = 7 * 24 * 60 * 60 * 1000;

    this.search.Date = [
      this.formatDate(new Date())
      // this.formatDate(new Date())
    ];
    await this.findAllVacations(this.search);
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    vacation: {},
    searchLoading: false,

    mainTable: {
      headers: [
        {
          text: "الرتبة",
          value: "MilitaryManagementOfficer.OfficerLevel",
          searchValue: "OfficerLevel",
          type: "select",
          inTable: true,
          inModel: false,
          inSearch: false
        },
        {
          text: "الاسم",
          value: "MilitaryManagementOfficer.Name",
          searchValue: "OfficerName",
          type: "select",
          inTable: true,
          required: true,
          inModel: false,
          inSearch: false
        },
        {
          text: "الشعبة",
          value: "MilitaryManagementOfficer.Branch.Name",
          searchValue: "BranchID",
          type: "select",
          inTable: true,
          required: false,
          inModel: true,
          inSearch: false
        },
        {
          text: "نوع الدورة أو الفرقة",
          value: "Course.Name",
          searchValue: "CourseID",
          type: "select",
          inTable: true,
          inModel: true,
          required: true,
          inSearch: false
        },
        {
          text: "التاريخ من",
          value: "DateFrom",
          searchValue: "DateFrom",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "التاريخ الى",
          value: "DateTo",
          searchValue: "DateTo",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          parent: "",
          sort: 1
        },
        {
          text: "التاريخ ",
          value: "Date",
          searchValue: "Date",
          multiple: false,
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          inModel: false,
          parent: "",
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    search: {},
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
      OfficerName: {
        table: "Officers",
        text: "Name",
        value: "ID"
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
      VacationID: {
        table: "Vacations",
        text: "Name",
        value: "ID_KEY"
      },
      Status: {
        text: "text",
        value: "text",
        data: [{ text: "بالخدمة" }, { text: "منتهى خدمته" }]
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
    async findAllVacations(filters) {
      // this.search = [...filters];
      if (!filters.Date.length > 0) {
        return this.showError("يرجى إختيار تاريخ من إلى أولا");
      }
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [],
        dates = [];
      let id = 1;
      try {
        const result = await this.api("global/get_all", {
          where: this.mapToQuery(
            this.cleanObject({
              ...where,
              Date: null,
              DateFrom: null,
              DateTo: null
            }),
            likes,
            multi,
            dates
          ),

          table: "OfficerCourses",
          include: [
            {
              model: "MilitaryManagementOfficers",
              include: [{ model: "Branches" }]
            },
            {
              model: "Courses"
            }
          ]
        });
        let items = result.data;
        if (filters.Date.length > 0) {
          items = items.filter(ele => {
            let hasToAndFromDate =
              new Date(filters.Date[1]) <= new Date(ele.DateTo) &&
              new Date(ele.DateFrom) >= new Date(filters.Date[0]);
            let hasOnlyFromDate =
              new Date(ele.DateFrom) <= new Date(filters.Date[0]) &&
              new Date(filters.Date[0]) <= new Date(ele.DateTo);
            return !filters.Date[1] ? hasOnlyFromDate : hasToAndFromDate;
          });
        }
        items = items.map(ele => ({
          ...ele,
          id: id++,
          CurrentDate: filters.Date[0]
        }));
        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "searchLoading", false);
    }
  }
};
</script>
