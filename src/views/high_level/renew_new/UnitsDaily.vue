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
      <template v-slot:item.RatebID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RatebID}`"
          @click.right="copyText(item.RatebID)"
        >
          {{ item.RatebID }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "UnitsDaily",
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
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
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
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };

      this.api("global/get_all", {
        table: "RenewCandidates",
        include: [{ model: "Rateb", include: [{ model: "Unit" }] }],
        where: this.mapToQuery(where, [], [], [])
      })
        .then(async x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          let group = await lodash.groupBy(data, ele => ele.Rateb.Unit.Unit);
          let items = Object.values(group).map(ele => ({
            ...ele,
            Unit: ele[0].Rateb.Unit.Unit,
            FirstRenew: ele.filter(e => e.RenewType.includes("التجديد الأول"))
              .length,
            SecondRenew: ele.filter(e => e.RenewType.includes("التجديد الثاني"))
              .length,
            Total: ele.length
          }));
          items.push({
            Unit: "الإجمالي",
            FirstRenew: lodash.sumBy(items, ele => ele.FirstRenew),
            SecondRenew: lodash.sumBy(items, ele => ele.SecondRenew),
            Total: lodash.sumBy(items, ele => ele.Total)
          });
          console.log(items);
          this.$set(this.mainTable, "items", items);

          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
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
