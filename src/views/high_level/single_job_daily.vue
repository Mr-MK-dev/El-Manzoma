<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="false"
    />

    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'نتائج اليومية'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

const lodash = require("lodash");
const displayTypes = types.displayTypes;

const basicHeaders = [
  {
    text: "نوع العرض",
    value: "Type",
    searchValue: "Type",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  {
    text: "نوع عرض الفرق",
    value: "TraineeShipType",
    searchValue: "TraineeShipType",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  {
    text: "الوحدة",
    value: "Unit",
    searchValue: "unitIds",
    sortable: true,
    type: "select",
    inSearch: false,
    parent: " ",
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "الوظيفة",
    value: "Duty",
    searchValue: "DutyID",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  },
  {
    text: "العمل الحالي",
    value: "Name",
    searchValue: "CurrentJobID",
    sortable: true,
    type: "select",
    parent: " ",
    inSearch: true,
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  },
  {
    text: "الفرقة",
    value: "TraineeShip",
    searchValue: "TraineeShipID",
    sortable: true,
    type: "select",
    inSearch: false,
    parent: " ",
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  },

  {
    text: "التجميعات القتالية",
    value: "Collection",
    searchValue: "collections",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  },
  {
    text: "التجميعات الفرق",
    value: "TraineeShipCollection",
    searchValue: "traineeShipCollections",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: false,
    sort: 1
  }
];
export default {
  name: "singleJobDaily",
  props: {},
  async mounted() {
    await this.init();
  },

  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "موجود",
            value: "mawgod",
            inTable: true,
            inSearch: false
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "singleCategoryDaily",
    selects: {
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      traineeShipCollections: {
        text: "Name",
        value: "ID_KEY",
        table: "TraineeShipCollection"
      },
      DutyID: {
        text: "Duty",
        value: "DutyID",
        table: "Duty"
      },
      CurrentJobID: {
        table: "Jobs",
        text: "Name",
        value: "ID_KEY"
      },
      TraineeShipID: {
        table: "TraineeShip",
        text: "Name",
        value: "TraineeShipID"
      },
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Type: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لتجميعات قتالية",
            value: displayTypes.collections
          },
          {
            text: "لوحدات محددة",
            value: displayTypes.unites
          }
        ]
      },
      TraineeShipType: {
        text: "text",
        value: "value",
        data: [
          {
            text: "لتجميعات الفرق",
            value: displayTypes.traineeshipsCollections
          },
          {
            text: "لفرقة محددة",
            value: displayTypes.traineeships
          }
        ]
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        ...this.search,
        DutyID: this.search.DutyID,
        CurrentJobID: this.search.CurrentJobID,
        Type: newValue
      };

      const unitFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit"
      );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
      }
    },
    "search.TraineeShipType"(newValue) {
      this.search = {
        ...this.search,
        DutyID: this.search.DutyID,
        CurrentJobID: this.search.CurrentJobID,
        TraineeShipType: newValue
      };

      const traineeshipFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TraineeShip"
      );

      const traineeshipCollectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "TraineeShipCollection"
      );
      this.mainTable.headers[traineeshipFeildIndex].inSearch = false;
      this.mainTable.headers[traineeshipCollectionFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.traineeships)
        this.mainTable.headers[traineeshipFeildIndex].inSearch = true;

      if (newValue == displayTypes.traineeshipsCollections) {
        this.mainTable.headers[traineeshipCollectionFeildIndex].inSearch = true;
      }
    },
    async "search.collections"(newValue) {
      console.log(newValue);
      console.log(this.search.Collection);
      if (this.search.Type == displayTypes.collections) {
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: { CollectionId: newValue }
        });
        console.log(data);
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
        console.log(data.data.map(ele => ele.UnitID));
      }
    },
    async "search.traineeShipCollections"(newValue) {
      if (this.search.TraineeShipType == displayTypes.traineeshipsCollections) {
        let data = await this.api("global/get_all", {
          table: "TraineeShipCollectionPivot",
          where: { CollectionId: newValue }
        });
        console.log(data);
        this.$set(
          this.search,
          "TraineeShipIds",
          data.data.map(ele => ele.TraineeShipID)
        );
        console.log(data.data.map(ele => ele.TraineeShipID));
      }
      this.$set(this.search, "DutyID", null);
      this.$set(this.search, "CurrentJobID", null);
    },
    "search.DutyID"(newValue) {
      if (newValue) {
        this.$set(this.search, "CurrentJobID", null);
        this.$set(this.search, "TraineeShipID", null);
      }
    },
    "search.CurrentJobID"(newValue) {
      if (newValue) {
        this.$set(this.search, "DutyID", null);
        this.$set(this.search, "TraineeShipID", null);
      }
    },
    "search.TraineeShipID"(newValue) {
      if (newValue) {
        this.$set(this.search, "DutyID", null);
        this.$set(this.search, "CurrentJobID", null);
      }
    }
  },
  methods: {
    async findItems() {
      if (
        !this.search.DutyID &&
        !this.search.CurrentJobID &&
        !this.search.TraineeShipID &&
        !this.search.TraineeShipIds
      ) {
        this.showError("من فضلك قم باختيار وظيفة او عمل حالي او فرقة اولا");
        return;
      }
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      console.log(this.search);
      const units = await this.api("sections/tasgeel/reports/getUnits", {
        ...this.search
      });

      console.log("i'm findig");

      console.log(units);
      if (this.search.TraineeShipIds && this.search.TraineeShipIds.length)
        this.search.TraineeShipID = [...this.search.TraineeShipIds];
      let items = [];
      let rateb = [];
      try {
        for (const Unit of units.data) {
          if (this.search.TraineeShipID != null) {
            rateb = await this.api("global/get_all", {
              table: "RatebTraineeShip",
              include: [
                {
                  model: "Rateb",
                  include: [{ model: "Unit", where: { UnitID: Unit.UnitID } }],
                  where: { Status: `بالخدمة` }
                }
              ],
              where: { TraineeShipID: { $in: this.search.TraineeShipID } }
            });
            rateb = lodash.uniqBy(rateb.data, ele => ele.id);
          } else {
            rateb = await this.api("global/get_all", {
              table: "Rateb",
              where:
                this.search.DutyID != null
                  ? {
                      UnitID: Unit.UnitID,
                      Status: `بالخدمة`,
                      DutyID: this.search.DutyID
                    }
                  : {
                      UnitID: Unit.UnitID,
                      Status: `بالخدمة`,
                      CurrentJobID: this.search.CurrentJobID
                    }
            });
            rateb = rateb.data;
          }
          items.push({
            ...Unit,
            mawgod: rateb.length
          });

          // console.log('mortab', mortab);
          // console.log('actual', actual);
          // console.log('finalItem', finalItem);
          // items.push(finalItem);
        }
        items.push({
          ...{
            Unit: "الاجمالي"
          },

          mawgod: lodash.sumBy(items, el => el.mawgod)
        });

        console.log("items", items);

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });

        console.log("here I log", items);
        this.$set(this, "searchLoading", false);
      } catch (e) {
        this.handleError(e);
        this.$set(this, "searchLoading", false);
      }
    }
    // async getRecuEndDateOptions() {
    //   const result = await this.api("global/queryRunners", {
    //     query: `   select count (ID) count ,  RecuEndDate  from Soldier GROUP  By RecuEndDate`
    //   });
    //   this.selects.RecuEndDate.data = result.data.map(ele => ({
    //     value: `${ele.RecuEndDate}`,
    //     text: ele.RecuEndDate
    //   }));
    // }
  }
};
</script>
