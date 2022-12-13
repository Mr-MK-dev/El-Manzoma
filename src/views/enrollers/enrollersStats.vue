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
            v-text="'يومية أماكن العمل للمجندين'"
            @click="enrolledSoldiersWithWorkPlaces"
        ></v-btn>
        <v-btn
            class="px-6"
            large
            color="primary"
            v-text="'يومية أماكن العمل للراتب العالي'"
            @click="enrolledRatebWithWorkPlaces"
        ></v-btn>
        <v-btn
            class="px-6"
            large
            @click="enrolledSoldiersAndRateb"
            color="primary"
            v-text="'يومية اماكن العمل مجند / رع'"
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
import excel from "../../server-sequelize/reciever/af/printer/excel";

const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
    .default;

const lodash = require("lodash");
export default {
  name: "enrollersStats",
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
    headers:[],
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
    }
  }),
  watch: {},
  methods: {
    async enrolledSoldiersWithWorkPlaces() {

      let followersoliders = (await this.findEnrolledSoldiers()).data,


          followersolidersGroupByWorkPlace = lodash.groupBy(
              lodash.sortBy(followersoliders, ele => ele.followerwork.ordernum),
              ele => ele.followerwork.workplace
          ),


          soliderReport = Object.keys(followersolidersGroupByWorkPlace).map(
              key => ({
                workplace: key,
                totalSoliders: followersolidersGroupByWorkPlace[key].length
              })
          );


      this.$set(this, "headers", [
        {
          text: "اماكن العمل",
          value: "workplace",
          inTable: true
        },
        {
          text: "عدد الجنود",
          value: "totalSoliders",
          inTable: true
        }
      ]);
      soliderReport = [
        ...soliderReport,
        {
          workplace: "اجمالي",
          totalSoliders: soliderReport.reduce(
              (prev, curr) => prev + curr.totalSoliders,
              0
          )
        }
      ];
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
          FollowerratebGroupByWorkPlace = lodash.groupBy(lodash.sortBy(Followerrateb, ele => ele.followerwork.ordernum), ele =>
              ele.followerwork ? ele.followerwork.workplace : ""
          ),
          ratebReport = Object.keys(FollowerratebGroupByWorkPlace).map(key => ({
            workplace: key,
            totalRateb: FollowerratebGroupByWorkPlace[key].length
          }));
      console.log("FOLLOWERrATEB", Followerrateb);
      this.$set(this, "headers", [
        {
          text: "اماكن العمل",
          value: "workplace",
          inTable: true
        },
        {
          text: "عدد الراتب  العالي",
          value: "totalRateb",
          inTable: true
        }
      ]);
      ratebReport = [
        ...ratebReport,
        {
          workplace: "اجمالي",
          totalRateb: ratebReport.reduce(
              (prev, curr) => prev + curr.totalRateb,
              0
          )
        }
      ];

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
      const soldiers = await this.findEnrolledSoldiers();
      const ratebs = await this.findEnrolledRateb();
      let both = soldiers.data.concat(ratebs.data);
      console.log(both);

      const SoldiersGroupedByWorkPlace = lodash.groupBy( lodash.sortBy(soldiers.data  , ele=>ele.followerwork.ordernum), ele =>
          ele.followerwork ? ele.followerwork.workplace : ""
      );
      const RatebsGroupedByWorkPlace = lodash.groupBy( lodash.sortBy(ratebs.data  , ele=>ele.followerwork.ordernum), ele =>
          ele.followerwork ? ele.followerwork.workplace : ""
      );
      const bothGroupedByWorkPlace = lodash.groupBy( lodash.sortBy(both  , ele=>ele.followerwork.ordernum), ele =>
          ele.followerwork ? ele.followerwork.workplace : ""
      );

      const soldierReport = Object.keys(SoldiersGroupedByWorkPlace).map(
          key => ({
            workplace: key,
            totalSoldiers: SoldiersGroupedByWorkPlace[key].length
          })
      );
      const ratebReport = Object.keys(RatebsGroupedByWorkPlace).map(key => ({
        workplace: key,
        totalRateb: RatebsGroupedByWorkPlace[key].length
      }));
      let bothReport = Object.keys(bothGroupedByWorkPlace).map(key => ({
        workplace: key,
        totalBoth: bothGroupedByWorkPlace[key].length
      }));
      var merged = lodash.merge(
          lodash.keyBy(bothReport, "workplace"),
          lodash.keyBy(soldierReport, "workplace"),
          lodash.keyBy(ratebReport, "workplace")
      );
      var values = lodash.values(merged);

      var defaults = {
        workplace: 0,
        totalSoldiers: 0,
        totalRateb: 0,
        totalBoth: 0
      };
      values.slice().map(function (e) {
        for (var key in defaults) {
          e[key] = e[key] || defaults[key];
        }
        return e;
      });
      this.$set(this, "headers", [
        {
          text: "اماكن العمل",
          value: "workplace",
          inTable: true
        },

        {
          text: "مجند",
          value: "totalSoldiers",
          inTable: true
        },
        {
          text: "رع",
          value: "totalRateb",
          inTable: true
        },
        {
          text: "رع/مجند",
          value: "totalBoth",
          inTable: true
        }
      ]);
      values = [
        ...values,
        {
          workplace: "اجمالي",
          totalBoth: values.reduce((prev, curr) => prev + curr.totalBoth, 0),
          totalSoldiers: values.reduce(
              (prev, curr) => prev + curr.totalSoldiers,
              0
          ),
          totalRateb: values.reduce((prev, curr) => prev + curr.totalRateb, 0)
        }
      ];
      console.log("finally", values);

      this.printer = {
        cons: [...values],
        excelKey: "cons",
        excelHeaders: this.headers.filter(f => f.inTable)
      };
      this.$set(this, "printer", this.printer);
      this.$set(this, "items", values);
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
