<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      :addButton="false"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في تشابه الأسماء"
      addBtnTitle="إضافة شقيق"
    />
    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="'تشابه الأسماء'"
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
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="headers"
      :selects="selects"
      :data="names"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "SoldiersBrotherSearch.vue",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    // this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  watch: {
    "brother.ID"(v) {
      this.findSolider();
    }
  },
  data: () => ({
    groupedValue: [],
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {
      WeaponID: types.harsHododId
    },
    searchLoading: false,
    headers: [
      {
        text: "",
        value: "actionsStart",
        searchValue: "",
        sortable: true,
        inSearch: false,
        inModel: false,
        inTable: true,
        sort: 5
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
        sort: 1
      },
      {
        text: "الاسم",
        value: "Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: true,
        inTable: true,
        inModel: false,
        readonly: true,
        sort: 1
      },
      {
        text: "الوحدة",
        value: "Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      }
    ],
    names: {},
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {},
    printer: {}
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log("filters", filters);
      let name = this.fixName(filters.Name).split(" ");
      name.splice(0, 1);
      (name = name.join("%")), console.log("where", name);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          include: [{ model: "Unit" }],

          where: {
            Name: {
              $like: `%${name}%`
            }
          }
        });
        let data = x.data;

        this.$set(this, "items", data);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async findSolider() {
      console.log("xx");
      let search = this.search;
      let x;
      try {
        x = await this.api("global/get_one", {
          table: "Soldier",
          search: { ID: this.brother.ID }
        });
        this.$set(this.brother, "Name", x.data.Name);
      } catch (error) {
        this.handleError(error);
      }
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          // obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    },
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    }
  }
};
</script>
