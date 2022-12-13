<template>
  <div class="Categories_Dailes">
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      :clearOption="true"
      title="بحث متقدم في الراتب العالي"
      :addButton="false"
    />
    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :loading="searchLoading"
        :title="'نتائج اليومية عددية للراتب العالي'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<style></style>

<script>
const constants = require("../../../../../Constant").default;
const types = require("../../../../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
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
    inSearch: true,
    inTable: false,
    inModel: false,
    sort: 1
  },
  // {
  //   text: "الاتجاه",
  //   value: "Direction",
  //   sortable: true,
  //   inTable: true,
  //   multiple: true,
  //   sort: 1
  // },
  {
    text: "الوحدة",
    value: "Unit",
    searchValue: "unitIds",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
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
    text: "صف",
    value: "saf",
    searchValue: "saf",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "سائق",
    value: "sa2eq",
    searchValue: "sa2eq",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "كاتب",
    value: "kateb",
    searchValue: "kateb",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "إجمالي",
    value: "Total",
    searchValue: "Total",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  }
];

export default {
  name: "UnitsWithRatebCategory",
  props: {
    items: {
      default: []
    }
  },
  async mounted() {
    await this.init();
    await this.getRecuEndDateOptions();
  },
  data: () => ({
    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [...basicHeaders, ...[]],
      items: [],
      printer: {}
    },
    componentName: "UnitesWithPointsStats",
    selects: {
      directions: {
        text: "Name",
        value: "Name",
        table: "Sectors"
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
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
            text: "التجميعات قتالية",
            value: displayTypes.collections
          },
          {
            text: "الوحدات محددة",
            value: displayTypes.unites
          }
        ]
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      Weapon: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
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
    async "search.collections"(newValue) {
      console.log(this.search.Collection);
      if (this.search.Type == displayTypes.collections) {
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: { CollectionId: newValue }
        });
        this.$set(
          this.search,
          "unitIds",
          data.data.map(ele => ele.UnitID)
        );
        console.log(data.data.map(ele => ele.UnitID));
      }
    }
  },
  methods: {
    async findItems(filters) {
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const unites = await this.api("sections/tasgeel/reports/getUnits", {
          ...this.search
        });

        let items = [];
        for (const unit of unites.data) {
          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: unit.UnitID,
              Status: `بالخدمة`
            }
          });
          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              UnitID: unit.UnitID,
              ServiceType: `راتب عالى`
            }
          });
          const UnitObj = await this.api("global/get_one", {
            table: "Unit",
            where: { UnitID: unit.UnitID }
          });
          const points = await this.api("global/get_all", {
            table: "PointHub",
            where: {
              Unit_ID: unit.UnitID
            },
            include: [
              {
                model: "Point"
              }
            ]
          });
          items.push({
            ...UnitObj.data,
            saf: this.items.filter(
              ele =>
                ele.Rateb.RatebCategory.includes("صف") &&
                ele.TransferedUnitID === unit.UnitID
            ).length,
            sa2eq: this.items.filter(
              ele =>
                ele.Rateb.RatebCategory.includes("سائق عجل") &&
                ele.TransferedUnitID === unit.UnitID
            ).length,
            kateb: this.items.filter(
              ele =>
                ele.Rateb.RatebCategory.includes("كاتب") &&
                ele.TransferedUnitID === unit.UnitID
            ).length,
            Total: this.items.filter(
              ele => ele.TransferedUnitID === unit.UnitID
            ).length
          });
        }
        items.push({
          Unit: "الإجمالي",
          saf: lodash.sumBy(items, ele => ele.saf),
          sa2eq: lodash.sumBy(items, ele => ele.sa2eq),
          kateb: lodash.sumBy(items, ele => ele.kateb),
          Total: lodash.sumBy(items, ele => ele.Total)
        });
        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        console.log(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }

      this.$set(this, "searchLoading", false);
    }
  }
};
</script>
