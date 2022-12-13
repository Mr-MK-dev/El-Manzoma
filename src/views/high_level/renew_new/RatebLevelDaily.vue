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
  name: "RatebLevelDaily",
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
          parent: " ",
          sort: 1
        },
        {
          text: "عريف",
          value: "firstaref",
          searchValue: "firstaref",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الأول",
          sort: 1
        },
        {
          text: "رقيب",
          value: "firstraqeb",
          searchValue: "firstraqeb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الأول",
          sort: 1
        },
        {
          text: "رقيب اول",
          value: "firstraqebA",
          searchValue: "firstraqebA",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الأول",
          sort: 1
        },
        // {
        //   text: "مساعد",
        //   value: "firstmosaed",
        //   searchValue: "firstmosaed",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   readonly: true,
        //   parent: "التجديد الأول",
        //   sort: 1
        // },
        // {
        //   text: "مساعد أول",
        //   value: "firstmosaedA",
        //   searchValue: "firstmosaedA",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   readonly: true,
        //   parent: "التجديد الأول",
        //   sort: 1
        // },
        {
          text: "عريف",
          value: "secondaref",
          searchValue: "secondaref",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الثاني",
          sort: 1
        },
        {
          text: "رقيب",
          value: "secondraqeb",
          searchValue: "secondraqeb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الثاني",
          sort: 1
        },
        {
          text: "رقيب اول",
          value: "secondraqebA",
          searchValue: "secondraqebA",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: "التجديد الثاني",
          sort: 1
        },
        // {
        //   text: "مساعد",
        //   value: "secondmosaed",
        //   searchValue: "secondmosaed",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   readonly: true,
        //   parent: "التجديد الثاني",
        //   sort: 1
        // },
        // {
        //   text: "مساعد أول",
        //   value: "secondmosaedA",
        //   searchValue: "secondmosaedA",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   readonly: true,
        //   parent: "التجديد الثاني",
        //   sort: 1
        // },
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
          parent: " ",
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
          parent: " ",
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
            firstaref: ele.filter(
              e =>
                e.RenewType.includes("التجديد الأول") &&
                e.Rateb.RatebLevel.includes("عريف")
            ).length,
            firstraqeb: ele.filter(
              e =>
                e.RenewType.includes("التجديد الأول") &&
                e.Rateb.RatebLevel.includes("رقيب")
            ).length,
            firstraqebA: ele.filter(
              e =>
                e.RenewType.includes("التجديد الأول") &&
                e.Rateb.RatebLevel.includes("رقيب اول")
            ).length,
            firstmosaed: ele.filter(
              e =>
                e.RenewType.includes("التجديد الأول") &&
                e.Rateb.RatebLevel.includes("مساعد")
            ).length,
            firstmosaedA: ele.filter(
              e =>
                e.RenewType.includes("التجديد الأول") &&
                e.Rateb.RatebLevel.includes("مساعد اول")
            ).length,
            secondaref: ele.filter(
              e =>
                e.RenewType.includes("التجديد الثاني") &&
                e.Rateb.RatebLevel.includes("عريف")
            ).length,
            secondraqeb: ele.filter(
              e =>
                e.RenewType.includes("التجديد الثاني") &&
                e.Rateb.RatebLevel.includes("رقيب")
            ).length,
            secondraqebA: ele.filter(
              e =>
                e.RenewType.includes("التجديد الثاني") &&
                e.Rateb.RatebLevel.includes("رقيب اول")
            ).length,
            secondmosaed: ele.filter(
              e =>
                e.RenewType.includes("التجديد الثاني") &&
                e.Rateb.RatebLevel.includes("مساعد")
            ).length,
            secondmosaedA: ele.filter(
              e =>
                e.RenewType.includes("التجديد الثاني") &&
                e.Rateb.RatebLevel.includes("مساعد اول")
            ).length,
            Total: ele.length
          }));
          items.push({
            Unit: "الإجمالي",
            firstaref: lodash.sumBy(items, ele => ele.firstaref),
            firstraqeb: lodash.sumBy(items, ele => ele.firstraqeb),
            firstraqebA: lodash.sumBy(items, ele => ele.firstraqebA),
            firstmosaed: lodash.sumBy(items, ele => ele.firstmosaed),
            firstmosaedA: lodash.sumBy(items, ele => ele.firstmosaedA),
            secondaref: lodash.sumBy(items, ele => ele.secondaref),
            secondraqeb: lodash.sumBy(items, ele => ele.secondraqeb),
            secondraqebA: lodash.sumBy(items, ele => ele.secondraqebA),
            secondmosaed: lodash.sumBy(items, ele => ele.secondmosaed),
            secondmosaedA: lodash.sumBy(items, ele => ele.secondmosaedA),
            Total: lodash.sumBy(items, ele => ele.Total)
          });
          console.log(items);
          this.$set(this.mainTable, "items", items);

          this.$set(this.mainTable, "printer", {
            data: this.mainTable.items,
            excelKey: "data",
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
