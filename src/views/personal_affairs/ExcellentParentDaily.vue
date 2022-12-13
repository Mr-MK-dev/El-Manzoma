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
      :title="'يومية عددية بالأم والأب المثاليين'"
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
  name: "ExcellentParentDaily",

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
      },
      isReject: {
        text: "text",
        value: "value",
        data: [
          {
            text: "تم الإستبعاد",
            value: true
          },
          {
            text: "لم يتم الإستبعاد",
            value: false
          }
        ]
      },
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
          text: "حالة الإستبعاد",
          value: "isReject",
          searchValue: "isReject",
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
          value: "FirstOfficer",
          searchValue: "FirstOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز أول / قوات ح ح",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "FirstRateb",
          searchValue: "FirstRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز أول / قوات ح ح",
          sort: 1
        },
        {
          text: "ضابط",
          value: "SecondOfficer",
          searchValue: "SecondOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثاني / قوات ح ح",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "SecondRateb",
          searchValue: "SecondRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثاني / قوات ح ح",
          sort: 1
        },
        {
          text: "ضابط",
          value: "ThirdOfficer",
          searchValue: "ThirdOfficer",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثالث / قوات ح ح",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "ThirdRateb",
          searchValue: "ThirdRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثالث / قوات ح ح",
          sort: 1
        },
        {
          text: "ضابط",
          value: "FirstOfficerGlobal",
          searchValue: "FirstOfficerGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز أول / قوات مسلحة",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "FirstRatebGlobal",
          searchValue: "FirstRatebGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز أول / قوات مسلحة",
          sort: 1
        },
        {
          text: "ضابط",
          value: "SecondOfficerGlobal",
          searchValue: "SecondOfficerGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثاني / قوات مسلحة",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "SecondRatebGlobal",
          searchValue: "SecondRatebGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثاني / قوات مسلحة",
          sort: 1
        },
        {
          text: "ضابط",
          value: "ThirdOfficerGlobal",
          searchValue: "ThirdOfficerGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثالث / قوات مسلحة",
          sort: 1
        },
        {
          text: "راتب عالي",
          value: "ThirdRatebGlobal",
          searchValue: "ThirdRatebGlobal",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          parent: "مركز ثالث / قوات مسلحة",
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
        table: "ExcellentParent",
        where: this.cleanObject({
          HonorYear: where.HonorYear,
          isHonor: where.isHonor
        })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let Grouped = lodash.groupBy(data, ele => ele.ParentType);
          let d = Object.keys(Grouped).map(key => ({
            Type: key + " " + "مثالي",
            // PackagedUnitName: Grouped[key][0].Unit.Unit,
            FirstOfficer: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الأول / قوات ح ح")
            ).length,
            FirstRateb: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الأول / قوات ح ح")
            ).length,
            SecondOfficer: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الثاني / قوات ح ح")
            ).length,
            SecondRateb: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الثاني / قوات ح ح")
            ).length,
            ThirdOfficer: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الثالث / قوات ح ح")
            ).length,
            ThirdRateb: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الثالث / قوات ح ح")
            ).length,
            FirstOfficerGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الأول / قوات مسلحة")
            ).length,
            FirstRatebGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الأول / قوات مسلحة")
            ).length,
            SecondOfficerGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الثاني / قوات مسلحة")
            ).length,
            SecondRatebGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الثاني / قوات مسلحة")
            ).length,
            ThirdOfficerGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("ضابط") &&
                ele.Place?.includes("الثالث / قوات مسلحة")
            ).length,
            ThirdRatebGlobal: Grouped[key].filter(
              ele =>
                ele.Type?.includes("راتب عالي") &&
                ele.Place?.includes("الثالث / قوات مسلحة")
            ).length,
            Total: Grouped[key].length
          }));

          d.push({
            Type: "الأجمالي",
            FirstOfficer: lodash.sumBy(d, ele => ele.FirstOfficer),
            FirstRateb: lodash.sumBy(d, ele => ele.FirstRateb),
            SecondOfficer: lodash.sumBy(d, ele => ele.SecondOfficer),
            SecondRateb: lodash.sumBy(d, ele => ele.SecondRateb),
            ThirdOfficer: lodash.sumBy(d, ele => ele.ThirdOfficer),
            ThirdRateb: lodash.sumBy(d, ele => ele.ThirdRateb),
            FirstOfficerGlobal: lodash.sumBy(d, ele => ele.FirstOfficerGlobal),
            FirstRatebGlobal: lodash.sumBy(d, ele => ele.FirstRatebGlobal),
            SecondOfficerGlobal: lodash.sumBy(
              d,
              ele => ele.SecondOfficerGlobal
            ),
            SecondRatebGlobal: lodash.sumBy(d, ele => ele.SecondRatebGlobal),
            ThirdOfficerGlobal: lodash.sumBy(d, ele => ele.ThirdOfficerGlobal),
            ThirdRatebGlobal: lodash.sumBy(d, ele => ele.ThirdRatebGlobal),
            Total: lodash.sumBy(d, ele => ele.Total)
          });

          this.$set(this.mainTable, "items", d);
          this.$set(this.mainTable, "printer", {
            cons: [...d],
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
