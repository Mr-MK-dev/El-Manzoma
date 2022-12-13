<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        :loading="searchLoading"
        @on-search="findAllOfficers"
        :clearOption="true"
        title="بحث متقدم "
        :addButton="false"
    />




    <table-bulider
        :headers="mainTable.headers"
        :items="mainTable.items"
        :title="'تمام أجازات الضباط'"
        :printer="mainTable.printer"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../../Constant").default;
export default {
  name: "officerVacationBalanceReport",
  mounted() {
    this.findAllOfficers({});
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
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
          text: "المستحق (عارضة)",
          value: "OccasionalDaysCount",
          searchValue: "OccasionalDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          parent :"العارضة" ,
          inSearch: false
        },
        {
          text: "المتبقي (عارضة)",
          value: "RemainingOccasionalDaysCount",
          searchValue: "RemainingOccasionalDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: false,
          parent :"العارضة" ,
          inSearch: false
        },
        {
          text: "المستحق (سنوية)",
          value: "AnnualDaysCount",
          searchValue: "AnnualDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: true,
          parent :"السنوية" ,
          inSearch: false
        },
        {
          text: "المتبقي (سنوية)",
          value: "RemainingAnnualDaysCount",
          searchValue: "RemainingAnnualDaysCount",
          type: "text",
          inTable: true,
          required: false,
          inModel: false,
          parent :"السنوية" ,
          inSearch: false

        }
      ],
      items: [],
      printer: []
    },
    selects: {
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
              model: "Branches"
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

  }
};
</script>
