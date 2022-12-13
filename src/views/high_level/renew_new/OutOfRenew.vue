<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="false"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في من لديهم موانع لدخول نشرة التجديدات"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'من لديهم موانع لدخول نشرة التجديدات'"
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
  name: "OutOfRenew",
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
          text: "نشرة التجديدات",
          value: "Name",
          searchValue: "RenewListID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "RatebID",
          searchValue: "RatebID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Rateb.RatebCategory",
          searchValue: "RatebCategory",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الأسباب",
          value: "Reasons",
          searchValue: "Reasons",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نشرة التجديد",
          value: "RenewList.Name",
          searchValue: "RenewListID",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
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
    findOne(id) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { id }
      })
        .then(x => {
          this.$set(this.grade, "Name", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };

      this.api("global/get_all", {
        table: "OutOfRenew",
        include: [
          { model: "Rateb", include: [{ model: "Unit" }] },
          { model: "RenewList" }
        ],
        where: this.mapToQuery(where, [], [], [])
      })
        .then(async x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          let group = await lodash.groupBy(data, ele => ele.RatebID);
          console.log(group);
          this.$set(
            this.mainTable,
            "items",
            Object.values(group).map(ele => ele[0])
          );

          this.$set(this.mainTable, "printer", printer);
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
