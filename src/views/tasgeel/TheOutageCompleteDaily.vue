<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :search="search"
      @on-add="actionAdd()"
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
        :isExcel="true"
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
    text: "الوحدة",
    value: "unit",
    searchValue: "UnitID",
    sortable: true,
    type: "select",
    inSearch: true,
    parent: " ",
    inTable: true,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "تاريخ التسريح",
    value: "RecuEndDate",
    parent: " ",
    searchValue: "RecuEndDate",
    type: "select",
    inSearch: true,
    sort: 1,
    multiple: true
  }
];
export default {
  name: "TheOutageCompleteDaily",
  props: {},
  async mounted() {
    await this.init();
    this.selects.RecuEndDate.data = await this.fetchAvailableServiceEndDates();
  },
  data: () => ({
    Effect: {},
    subjectLimit: 10,

    search: {
      SoldierCategories: constants.dailesSoliderCategories
    },
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "المرتب",
            value: "mortab",
            inTable: true,
            inSearch: false
          },
          {
            text: "السياسة",
            value: "siasa",
            inTable: true,
            inSearch: false
          },
          {
            text: "الموجود",
            value: "mawgod",
            inTable: true,
            inSearch: false
          },
          {
            text: "دفعة التسريح المختارة",
            value: "mosr7en",
            sortable: true,
            inTable: true,
            inSearch: false,
            sort: 1
          },
          {
            text: "الموجود بعد التسريح",
            value: "mawgodAfter",
            inTable: true,
            inSearch: false
          },
          {
            text: "مطلوب للاستكمال",
            value: "matlobAfter",
            inTable: true,
            inSearch: false
          },
          {
            text: "الموجود بعد للاستكمال",
            value: "mawgodAfterEstkmal",
            inTable: true,
            inSearch: false
          },
          {
            text: " النسبة المجند / المرتب بعد الاستكمال",
            value: "precOnMortab",
            inTable: true,
            inSearch: false
          },
          {
            text: " النسبة المجند / السياسة بعد الاستكمال",
            value: "precOnSiasa",
            inTable: true,
            inSearch: false
          },
          {
            text: "الشريحة",
            value: "SupplyLayer",
            searchValue: "SupplyLayer",
            multiple: false,
            sortable: true,
            type: "select",
            inSearch: true,
            inTable: false,
            inModel: false,
            parent: "",
            sort: 1
          },
          {
            text: "جهة الإمداد",
            value: "Weapon.Weapon",
            searchValue: "WeaponID",
            multiple: false,
            sortable: true,
            type: "select",
            inSearch: true,
            inTable: false,
            inModel: false,
            parent: "",
            sort: 1
          },
          {
            text: "الفئه",
            value: "Category",
            searchValue: "Category",
            multiple: true,
            type: "select",
            sortable: true,
            inTable: false,
            inSearch: true,
            parent: "",
            inModel: true
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "_30MokrarDailes",
    selects: {
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      directions: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      collections: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      weapon: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
      },
      job: {
        table: "Duty",
        value: "Duty",
        text: "Duty"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي امداد 1/1 - 7/1 تسريح 4/1 - 10/1",
            value: "1"
          },
          {
            text: "الشريحة الثانية امداد 4/1 - 10/1 تسريح 1/1 - 7/1",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          },
          {
            text: "مجموع الشريحتين",
            value: null
          }
        ]
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
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
          },
          {
            text: "لشريحة محددة",
            value: displayTypes.supplies
          }
        ]
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        weapon: this.search.weapon,
        RecuEndDate: this.search.RecuEndDate,
        Type: newValue
      };

      const unitFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Unit"
      );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      const suppliesFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "SupplyLayer"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      this.mainTable.headers[suppliesFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
      }
      if (newValue == displayTypes.supplies) {
        this.mainTable.headers[suppliesFeildIndex].inSearch = true;
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
      if (!this.search.RecuEndDate) {
        this.showError("يرجى إختيار تاريخ تسريح أولا");
        return;
      }
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      console.log(this.search);
      const units = await this.api("sections/tasgeel/reports/getUnits", {
        ...this.search
      });
      let items = [];
      try {
        const solidersRecuEnd = await this.api("global/get_all", {
          table: "Soldier",
          include: [{ model: "Weapon" }],
          where: this.cleanObject({
            WeaponID: this.search.WeaponID,
            SoldierCategory: this.search.Category,
            UnitID: this.search.UnitID ? { $in: this.search.UnitID } : null,
            Status: `بالخدمة`,
            RecuEndDate: { $in: this.search.RecuEndDate }
          })
        });
        const soliders = await this.api("global/get_all", {
          table: "Soldier",
          include: [{ model: "Weapon" }],
          where: this.cleanObject({
            SoldierCategory: this.search.Category,
            WeaponID: this.search.WeaponID,
            UnitID: this.search.UnitID ? { $in: this.search.UnitID } : null,
            Status: `بالخدمة`
          })
        });

        const mortabs = await this.api("global/get_all", {
          table: "MortabatDuties",
          include: [{ model: "Weapon" }],
          where: this.cleanObject({
            WeaponID: this.search.WeaponID,
            Category: this.search.Category,
            ServiceType: { $in: [`مجند`, "رع / مجند"] },
            UnitID: this.search.UnitID ? { $in: this.search.UnitID } : null
          })
        });
        const units = await this.api("global/get_all", {
          table: "Unit",
          where: this.cleanObject({
            statue: `بالخدمة`,
            UnitID: this.search.UnitID ? { $in: this.search.UnitID } : null
          })
        });
        let dateBeforeMonth = new Date(this.search.RecuEndDate);
        let dateAftertwoMonth = new Date(this.search.RecuEndDate);
        dateBeforeMonth.setMonth(dateBeforeMonth.getMonth() - 1);
        dateAftertwoMonth.setMonth(dateAftertwoMonth.getMonth() + 2);
        console.log("solidersRecuEnd", solidersRecuEnd);
        console.log("soliders", soliders);
        console.log("mortabs", mortabs);
        console.log("units", units);
        items = units.data.map(ele => {
          let mosr7en = solidersRecuEnd.data.filter(
            el => el.UnitID == ele.UnitID
          ).length;
          let mawgodAfter =
            soliders.data.filter(el => el.UnitID == ele.UnitID).length -
            solidersRecuEnd.data.filter(el => el.UnitID == ele.UnitID).length;
          let matlobAfter = Math.max(
            Math.max(
              lodash.sumBy(
                mortabs.data.filter(el => el.UnitID == ele.UnitID),
                el => el.Moratab
              ),
              lodash.sumBy(
                mortabs.data.filter(el => el.UnitID == ele.UnitID),
                el => el.Siasa
              )
            ) -
              (soliders.data.filter(el => el.UnitID == ele.UnitID).length -
                solidersRecuEnd.data.filter(el => el.UnitID == ele.UnitID)
                  .length),
            0
          );
          let mawgodAfterEstkmal =
            matlobAfter +
            (soliders.data.filter(el => el.UnitID == ele.UnitID).length -
              solidersRecuEnd.data.filter(el => el.UnitID == ele.UnitID)
                .length);
          return {
            ...ele,
            unit: ele.Unit,
            mortab: lodash.sumBy(
              mortabs.data.filter(el => el.UnitID == ele.UnitID),
              el => el.Moratab
            ),
            siasa: lodash.sumBy(
              mortabs.data.filter(el => el.UnitID == ele.UnitID),
              el => el.Siasa
            ),
            mawgod: soliders.data.filter(el => el.UnitID == ele.UnitID).length,
            mawgodAfterEstkmal,
            mosr7en,
            matlobAfter,
            mawgodAfter,
            precOnSiasa:
              Math.round(
                (mawgodAfterEstkmal /
                  lodash.sumBy(
                    mortabs.data.filter(el => el.UnitID == ele.UnitID),
                    el => el.Siasa
                  )) *
                  100
              ) + "%",
            precOnMortab:
              Math.round(
                (mawgodAfterEstkmal /
                  lodash.sumBy(
                    mortabs.data.filter(el => el.UnitID == ele.UnitID),
                    el => el.Moratab
                  )) *
                  100
              ) + "%"
          };
        });
        console.log(items);
        items.push({
          unit: "الاجمالي",
          mortab: lodash.sumBy(items, el => el.mortab),
          siasa: lodash.sumBy(items, el => el.siasa),
          mawgod: lodash.sumBy(items, el => el.mawgod),
          mosr7en: lodash.sumBy(items, el => el.mosr7en),
          mawgodAfter: lodash.sumBy(items, el => el.mawgodAfter),
          matlobAfter: lodash.sumBy(items, el => el.matlobAfter),
          mawgodAfterEstkmal: lodash.sumBy(items, el => el.mawgodAfterEstkmal)
        });

        items = items.filter(
          ele =>
            !ele.unit?.includes("ملغاه") &&
            !ele.unit?.includes("-") &&
            !ele.unit?.includes("بدون")
        );
        items = this.search.SupplyLayer
          ? items.filter(ele =>
              ele.SupplyLayer?.includes(this.search?.SupplyLayer)
            )
          : items;
        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });

        this.$set(this, "searchLoading", false);
      } catch (e) {
        this.handleError(e);
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
