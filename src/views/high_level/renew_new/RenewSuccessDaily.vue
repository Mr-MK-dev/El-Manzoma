<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="false"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في اليومية العددية"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'اليومية العددية'"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "RenewSuccessDaily",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    OutOfRenew: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "البيان",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التجديد الأول",
          value: "FirstRenew",
          searchValue: "FirstRenew",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "التجديد الثاني",
          value: "SecondRenew",
          searchValue: "SecondRenew",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الإجمالي",
          value: "Total",
          searchValue: "Total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "نشرة التجديد",
          value: "RenewList.Name",
          searchValue: "RenewListID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      RenewListID: {
        table: "RenewList",
        text: "Name",
        value: "ID_KEY"
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };
      let outOfRenew = [];
      let candidates = [];
      let items = [];
      try {
        outOfRenew = await this.api("global/get_all", {
          table: "OutOfRenew",
          include: [{ model: "Rateb", include: [{ model: "Unit" }] }],
          where: this.mapToQuery(where, [], [], [])
        });
        candidates = await this.api("global/get_all", {
          table: "RenewCandidates",
          include: [{ model: "Rateb", include: [{ model: "Unit" }] }],
          where: this.mapToQuery(where, [], [], [])
        });

        candidates = candidates.data;
        outOfRenew = outOfRenew.data.map(ele => ({
          ...ele,
          Reasons: Object.values(
            lodash.groupBy(ele.Reasons?.split(" - "), ele => ele)
          )
        }));
        items.push({
          Type: "إجمالي النشرة",
          FirstRenew:
            candidates.filter(ele => ele.RenewType?.includes("التجديد الأول"))
              .length +
            outOfRenew.filter(ele => ele.RenewType?.includes("التجديد الأول"))
              .length,
          SecondRenew:
            candidates.filter(ele => ele.RenewType?.includes("التجديد الثاني"))
              .length +
            outOfRenew.filter(ele => ele.RenewType?.includes("التجديد الثاني"))
              .length,
          Total: candidates.length + outOfRenew.length
        });
        let reasons = outOfRenew.map(pen =>
          pen.Reasons.map(ele => ({
            Type: ele[0],
            FirstRenew: outOfRenew.filter(
              e =>
                e.RenewType?.includes("التجديد الأول") &&
                e.Reasons.includes(ele)
            ).length,
            SecondRenew: outOfRenew.filter(
              e =>
                e.RenewType?.includes("التجديد الثاني") &&
                e.Reasons.includes(ele)
            ).length,
            Total: outOfRenew.filter(e => e.Reasons.includes(ele)).length
          }))
        );
        let groupedReasons = lodash.groupBy(
          lodash.flatten(reasons),
          ele => ele.Type
        );

        items = [
          ...items,
          ...Object.keys(groupedReasons).map(key => ({
            Type: key,
            FirstRenew: lodash.sumBy(groupedReasons[key], e => e.FirstRenew),
            SecondRenew: lodash.sumBy(groupedReasons[key], e => e.SecondRenew),
            Total: lodash.sumBy(groupedReasons[key], e => e.Total)
          }))
        ];
        items.push({
          Type: "عدم الرغبة في التجديد",
          FirstRenew: candidates.filter(
            ele => ele.RenewType?.includes("التجديد الأول") && !ele.isAgree
          ).length,
          SecondRenew: candidates.filter(
            ele => ele.RenewType?.includes("التجديد الثاني") && !ele.isAgree
          ).length,
          Total: candidates.filter(ele => !ele.isAgree).length
        });
        items.push({
          Type: "المدرج بالنشرة",
          FirstRenew: candidates.filter(
            ele => ele.RenewType?.includes("التجديد الأول") && ele.isAgree
          ).length,
          SecondRenew: candidates.filter(
            ele => ele.RenewType?.includes("التجديد الثاني") && ele.isAgree
          ).length,
          Total: candidates.filter(ele => ele.isAgree).length
        });
        this.$set(this.mainTable, "items", items);

        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (error) {
        console.log(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    }
  }
};
</script>
