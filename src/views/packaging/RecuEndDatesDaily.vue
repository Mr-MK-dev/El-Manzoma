<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية بدفعات الرديف'"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "RecuEndDatesDaily",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.findItems();
  },
  data: () => ({
    completePlanUnit: {},
    searchLoading: false,
    loading: false,
    mainTable: {
      headers: []
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      let data = await this.api("global/get_one", {
        table: "PackagePlanDates",
        where: {
          PackagePlanID: this.$route.params.id
        }
      });

      console.log("data", data);

      this.mainTable.headers = [
        {
          text: "الوحدة",
          value: "UnitName",
          searchValue: "UnitName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        ...[
          {
            text: data.data.FirstDateName,
            value: "FirstDateValues",
            searchValue: "FirstDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.SecondDateName,
            value: "SecondDateValues",
            searchValue: "SecondDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.ThirdDateName,
            value: "ThirdDateValues",
            searchValue: "ThirdDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.FourthDateName,
            value: "FourthDateValues",
            searchValue: "FourthDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.FifthDateName,
            value: "FifthDateValues",
            searchValue: "FifthDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.SixthDateName,
            value: "SixthDateValues",
            searchValue: "SixthDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.SeventhDateName,
            value: "SeventhDateValues",
            searchValue: "SeventhDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.EighthDateName,
            value: "EighthDateValues",
            searchValue: "EighthDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          },
          {
            text: data.data.NinthDateName,
            value: "NinthDateValues",
            searchValue: "NinthDateValues",
            sortable: true,
            type: "text",
            inSearch: true,
            inTable: true,
            inModel: false,
            readonly: true,
            sort: 1
          }
        ]
      ];
      let tableName;
      let unitTableName;

      if (this.$route.params.type == '"complete"') {
        tableName = "CompletePlanCandidates";
        unitTableName = "CompletePlanUnit";
      } else if (this.$route.params.type == '"organization"') {
        tableName = "OrganizationPlanCandidates";
        unitTableName = "OrganizationPlanUnit";
      }
      console.log(this.$route.params.type);
      console.log(tableName);

      let units = await this.api("global/get_all", {
        table: unitTableName,
        where: {
          PackagePlanID: this.$route.params.id
        },
        include: [{ model: "Unit" }]
      });

      let soldiers = await this.api("global/get_all", {
        table: tableName,
        include: [
          {
            model: "Soldier"
          }
        ],

        where: this.cleanObject({
          PackageID: this.$route.params.id
        })
      });
      let returnedItems = [];

      for (let i = 0; i < units.data.length; i++) {
        returnedItems.push({
          UnitName: units.data[i].Unit.Unit,
          FirstDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.FirstDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          SecondDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.SecondDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          ThirdDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.ThirdDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          FourthDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.FourthDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          FifthDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.FifthDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          SixthDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.SixthDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          SeventhDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.SeventhDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          EighthDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.EighthDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length,
          NinthDateValues: soldiers.data.filter(
            ele =>
              ele.PackagedUnitID == units.data[i].UnitID &&
              data.data.NinthDateValues.split(",").includes(
                this.formatDate(ele.Soldier.RecuEndDate)
              )
          ).length
        });
      }

      let printer = {
        cons: [...returnedItems],
        excelKey: "cons",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.$set(this.mainTable, "printer", printer);
      this.$set(this.mainTable, "items", returnedItems);
    }
  }
};
</script>
