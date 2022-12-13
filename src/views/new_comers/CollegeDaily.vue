<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :search="search"
      :searchLoading="searchLoading"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
      title="بحث متقدم في مرتبات الوظائف للوحدات"
    />
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عليا : {{ knowledgelevel.high }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            فوق متوسطة : {{ knowledgelevel.highmid }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            متوسطة : {{ knowledgelevel.mid }}
          </v-card> </v-col
        ><v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            عادة : {{ knowledgelevel.low }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-card>
      <v-progress-circular
        v-if="searchLoading"
        indeterminate
        color="success"
      ></v-progress-circular>
      <!-- <v-card-title>
        <v-btn color="praimary" @click="openUnitsStats()">
          بيان عددي بمرتبات بالوحدات
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="hasEditAccess() && parentFilters"
          @click="actionAdd()"
          large
          outlined
          color="primary"
        >
          إضافة وظيفة
        </v-btn>
      </v-card-title> -->
    </v-card>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="''"
    >
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "CollegeDaily",
  mounted() {
    this.init();
  },
  data: () => ({
    knowledgelevel: {
      high: 0,
      highmid: 0,
      mid: 0,
      low: 0
    },

    moratabatDaily: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: false,
          readOnly: false,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          parent: "",

          sort: 1
        },
        {
          text: "الكلية",
          value: "College",
          searchValue: "College",
          multiple: true,
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "المرتب",
          value: "Count",
          multiple: true,
          searchValue: "Count",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",

          inModel: true
        }
      ],
      items: [],
      printer: []
    },
    UnitsStats: {
      isDisplayed: false,
      headers: [],
      items: [],
      printer: {}
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Level: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      allDuties: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }, { text: "رع / مجند" }]
      },
      Directionforunit: {
        table: "Unit",
        value: "Directionforunit",
        text: "Directionforunit"
      }
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    totals: {
      Moratab: 0,
      Siasa: 0
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      if (!filters.UnitID) {
        this.showError("الرجاء اختيار وحدة ");
        return;
      }

      if (filters) this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = ["UnitID", "DutyID", "Category", "Level", "ServiceType"];
      where = this.mapToQuery(where, likes, multi);
      console.log("where", filters);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            Status: "بالخدمة",
            UnitID: filters.UnitID
          }),
          include: [{ model: "Unit" }]
        });
        let data = x.data.map(ele => ({
          ...ele
        }));
        let result = [];
        let allMortatabt = await Promise.all(
          Object.values(lodash.groupBy(data, ele => ele.College)).map(
            async ele => {
              return {
                College: ele[0].College,
                Count: ele.length
              };
            }
          )
        );
        let high = data.filter(ele => ele.KnowledgeLevel == "عليا").length;
        let highmid = data.filter(ele => ele.KnowledgeLevel == "فوق متوسطة")
          .length;
        let mid = data.filter(ele => ele.KnowledgeLevel == "متوسطه").length;
        let low = data.filter(ele => ele.KnowledgeLevel == "عادة").length;
        this.$set(this.mainTable, "items", allMortatabt);
        this.$set(this.knowledgelevel, "high", high);
        this.$set(this.knowledgelevel, "highmid", highmid);
        this.$set(this.knowledgelevel, "mid", mid);
        this.$set(this.knowledgelevel, "low", low);
        this.$set(this.mainTable, "printer", {
          data: [...result],
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(
            f => f.inTable && f.text.length
          ),
          hasParent: true
        });
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        console.log("the error", error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }

    // openUnitsStats() {
    //   const dataGroupByUnit = lodash.groupBy(
    //     this.mainTable.items,
    //     ele => ele.Unit.Unit
    //   );
    //   this.UnitsStats.isDisplayed = true;
    //   this.UnitsStats.items = Object.keys(dataGroupByUnit).map(key => ({
    //     Unit: key,

    //     SoldiersCompletenessPercentage:
    //       dataGroupByUnit[key][0]?.Unit?.SoldiersCompletenessPercentage,
    //     RatebsCompletenessPercentage:
    //       dataGroupByUnit[key][0]?.Unit?.RatebsCompletenessPercentage,
    //     Moratab: dataGroupByUnit[key].reduce(
    //       (prev, ele) => prev + ele.Moratab,
    //       0
    //     ),
    //     Siasa: dataGroupByUnit[key].reduce((prev, ele) => prev + ele.Siasa, 0)
    //   }));

    //   this.UnitsStats.items = [
    //     {
    //       Unit: "اجمالي",
    //       Moratab: this.UnitsStats.items.reduce(
    //         (prev, ele) => prev + ele.Moratab,
    //         0
    //       ),
    //       Siasa: this.UnitsStats.items.reduce(
    //         (prev, ele) => prev + ele.Siasa,
    //         0
    //       )
    //     },
    //     ...this.UnitsStats.items
    //   ];
    //   this.UnitsStats.printer = {
    //     data: [...this.UnitsStats.items],
    //     excelKey: "data",
    //     excelHeaders: this.UnitsStats.headers.filter(f => f.inTable),
    //     hasParent: true
    //   };
    // }
  }
};
</script>
