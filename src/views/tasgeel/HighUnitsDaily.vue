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
        :isExcel="true"
      >
        <template v-slot:item.percentMoratb="{ item }">
          <v-chip color="transparent">
            {{ item.percentMoratb }}
          </v-chip>
        </template>
        <template v-slot:item.percentSiasa="{ item }">
          <v-chip color="transparent">
            {{ item.percentSiasa}}
          </v-chip>
        </template>
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr>
              <th
                v-for="(item, i) in mainTable.headers.filter(
                  ele => ele.inTable
                )"
                :key="item.parent + i"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.parent }}
              </th>
            </tr>
            <tr>
              <th
                v-for="(item, i) in mainTable.headers.filter(
                  ele => ele.inTable
                )"
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
  }
];
export default {
  name: "HighUnitsDaily",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    subjectLimit: 10,
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "مرتب الحرب",
            value: "moratb",
            inTable: true,
            inSearch: false
          },
          {
            text: "مرتب السلم",
            value: "siasa",
            inTable: true,
            inSearch: false
          },
          {
            text: "عدد النقاط",
            value: "points",
            inTable: true,
            inSearch: false
          },
          {
            text: "كاتب",
            parent: "موجود حدود",
            value: "mawgod.kateb",
            inTable: true,
            inSearch: false
          },
          {
            text: "صف",
            parent: "موجود حدود",
            value: "mawgod.saf",
            inTable: true,
            inSearch: false
          },
          {
            text: "سائق",
            parent: "موجود حدود",
            value: "mawgod.saaq",
            inTable: true,
            inSearch: false
          },
          {
            text: "اجمالي ح.ح",
            parent: "موجود حدود",
            value: "mawgod.total",
            inTable: true,
            inSearch: false
          },
          {
            text: "اجمالي الادارات",
            value: "weaponsTotal",
            inTable: true,
            inSearch: false
          },
          {
            text: "اجمالي ر.ع",
            value: "highTotal",
            inTable: true,
            inSearch: false
          },
          {
            text: "النسبة/المرتب",
            value: "percentMoratb",
            inTable: true,
            inSearch: false
          },
          {
            text: "النسبة/السياسة",
            value: "percentSiasa",
            inTable: true,
            inSearch: false
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "HighUnitsDaily",
    selects: {
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
      this.search = {
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
    async findItems() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      console.log(this.search);

      const units = await this.api("sections/tasgeel/reports/getUnits", {
        ...this.search
      });
      console.log("i'm findig");

      console.log(units);
      let items = [];
      try {
        for (const Unit of units.data) {
          const hubs = await this.api("global/get_all", {
            table: "PointHub",
            where: { Unit_ID: Unit.UnitID },
            include: [
              {
                model: "Point"
              }
            ]
          });
          let groupHubs = Object.values(
            lodash.groupBy(hubs.data, ele => ele.ID_KEY)
          ).map(ele => {
            return {
              ...ele[0],
              points: ele.map(ele => ele.Points)
            };
          });

          console.log("hubss", groupHubs);

          const rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: {
              UnitID: Unit.UnitID,
              Status: `بالخدمة`
            }
          });

          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            include: [{ model: "Weapon" }],
            where: {
              UnitID: Unit.UnitID
            }
          });

          console.log("RATEB", rateb.data);
          items.push({
            ...Unit,
            moratb: lodash.sumBy(
              mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Moratab
            ),
            siasa: lodash.sumBy(
              mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Siasa
            ),
            mawgod: {
              kateb: rateb.data.filter(ele =>
                ele.RatebCategory.includes("كاتب")
              ).length,
              saaq: rateb.data.filter(ele => ele.RatebCategory.includes("سائق"))
                .length,
              saf: rateb.data.filter(
                ele => ele.WeaponID === 52 && ele.RatebCategory.includes("صف")
              ).length,
              total:
                rateb.data.filter(ele => ele.RatebCategory.includes("كاتب"))
                  .length +
                rateb.data.filter(ele => ele.RatebCategory.includes("سائق"))
                  .length +
                rateb.data.filter(
                  ele => ele.WeaponID === 52 && ele.RatebCategory.includes("صف")
                ).length
            },
            points: lodash.sumBy(
              groupHubs,
              ele => ele.points.filter(el => !el.isHeadQuarter).length
            ),
            weaponsTotal: rateb.data.filter(
              ele =>
                ele.WeaponID != 52 &&
                !ele.RatebCategory.includes("سائق") &&
                !ele.RatebCategory.includes("كاتب")
            ).length,
            highTotal: rateb.data.length,
            percentMoratb:Math.round(rateb.data.length /
                lodash.sumBy(
                    mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
                    ele => ele.Moratab
                ) *100).toString() +"%",
            percentSiasa: Math.round(
                rateb.data.length /
                lodash.sumBy(
                    mortabs.data.filter(ele => ele.ServiceType === "راتب عالى"),
                    ele => ele.Siasa
                )*100).toString() +"%"
          });
        }
        items.push({
          Unit: "الاجمالي",
          moratb: lodash.sumBy(items, ele => ele.moratb),
          siasa: lodash.sumBy(items, ele => ele.siasa),
          mawgod: {
            kateb: lodash.sumBy(items, ele => ele.mawgod.kateb),
            saaq: lodash.sumBy(items, ele => ele.mawgod.saaq),
            saf: lodash.sumBy(items, ele => ele.mawgod.saf),
            total: lodash.sumBy(items, ele => ele.mawgod.total)
          },
          points: lodash.sumBy(items, ele => ele.points),
          weaponsTotal: lodash.sumBy(items, ele => ele.weaponsTotal),
          highTotal: lodash.sumBy(items, ele => ele.highTotal),
          percentMoratb:
            Math.round(lodash.sumBy(items, ele => ele.highTotal) /
                lodash.sumBy(items, ele => ele.moratb) *100).toString() +"%",
          percentSiasa:Math.round(
              lodash.sumBy(items, ele => ele.highTotal) /
              lodash.sumBy(items, ele => ele.siasa) *100 ).toString() +'%'
        });

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
