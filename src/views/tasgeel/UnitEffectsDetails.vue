<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      @on-search="findItems"
      :clearOption="true"
      :search="search"
      title="بحث متقدم في مؤثرات الوحدة"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "UnitEffectsDetails",
  props: {},
  mounted() {
    this.findItems();
  },
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
  data: () => ({
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },
        {
          text: "النوع",
          value: "type",
          searchValue: "type",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },

        {
          text: "نوع المؤثر",
          value: "increment",
          searchValue: "increment",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },
        {
          text: "الملاحظات",
          value: "descrption",
          searchValue: "descrption",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: false
        },
        {
          text: "تاريخ المؤثر",
          value: "date",
          searchValue: "date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: false,
          multiple: false
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject"
  }),

  methods: {
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);

        let where = {
            ...filters,
            UnitID: this.$route.params.unitID
          },
          likes = [],
          multi = [],
          dates = ["date"];
        where = this.mapToQuery(where, likes, multi, dates);

        let effects = await this.api("global/get_all", {
          table: "UnitEffecs",
          include: [
            {
              model: "Unit"
            }
          ],
          where: where
        });

        let data = effects.data.map(ele => {
            return {
              ...ele,
              type: ele.type == "Soldier" ? "مجند" : "راتب عالي",
              increment: ele.increment ? "زيادة" : "نقصان"
            };
          }),
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
