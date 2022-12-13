<template>
  <div>
    <search-bulider
        :fields="baseHeaders"
        :selects="selects"
        :clearOption="false"
        :search="search"
        :searchButton="false"
        :addButton="false"
        title="بحث متقدم فالملحقين"
        addBtnTitle="إضافة الحاق"
    />
    <v-card :loading="searchLoading" :disabled="searchLoading">
      <v-divider></v-divider>
      <v-card-actions class="px-4 py-4">
        <v-btn
          class="px-6"
          large
          color="primary"
          v-text="'مجندين'"
          @click="enrolledSoldiersWithWorkPlacesAndUnit"
        ></v-btn>
        <v-btn
          class="px-6"
          large
          color="primary"
          v-text="'راتب عالي'"
          @click="enrolledRatebWithWorkPlaces"
        ></v-btn>
        <v-btn
          class="px-6"
          large
          @click="enrolledSoldiersAndRateb"
          color="primary"
          v-text="'مجند / رع'"
        ></v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="mt-8" v-if="items.length > 0">
      <table-bulider
        :headers="headers.filter(h => h.inTable)"
        :items="items"
        :printer="printer"
      >
      </table-bulider>
    </v-card>
  </div>
</template>
<script>
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const constants = require("../../Constant").default;

const lodash = require("lodash");
export default {
  name: "enrollersUnitWithWorkplaces",
  mounted() {
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  data: () => ({
    groupedValue: [],
    subjectLimit: 10,
    search: {},
    searchLoading: false,
    baseHeaders: [
      {
        text: "الفئة",
        value: "Category",
        searchValue: "Category",
        sortable: true,
        type: "select",
        multiple: true,
        inSearch: true,
        inTable: false,
        inModel: false,
        readonly: true,
        sort: 1
      },
      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        multiple: true,
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      },
      {
        text: "السلاح",
        value: "Weapon",
        searchValue: "WeaponID",
        sortable: true,
        type: "select",
        multiple: true,
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      },
      {
        text: "التجميعات القتالية",
        value: "Collections",
        searchValue: "CollectionID",
        sortable: true,
        type: "select",
        multiple: false,
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      },
      {
        text: "الوحدة",
        value: "Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        multiple: true,
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      },

    ],
    headers: [],
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    printer: {},
    selects :{
      CollectionID: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        value: "WeaponID",
        text: "Weapon"
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
    },
  }),
  watch: {},
  methods: {
    async enrolledSoldiersWithWorkPlacesAndUnit() {
      let followersoliders = (await this.findEnrolledSoldiers()).data,
        followersolidersGroupByUnit = lodash.groupBy(
          followersoliders,
          ele => ele.Soldier?.Unit?.Unit
        ),
        workplaces = lodash.uniq(
          followersoliders.map(ele =>
            ele.followerwork ? ele.followerwork.workplace : ""
          )
        ),
        soliderReport = Object.keys(followersolidersGroupByUnit).map(key => {
          let ele = {
            unit: key,
            totalSoliders: followersolidersGroupByUnit[key].length
          };
          workplaces.forEach(workplace => {
            ele[workplace] = followersolidersGroupByUnit[key].filter(
              ele => ele.followerwork?.workplace == workplace
            ).length;
          });

          return ele;
        });
      this.$set(this, "headers", [
        {
          text: "الوحدة",
          value: "unit",
          inTable: true
        },

        ...workplaces.map(workplace => ({
          text: workplace,
          value: workplace,
          inTable: true
        })),

        {
          text: "الاجمالي",
          value: "totalSoliders",
          inTable: true
        }
      ]);

      let totalEle = {
        unit: "الإجمالي",
        totalSoliders: soliderReport.reduce(
          (prev, curr) => prev + curr.totalSoliders,
          0
        )
      };

      workplaces.forEach(ele => {
        totalEle[ele] = soliderReport.reduce((prev, cur) => prev + cur[ele], 0);
      });

      soliderReport = [...soliderReport, totalEle];

      console.log(soliderReport);
      this.printer = {
        cons: [...soliderReport],
        excelKey: "cons",
        excelHeaders: this.headers.filter(f => f.inTable)
      };
      this.$set(this, "printer", this.printer);
      this.$set(this, "items", soliderReport);
      this.$set(this, "searchLoading", false);
    },
    async enrolledRatebWithWorkPlaces() {
      let Followerrateb = (await this.findEnrolledRateb()).data,
        FollowerratebGroupByWorkPlace = lodash.groupBy(
          Followerrateb,
          ele => ele.Rateb?.Unit?.Unit
        ),
        workplaces = lodash.uniq(
          Followerrateb.map(ele =>
            ele.followerwork ? ele.followerwork.workplace : ""
          )
        ),
        ratebReport = Object.keys(FollowerratebGroupByWorkPlace).map(key => {
          let ele = {
            unit: key,
            totalRateb: FollowerratebGroupByWorkPlace[key].length
          };
          workplaces.forEach(workplace => {
            ele[workplace] = FollowerratebGroupByWorkPlace[key].filter(
              ele => ele.followerwork?.workplace == workplace
            ).length;
          });

          return ele;
        });

      this.$set(this, "headers", [
        {
          text: "الوحدة",
          value: "unit",
          inTable: true
        },

        ...workplaces.map(workplace => ({
          text: workplace,
          value: workplace,
          inTable: true
        })),

        {
          text: "الإجمالي",
          value: "totalRateb",
          inTable: true
        }
      ]);
      let totalEle = {
        unit: "الإجمالي",
        totalRateb: ratebReport.reduce(
          (prev, curr) => prev + curr.totalRateb,
          0
        )
      };

      workplaces.forEach(ele => {
        totalEle[ele] = ratebReport.reduce((prev, cur) => prev + cur[ele], 0);
      });

      ratebReport = [...ratebReport, totalEle];
      this.printer = {
        cons: [...ratebReport],
        excelKey: "cons",
        excelHeaders: this.headers.filter(f => f.inTable)
      };
      this.$set(this, "printer", this.printer);
      this.$set(this, "items", ratebReport);
      this.$set(this, "searchLoading", false);
    },
    async enrolledSoldiersAndRateb() {
      let soldiers = await this.findEnrolledSoldiers();
      let ratebs = await this.findEnrolledRateb();
      let both = soldiers.data.concat(ratebs.data),
        bothGroupByWorkPlace = lodash.groupBy(
          both,
          ele => ele.Rateb?.Unit?.Unit || ele.Soldier?.Unit?.Unit
        ),
        workplaces = lodash.uniq(
          both.map(ele => (ele.followerwork ? ele.followerwork.workplace : ""))
        ),
        bothReport = Object.keys(bothGroupByWorkPlace).map(key => {
          let ele = {
            unit: key,
            total: bothGroupByWorkPlace[key].length
          };
          workplaces.forEach(workplace => {
            ele[workplace] = bothGroupByWorkPlace[key].filter(
              ele => ele.followerwork?.workplace == workplace
            ).length;
          });

          return ele;
        });
      console.log(both);

      this.$set(this, "headers", [
        {
          text: "الوحدة",
          value: "unit",
          inTable: true
        },

        ...workplaces.map(workplace => ({
          text: workplace,
          value: workplace,
          inTable: true
        })),

        {
          text: "اجمالي",
          value: "total",
          inTable: true
        }
      ]);
      let totalEle = {
        unit: "الإجمالي",
        total: bothReport.reduce((prev, curr) => prev + curr.total, 0)
      };

      workplaces.forEach(ele => {
        totalEle[ele] = bothReport.reduce((prev, cur) => prev + cur[ele], 0);
      });

      bothReport = [...bothReport, totalEle];
      this.printer = {
        cons: [...bothReport],
        excelKey: "cons",
        excelHeaders: this.headers.filter(f => f.inTable)
      };
      this.$set(this, "printer", this.printer);
      this.$set(this, "items", bothReport);
      this.$set(this, "searchLoading", false);
    },
    async findEnrolledSoldiers() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      if (this.search.CollectionID) {
        console.log(this.search.CollectionID);
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: {CollectionId: this.search.CollectionID}
        });
        console.log(data);
        this.$set(this.search, "UnitID", data.data.map(ele => ele.UnitID));
        console.log(data.data.map(ele => ele.UnitID));
      }
      this.$set(this.search, "SoldierCategory", this.search.Category);


      let where = {
            ...this.search,
            CollectionID: null,
            Category: null,
            RatebCategory: null,

            Status: "بالخدمة"
          },
          likes = [],
          multi = ["UnitID", 'WeaponID', "SoldierCategory", "RecuStage"],
          date = [];

      where = this.mapToQuery(where, likes, multi, date);
      return this.api("global/get_all", {
        table: "followersolider",
        where: {
          isEnrolled: 1
        },
        include: [
          {
            model: "FollowingRigion"
          },
          {
            model: "followerwork"
          },
          {
            model: "Soldier",
            where: where,

            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
        // where
      });
    },
    async findEnrolledRateb() {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      if (this.search.CollectionID) {
        console.log(this.search.CollectionID);
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: {CollectionId: this.search.CollectionID}
        });
        console.log(data);
        this.$set(this.search, "UnitID", data.data.map(ele => ele.UnitID));
        console.log(data.data.map(ele => ele.UnitID));
      }
      this.$set(this.search, "RatebCategory", this.search.Category);

      let where = {
            ...this.search,
            CollectionID: null,
            Category: null,
            SoldierCategory: null,
            Status: "بالخدمة"
          },
          likes = [],
          multi = ["UnitID", 'WeaponID', "RatebCategory", "RecuStage"],
          date = [];

      where = this.mapToQuery(where, likes, multi, date);

      return this.api("global/get_all", {
        table: "Followerrateb",
        where: {isEnrolled: 1},
        include: [
          {
            model: "FollowingRigion"
          },
          {
            model: "followerwork"
          },
          {
            model: "Rateb",
            where: where,
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
        // where
      });
    }
  }
};
</script>
