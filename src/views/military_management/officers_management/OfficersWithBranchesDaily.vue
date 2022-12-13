 <template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'قوة الشعب'"
      :isExcel="true"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "OfficersWithBranchesDaily",

  components: {},

  mounted() {
    this.init();
    this.findItems({});
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
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    mainTable: {
      headers: [
        {
          text: "الشعبة",
          value: "Branch",
          searchValue: "Branch",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "عامل",
          value: "Workers",
          searchValue: "Workers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إحتياط",
          value: "Spare",
          searchValue: "Spare",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "شرفي",
          value: "Honor",
          searchValue: "Honor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تعاقد ش.ض",
          value: "Contract",
          searchValue: "Contract",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إجمالي",
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
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "MilitaryManagementOfficers",
        include: [
          {
            model: "Branches"
          }
        ]
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let GroupedOfficers = lodash.groupBy(data, ele => ele.BranchID);
          let d = Object.keys(GroupedOfficers).map(key => ({
            Branch: GroupedOfficers[key][0].Branch.Name,
            Workers: GroupedOfficers[key].filter(ele =>
              ele.OfficerCategory.includes("عامل")
            ).length,
            Spare: GroupedOfficers[key].filter(ele =>
              ele.OfficerCategory.includes("إحتياط")
            ).length,
            Honor: GroupedOfficers[key].filter(ele =>
              ele.OfficerCategory.includes("شرف")
            ).length,
            Contract: GroupedOfficers[key].filter(ele =>
              ele.OfficerCategory.includes("تعاقد ش.ض")
            ).length,
            Total: GroupedOfficers[key].length
          }));

          d.push({
            Branch: "الأجمالي",
            Workers: lodash.sumBy(d, ele => ele.Workers),
            Spare: lodash.sumBy(d, ele => ele.Spare),
            Honor: lodash.sumBy(d, ele => ele.Honor),
            Contract: lodash.sumBy(d, ele => ele.Contract),
            Total: lodash.sumBy(d, ele => ele.Total)
          });

          this.$set(this.mainTable, "items", d);
          this.$set(this.mainTable, "printer", {
            cons: [...d],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
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
