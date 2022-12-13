<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في بيان التسكين"
      :addButton="false"
    />
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            ضابط : {{ totals.OfficerCount }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            راتب عالي : {{ totals.RatebCount }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            مجند : {{ totals.SoldierCount }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي درجات اخرى : {{ totals.SoldierCount + totals.RatebCount }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            اجمالي عام :
            {{ totals.SoldierCount + totals.RatebCount + totals.OfficerCount }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :wordFile="'/tasgeel/Tasken'"
      :items="mainTable.items"
      :isExcel="true"
      :title="'بيان التسكين'"
    >
      <template v-slot:item.otherLevelsTotal="{ item }">
        {{ item.RatebCount + item.SoldierCount }}
      </template>
      <template v-slot:item.AllTotals="{ item }">
        {{ item.RatebCount + item.SoldierCount + item.OfficerCount }}
      </template>
      <template v-slot:item.Name="{ item }">
        {{ item.pointName ? item.pointName : item.pointHubName }}
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="tasken"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
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
  name: "tasken",

  mounted() {
    this.init();
  },
  data: () => ({
    tasken: {},
    totals: {
      OfficerCount: 0,
      RatebCount: 0,
      SoldierCount: 0
    },
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    PointsModel: {
      model: false
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الموجودات",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "م",
          value: "index",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الكتيبة",
          value: "unitName",
          searchValue: "Unit_ID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "البيان",
          value: "Name",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "عدد الضباط",
          value: "OfficerCount",
          searchValue: "OfficerCount",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "عدد الراتب العالي",
          value: "RatebCount",
          searchValue: "RatebCount",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "عدد الجنود",
          value: "SoldierCount",
          searchValue: "SoldierCount",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "إجمالي درجات اخرى",
          value: "otherLevelsTotal",
          searchValue: "otherLevelsTotal",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "إجمالي عام",
          value: "AllTotals",
          searchValue: "AllTotals",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      Unit_ID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    }
  }),
  methods: {
    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        if (!this.tasken.pointName) {
          saveItem = await this.api(
            `global/${this.tasken.isEdit ? "update_one" : "create_one"}`,
            {
              table: "PointHub",
              where: !this.tasken.isEdit
                ? this.tasken
                : {
                    ID_KEY: this.tasken.pointHubId
                  },
              update: this.tasken
            }
          );
        } else {
          saveItem = await this.api(
            `global/${this.tasken.isEdit ? "update_one" : "create_one"}`,
            {
              table: "Point",
              where: !this.tasken.isEdit
                ? this.tasken
                : {
                    ID_KEY: this.tasken.pointId
                  },
              update: this.tasken
            }
          );
        }
        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems(this.search);
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      try {
        this.search = filters;
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = {
            ...this.search,
            ...filters
          },
          likes = [],
          multi = [];
        where = this.mapToQuery(where, likes, multi);
        const x = await this.api("global/get_all", {
          table: "PointHub",
          include: [
            {
              model: "Unit"
            },
            {
              model: "Point"
            }
          ],
          where
        });

        let data = x.data;
        console.log(data);

        let newData = data.map(ele => ({
          pointName: ele.Points.Name || "",
          pointId: ele.Points.ID_KEY,
          pointHubName: ele.Name,
          pointHubId: ele.ID_KEY,
          unitName: ele.Unit.Unit,
          unitId: ele.Unit.UnitID,
          OfficerCount: ele.Points.ID_KEY
            ? ele.Points.OfficerCount
            : ele.OfficerCount,
          SoldierCount: ele.Points.ID_KEY
            ? ele.Points.SoldierCount
            : ele.SoldierCount,
          RatebCount: ele.Points.ID_KEY
            ? ele.Points.RatebCount
            : ele.RatebCount,
          Bian: ele.Points.Name ? ele.Points.Name : ele.Name,
          isBian: ele.isBian,
          isHeadQuarter: ele.isHeadQuarter || false,
          isPointHeadQuarter: ele.Points.isHeadQuarter || false
        }));

        let groupedData = lodash.groupBy(newData, ele => ele.pointHubId);

        console.log("new data", newData);
        console.log(
          "filtered data",
          newData.filter(ele => !ele.isBian)
        );

        let filteredData = newData.filter(ele => !ele.isBian);

        Object.keys(groupedData).map(key => {
          if (
            !groupedData[key][0].isBian &&
            !groupedData[key][0].isHeadQuarter
          ) {
            groupedData[key].push({
              Bian: "إجمالي",
              OfficerCount: groupedData[key].reduce(
                (prev, ele) => prev + ele["OfficerCount"],
                0
              ),
              SoldierCount: groupedData[key].reduce(
                (prev, ele) => prev + ele["SoldierCount"],
                0
              ),
              RatebCount: groupedData[key].reduce(
                (prev, ele) => prev + ele["RatebCount"],
                0
              )
            });
          }
        });

        console.log("groupedData before", groupedData);
        //make pointHubheadQuarterFirst
        for (const key in groupedData) {
          let index = groupedData[key].findIndex(function(x) {
            return x.isPointHeadQuarter == true;
          });
          let pointItem;
          if (index > -1) {
            console.log("pointindex", index);
            pointItem = groupedData[key].splice(index, 1);
            groupedData[key] = [
              pointItem[0],
              ...groupedData[key].filter(ele => !ele.isPointHeadQuarter)
            ];
          }
        }
        console.log("GroupedData After", groupedData);
        console.log(lodash.flatten(Object.values(groupedData)));

        let printedData = lodash.flatten(Object.values(groupedData));
        console.log("printed data", printedData);
        printedData.push({
          Bian: "إجمالي عام",
          OfficerCount: filteredData.reduce(
            (prev, ele) => prev + ele["OfficerCount"],
            0
          ),
          SoldierCount: filteredData.reduce(
            (prev, ele) => prev + ele["SoldierCount"],
            0
          ),
          RatebCount: filteredData.reduce(
            (prev, ele) => prev + ele["RatebCount"],
            0
          )
        });
        //shitty code  need to be fixed to add isBian at last
        printedData.forEach((ele, index) => {
          if (ele.isBian == true) {
            printedData.push(printedData.splice(index, 1)[0]);
          }
        });
        printedData.forEach((ele, index) => {
          if (ele.isBian == true) {
            printedData.push(printedData.splice(index, 1)[0]);
          }
        });

        this.$set(this, "totals", {
          OfficerCount: filteredData.reduce(
            (prev, ele) => prev + ele["OfficerCount"],
            0
          ),
          SoldierCount: filteredData.reduce(
            (prev, ele) => prev + ele["SoldierCount"],
            0
          ),
          RatebCount: filteredData.reduce(
            (prev, ele) => prev + ele["RatebCount"],
            0
          )
        });
        //make unit head quarter first
        const HQindex = printedData.findIndex(function(x) {
          return x.isHeadQuarter == true;
        });
        let item = printedData.splice(HQindex, 1);
        console.log(item);
        printedData = [
          item[0],
          ...printedData.filter(ele => !ele.isHeadQuarter)
        ];

        printedData.forEach(function(ele, index) {
          ele.index = index + 1;
        });
        console.log("HQindex", HQindex);
        this.$set(this.mainTable, "items", newData);
        this.$set(this.mainTable, "printer", {
          data: printedData,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "tasken", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
