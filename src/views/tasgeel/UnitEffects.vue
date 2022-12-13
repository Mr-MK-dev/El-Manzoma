<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      :search="search"
      title="بحث متقدم في مؤثرات الوحدات"
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
      <template v-slot:item.actionDetails="{ item }">
        <v-chip icon color="primary" @click="actionRouteToDetails(item)">
          <v-icon>mdi-information-variant</v-icon>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const displayTypes = types.displayTypes;

export default {
  name: "UnitEffects",
  props: {},
  mounted() {
    this.initDates();
    this.init();
  },
  data: () => ({
    Effect: {},
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
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
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
        {
          text: "التجميعات القتالية",
          value: "Collection",
          searchValue: "collections",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: false,
          inModel: false,
          multiple: false
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "unitIds",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          multiple: true
        },
        {
          text: "تاريخ المؤثرات",
          value: "date",
          searchValue: "date",
          type: "date",
          multiple: true,
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 2
        },

        {
          text: "مرتب الراتب العالي ",
          searchValue: "ratebSalary",
          value: "ratebSalary",
          inTable: true,
          type: "text"
        },
        {
          text: "سياسي الراتب العالي",
          searchValue: "ratebSaisa",
          value: "ratebSaisa",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب المجند",
          searchValue: "soliderSalary",
          value: "soliderSalary",
          inTable: true,
          type: "text"
        },
        {
          text: "سياسة المجند",
          searchValue: "soliderSaisa",
          value: "soliderSaisa",
          inTable: true,
          type: "text"
        },
        {
          text: "اجمالي المجند",
          searchValue: "totalSoliders",
          value: "totalSoliders",
          inTable: true,
          type: "text"
        },
        {
          text: "اجمال الراتب",
          searchValue: "totalRateb",
          value: "totalRateb",
          inTable: true,
          type: "text"
        },
        {
          text: "النقص في المجند",
          searchValue: "soliderDecrement",
          value: "soliderDecrement",
          inTable: true,
          type: "text"
        },
        {
          text: "الزيادة في المجند",
          searchValue: "soliderIncreament",
          value: "soliderIncreament",
          inTable: true,
          type: "text"
        },
        {
          text: "النقص في الراتب العالي",
          searchValue: "RatebDecrement",
          value: "RatebDecrement",
          inTable: true,
          type: "text"
        },
        {
          text: "الزيادة في الراتب العالي",
          searchValue: "RatebIncreament",
          value: "RatebIncreament",
          inTable: true,
          type: "text"
        },
        {
          text: "",
          value: "actionDetails",
          searchValue: "actionDetails",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 7
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject",
    selects: {
      unitIds: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },

      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
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
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      // this.search = {
      //   Type: newValue
      // };

      const unitFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit"
      );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      const dateFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "date"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      this.mainTable.headers[dateFeildIndex].inSearch = true;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;
      this.mainTable.headers[dateFeildIndex].inSearch = true;

      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
        this.mainTable.headers[dateFeildIndex].inSearch = true;
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
    }
  },
  methods: {
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);

        const units = await this.api("sections/tasgeel/reports/getUnits", {
          ...this.search
        });
        let values = [];
        for (const Unit of units.data) {
          let where = {
              UnitID: Unit.UnitID
            },
            likes = [],
            multi = [],
            dates = [this.search.date];

          where = this.mapToQuery(where, likes, multi, dates);
          console.log("Dates is", dates);
          const x = await this.api("global/get_all", {
            table: "UnitEffecs",
            include: [
              {
                model: "Unit"
              },
              {
                model: "Soldier"
              },
              {
                model: "Rateb"
              }
            ],
            where
          });

          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`
            }
          });
          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`
            }
          });

          let mortbat = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: this.cleanObject({
              UnitID: Unit.UnitID
            }),
            include: [
              {
                model: "Unit"
              },
              {
                model: "Duty"
              },
              {
                model: "Weapon"
              }
            ]
          });
          values.push({
            ...Unit,
            ratebSalary: lodash.sumBy(
              mortbat.data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Moratab
            ),
            ratebSaisa: lodash.sumBy(
              mortbat.data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Siasa
            ),
            soliderSalary: lodash.sumBy(
              mortbat.data.filter(
                ele =>
                  ele.ServiceType === "مجند" || ele.ServiceType === "رع / مجند"
              ),
              ele => ele.Moratab
            ),
            soliderSaisa: lodash.sumBy(
              mortbat.data.filter(
                ele =>
                  ele.ServiceType === "مجند" || ele.ServiceType === "رع / مجند"
              ),
              ele => ele.Siasa
            ),
            totalSoliders: soliders.data.length,
            totalRateb: rateb.data.length,
            soliderDecrement: x.data.filter(
              effect =>
                effect.UnitID == Unit.UnitID &&
                !effect.increment &&
                effect.type === "Soldier"
            ).length,
            soliderIncreament: x.data.filter(
              effect =>
                effect.UnitID == Unit.UnitID &&
                effect.increment &&
                effect.type === "Soldier"
            ).length,
            RatebDecrement: x.data.filter(
              effect =>
                effect.UnitID == Unit.UnitID &&
                !effect.increment &&
                effect.type === "Rateb"
            ).length,
            RatebIncreament: x.data.filter(
              effect =>
                effect.UnitID == Unit.UnitID &&
                effect.increment &&
                effect.type === "Rateb"
            ).length
          });
        }

        let data = values,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", values);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },

    calculateReport() {
      const groupedValue = lodash.groupBy(
        this.mainTable.items,
        ele => `${ele.WeaponID}`
      );

      this.reportDaily.items = Object.keys(groupedValue).map(key => ({
        Weapon: groupedValue[key][0].Weapon?.Weapon,
        totalSoliders: groupedValue[key].length
      }));
      this.reportDaily.isDisplayed = true;
    },
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "Effect", {
        ...item,
        isEdit: true
      });
    },
    actionRouteToDetails(item) {
      this.$router.push(`/UnitEffectsDetails/${item.UnitID}`);
    }
  }
};
</script>
