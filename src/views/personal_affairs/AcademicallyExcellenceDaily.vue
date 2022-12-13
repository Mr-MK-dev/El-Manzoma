<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في اليومية"
      :addButton="false"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية عددية بالمتفوقين دراسيا'"
      :isExcel="true"
    >
      <template v-slot:header="{ props }">
        <thead class="v-data-table-header">
          <tr>
            <th
              v-for="item in mainTable.headers.filter(ele => ele.inTable)"
              :key="item.parent + item.text.length"
              colspan="1"
              class="text-center parent-header"
            >
              {{ item.parent }}
            </th>
          </tr>
          <tr>
            <th
              v-for="item in mainTable.headers.filter(ele => ele.inTable)"
              :key="item.text + item.text.length * 3"
              colspan="1"
              class="text-center parent-header"
            >
              {{ item.text }}
            </th>
          </tr>
        </thead>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "AcademicallyExcellenceDaily",

  components: {},

  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },

  mounted() {
    this.init();
    this.selects.HonorYear.data = _.range(2010, 3000, 1);
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

    listType: "all",
    searchLoading: false,
    selects: {
      HonorYear: {
        text: "text",
        value: "text",
        data: []
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
      }
    },
    mainTable: {
      headers: [
        {
          text: "عام التكريم",
          value: "HonorYear",
          searchValue: "HonorYear",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          readonly: true,
          multiple: true,
          sort: 1
        },
        {
          text: "حالة التكريم",
          value: "isHonor",
          searchValue: "isHonor",
          sortable: true,
          type: "select",
          inTable: false,
          inSearch: true,
          inModel: false,
          sort: 1
        },
        {
          text: "البيان",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "ضابط",
          value: "MiddleOfficer",
          searchValue: "MiddleOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "اعدادية",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "MiddleRateb",
          searchValue: "MiddleRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "اعدادية",
          sort: 1
        },
        {
          text: "ضابط",
          value: "HighSchoolOfficer",
          searchValue: "HighSchoolOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "ثانوية",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "HighSchoolRateb",
          searchValue: "HighSchoolRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "ثانوية",
          sort: 1
        },
        {
          text: "ضابط",
          value: "CollegeOfficer",
          searchValue: "CollegeOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "جامعية",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "CollegeRateb",
          searchValue: "CollegeRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "جامعية",
          sort: 1
        },
        {
          text: "ضابط",
          value: "PostGraduateOfficer",
          searchValue: "PostGraduateOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "دراسات عليا",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "PostGraduateRateb",
          searchValue: "PostGraduateRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "دراسات عليا",
          sort: 1
        },
        {
          text: "الإجمالي العام",
          value: "Total",
          searchValue: "Total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = ["HonorYear"];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "AcademicallyExcellence",
        where: this.cleanObject({
          HonorYear: where.HonorYear,
          isHonor: where.isHonor
        })
      })
        .then(x => {
          let data = x.data;

          data = [
            {
              Type: "الأجمالي",
              MiddleOfficer: data.filter(
                ele =>
                  ele.DegreeType?.includes("اعدادية") &&
                  ele.Type?.includes("ضابط")
              ).length,
              MiddleRateb: data.filter(
                ele =>
                  ele.DegreeType?.includes("اعدادية") &&
                  ele.Type?.includes("راتب عالي")
              ).length,
              HighSchoolOfficer: data.filter(
                ele =>
                  ele.DegreeType?.includes("ثانوية") &&
                  ele.Type?.includes("ضابط")
              ).length,
              HighSchoolRateb: data.filter(
                ele =>
                  ele.DegreeType?.includes("ثانوية") &&
                  ele.Type?.includes("راتب عالي")
              ).length,
              CollegeOfficer: data.filter(
                ele =>
                  ele.DegreeType?.includes("جامعية") &&
                  ele.Type?.includes("ضابط")
              ).length,
              CollegeRateb: data.filter(
                ele =>
                  ele.DegreeType?.includes("جامعية") &&
                  ele.Type?.includes("راتب عالي")
              ).length,
              PostGraduateOfficer: data.filter(
                ele =>
                  ele.DegreeType?.includes("دراسات عليا") &&
                  ele.Type?.includes("ضابط")
              ).length,
              PostGraduateRateb: data.filter(
                ele =>
                  ele.DegreeType?.includes("دراسات عليا") &&
                  ele.Type?.includes("راتب عالي")
              ).length,
              Total: data.length
            }
          ];

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable),
            hasParent: true
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
