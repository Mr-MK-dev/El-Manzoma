<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :search="search"
      :clearOption="true"
      title="بحث متقدم في إلوحدات"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :wordFile="'/tasgeel/curnt-power'"
    >
      <template v-slot:header="{ props }">
        <thead class="v-data-table-header">
          <tr>
            <th
              v-for="(item, i) in mainTable.headers.filter(ele => ele.inTable)"
              :key="item.parent + i"
              colspan="1"
              class="text-center parent-header"
            >
              {{ item.parent }}
            </th>
          </tr>
          <tr>
            <th
              v-for="(item, i) in mainTable.headers.filter(ele => ele.inTable)"
              :key="item.text + i"
              colspan="1"
              class="text-center parent-header"
            >
              {{ item.text }}
            </th>
          </tr>
        </thead>
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
  name: "CurrentPower",
  props: {},
  async mounted() {
    await this.getRecuEndDateOptions();

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
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          multiple: true,
          sort: 1
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
          text: "التمركز",
          searchValue: "Directionforunit",
          value: "Directionforunit",
          parent: " ",
          inTable: true,
          type: "text"
        },
        {
          text: "المرتب",
          searchValue: "officerMortab",
          parent: "الظباط",
          value: "officerMortab",
          inTable: true,
          type: "text"
        },
        {
          text: "السياسة",
          searchValue: "officerSiasa",
          parent: "الظباط",
          value: "officerSiasa",
          inTable: true,
          type: "text"
        },
        {
          text: "الموجود",
          searchValue: "officerTotal",
          value: "officerTotal",
          parent: "الظباط",
          inTable: true,
          type: "text"
        },

        {
          text: "مرتب الراتب العالي",
          searchValue: "ratebSalary",
          parent: "الدرجات الاخري",
          value: "ratebSalary",
          inTable: true,
          type: "text"
        },
        {
          text: "سياسة الراتب العالي",
          searchValue: "ratebSaisa",
          parent: "الدرجات الاخري",
          value: "ratebSaisa",
          inTable: true,
          type: "text"
        },
        {
          text: "مرتب المجند ",
          searchValue: "soliderSalary",
          value: "soliderSalary",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        },
        {
          text: "سياسة المجند ",
          searchValue: "soliderSaisa",
          value: "soliderSaisa",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        },
        {
          text: "اجمالي المرتب",
          searchValue: "mortab",
          value: "mortab",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        },
        {
          text: "اجمالي السياسة",
          searchValue: "siasa",
          value: "siasa",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        },

        {
          text: "موجود الراتب العالي",
          searchValue: "totalRateb",
          parent: "الدرجات الاخري",
          value: "totalRateb",
          inTable: true,
          type: "text"
        },
        {
          text: "موجود المجند ",

          searchValue: "totalSoliders",
          value: "totalSoliders",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        },
        {
          text: "اجمالي الموجود",
          searchValue: "total",
          value: "total",
          parent: "الدرجات الاخري",
          inTable: true,
          type: "text"
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject",
    selects: {
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
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
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier  where Status like N'%بالخدمة%'  GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
    },
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        const units = await this.api("sections/tasgeel/reports/getUnits", {
          ...this.search
        });
        let values = [];
        let index = 0;
        for (const Unit of units.data) {
          index++;
          const soliders = await this.api("global/get_all", {
            table: "Soldier",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`,
              RecuEndDate: {
                $in: this.search.RecuEndDate
              }
            }
          });
          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`
            }
          });

          let officerDuties = await this.api(`global/get_all`, {
            table: "OfficerMortabatDuties",
            where: this.cleanObject({
              UnitID: Unit.UnitID
            }),
            include: [
              {
                model: "Unit"
              },
              {
                model: "OfficerDuty"
              },
              {
                model: "Weapon"
              }
            ]
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
            index,
            mortab: lodash.sumBy(mortbat.data, ele => ele.Moratab),
            siasa: lodash.sumBy(mortbat.data, ele => ele.Siasa),
            totalSoliders: soliders.data.length,
            totalRateb: rateb.data.length,
            total: rateb.data.length + soliders.data.length,
            officerMortab: lodash.sumBy(officerDuties.data, ele => ele.Moratab),
            officerSiasa: lodash.sumBy(officerDuties.data, ele => ele.Siasa),
            officerTotal: 0
          });
        }

        values.push({
          Unit: "الإجمالى",
          ratebSalary: lodash.sumBy(values, ele => ele.ratebSalary),
          ratebSaisa: lodash.sumBy(values, ele => ele.ratebSaisa),
          soliderSalary: lodash.sumBy(values, ele => ele.soliderSalary),
          soliderSaisa: lodash.sumBy(values, ele => ele.soliderSaisa),
          index: values.length + 1,
          mortab: lodash.sumBy(values, ele => ele.mortab),
          siasa: lodash.sumBy(values, ele => ele.siasa),
          totalSoliders: lodash.sumBy(values, ele => ele.totalSoliders),
          totalRateb: lodash.sumBy(values, ele => ele.totalRateb),
          total: lodash.sumBy(values, ele => ele.total),
          officerMortab: lodash.sumBy(values, ele => ele.officerMortab),
          officerSiasa: lodash.sumBy(values, ele => ele.officerSiasa),
          officerTotal: 0
        });

        let data = values,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable),
            hasParent: true
          };
        console.log(values);
        this.$set(this.mainTable, "items", values);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
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
    }
  }
};
</script>
