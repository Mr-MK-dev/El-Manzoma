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
        :wordFile="'/tasgeel/daily_360'"
        :isExcel="true"
      >
        <template v-slot:header="{ props }">
          <thead class="v-data-table-header">
            <tr>
              <th
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.parent + item.text.length"
                colspan="1"
                class="text-center parent-header"
              >
                {{ item.parent }}
              </th>
            </tr>
            <tr>
              <th
                v-for="item in mainTable.headers.filter(ele => ele.inTable)"
                :key="item.text + item.text.length * 3"
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

<style scoped>
tbody tr td:nth-child(1) {
  width: 295px;
  display: block;
}
</style>

<script>
const constants = require("../../Constant").default;
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;
const lodash = require("lodash");

const displayTypes = types.displayTypes;

const SoldierCategoryMap = types.SoldierCategoryMap;

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
  {
    text: "الاتجاه",
    value: "DirectionforFeaat",
    sortable: true,
    inTable: true,
    multiple: true,
    sort: 1
  },

  {
    text: "الاتجاه",
    value: "Direction",
    searchValue: "directions",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
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
    text: "النوع",
    value: "listType",
    searchValue: "listType",
    sortable: true,
    type: "text",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: false,
    sort: 1
  },
  {
    text: "الفئات",
    value: "SoldierCategories",
    searchValue: "SoldierCategories",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  }
];
export default {
  name: "_360NormaDailes",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    allUnites: [],

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
            text: "مساعد",
            value: "saf.mosad",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب اول",
            value: "saf.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "saf.rakeb",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "saf.aref",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف مجند",
            value: "saf.aref_gondy",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "saf.gondy",
            sortable: true,
            type: "select",
            parent: "صف",
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "kateb.mosad",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب اول",
            value: "kateb.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "kateb.rakeb",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "kateb.aref",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف مجند",
            value: "kateb.aref_gondy",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "kateb.gondy",
            sortable: true,
            type: "select",
            parent: "كاتب",
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "mehany.mosad",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب اول",
            value: "mehany.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "mehany.rakeb",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "mehany.aref",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف مجند",
            value: "mehany.aref_gondy",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "mehany.gondy",
            sortable: true,
            type: "select",
            parent: "مهنى",
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "herafy.mosad",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب اول",
            value: "herafy.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "herafy.rakeb",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "herafy.aref",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف مجند",
            value: "herafy.aref_gondy",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "herafy.gondy",
            sortable: true,
            type: "select",
            parent: "حرفى",
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "saeq.mosad",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب اول",
            value: "saeq.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "saeq.rakeb",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "saeq.aref",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف مجند",
            value: "saeq.aref_gondy",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "جندي",
            value: "saeq.gondy",
            sortable: true,
            type: "select",
            parent: "سائق عجل",
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "total.mosad",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: " رقيب اول",
            value: "total.rakeb_awl",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "total.rakeb",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: " عريف ",
            value: "total.aref",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: " عريف مجند",
            value: "total.aref_gondy",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          },
          {
            text: " جندي",
            value: "total.gondy",
            sortable: true,
            type: "select",
            parent: "اجمالي",
            inTable: true,
            sort: 1
          }
        ]
      ],
      items: [],
      printer: {}
    },
    componentName: "_360NormaDailes",
    selects: {
      directions: {
        text: "Name",
        value: "Name",
        table: "Sectors"
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
      Weapon: {
        table: "Weapon",
        text: "Weapon",
        value: "Weapon"
      }
    }
  }),
  watch: {
    "search.Type"(newValue) {
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        Type: newValue
      };
      // this.selects.unitIds.data = this.allUnites;

      const unitFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Unit"
        ),
        directionFeildIndex = this.mainTable.headers.findIndex(
          ele => ele.value == "Direction"
        );

      const collectionFeildIndex = this.mainTable.headers.findIndex(
        ele => ele.value == "Collection"
      );
      this.mainTable.headers[unitFeildIndex].inSearch = false;
      this.mainTable.headers[directionFeildIndex].inSearch = false;
      this.mainTable.headers[collectionFeildIndex].inSearch = false;
      // display right condations
      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.directions)
        this.mainTable.headers[directionFeildIndex].inSearch = true;

      if (newValue == displayTypes.headquertsWithUnits) {
        this.mainTable.headers[directionFeildIndex].inSearch = true;
      }
      if (newValue == displayTypes.collections) {
        this.mainTable.headers[collectionFeildIndex].inSearch = true;
      }
    },
    "search.directions"(newValue) {
      if (this.search.Type == displayTypes.headquertsWithUnits) {
        // this.selects.unitIds.data = this.allUnites.filter(
        //     ele => newValue.indexOf(ele.Directionforunit) > -1
        // );
        this.search.unitIds = this.selects.unitIds.data.map(ele => ele.UnitID);
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
      try {
        let items = [];
        for (const Unit of units.data) {
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
          const mortabs = await this.api("global/get_all", {
            table: "MortabatDuties",
            where: {
              UnitID: Unit.UnitID
            }
          });
          // const [ratebObj, soliderObj, totalObj] = this.buildUnitItem(
          //     unit,
          //     mortabs,
          //     rateb,
          //     soliders
          // );
          // items = [...items, ...[ratebObj, soliderObj, totalObj]];

          // let mortab = {
          //
          //
          // };
          // let actual = {
          //
          // };

          items.push({
            ...Unit,
            listType: "الميزانية",
            saf: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "مساعد" ||
                      el.Level?.includes("صانع ممتاز")) &&
                    el.Category?.includes("صف")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب أول" ||
                      el.Level?.includes("صانع دقيق")) &&
                    el.Category?.includes("صف")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب" || el.Level?.includes("صانع ماهر")) &&
                    el.Category?.includes("صف")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("صف") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("صف") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level?.includes("جندي") && el.Category?.includes("صف")
                ),
                el => el.Moratab
              )
            },
            kateb: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "مساعد" ||
                      el.Level?.includes("صانع ممتاز")) &&
                    el.Category?.includes("كاتب")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب أول" ||
                      el.Level?.includes("صانع دقيق")) &&
                    el.Category?.includes("كاتب")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب" || el.Level?.includes("صانع ماهر")) &&
                    el.Category?.includes("كاتب")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("كاتب") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level?.includes("جندي") && el.Category?.includes("كاتب")
                ),
                el => el.Moratab
              )
            },
            mehany: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "مساعد" ||
                      el.Level?.includes("صانع ممتاز")) &&
                    el.Category?.includes("مهنى")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب أول" ||
                      el.Level?.includes("صانع دقيق")) &&
                    el.Category?.includes("مهنى")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب" || el.Level?.includes("صانع ماهر")) &&
                    el.Category?.includes("مهنى")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("مهنى") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level?.includes("جندي") && el.Category?.includes("مهنى")
                ),
                el => el.Moratab
              )
            },
            herafy: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "مساعد" ||
                      el.Level?.includes("صانع ممتاز")) &&
                    el.Category?.includes("حرفى")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب أول" ||
                      el.Level?.includes("صانع دقيق")) &&
                    el.Category?.includes("حرفى")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب" || el.Level?.includes("صانع ماهر")) &&
                    el.Category?.includes("حرفى")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("حرفى") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level?.includes("جندي") && el.Category?.includes("حرفى")
                ),
                el => el.Moratab
              )
            },
            saeq: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "مساعد" ||
                      el.Level?.includes("صانع ممتاز")) &&
                    el.Category?.includes("سائق")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب أول" ||
                      el.Level?.includes("صانع دقيق")) &&
                    el.Category?.includes("سائق")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level === "رقيب" || el.Level?.includes("صانع ماهر")) &&
                    el.Category?.includes("سائق")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.Category?.includes("سائق") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level?.includes("جندي") && el.Category?.includes("سائق")
                ),
                el => el.Moratab
              )
            },
            total: {
              mosad: lodash.sumBy(
                mortabs.data.filter(
                  el => el.Level === "مساعد" || el.Level?.includes("صانع ماهر")
                ),
                el => el.Moratab
              ),
              rakeb_awl: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Level === "رقيب أول" || el.Level?.includes("صانع دقيق")
                ),
                el => el.Moratab
              ),
              rakeb: lodash.sumBy(
                mortabs.data.filter(
                  el => el.Level === "رقيب" || el.Level?.includes("صانع ماهر")
                ),
                el => el.Moratab
              ),
              aref: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              aref_gondy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.Level?.includes("عريف") || el.Level == "صانع") &&
                    !el.ServiceType?.includes("راتب عالى")
                ),
                el => el.Moratab
              ),
              gondy: lodash.sumBy(
                mortabs.data.filter(el => el.Level?.includes("جندي")),
                el => el.Moratab
              )
            }
          });
          items.push({
            ...Unit,
            listType: "الموجود",

            saf: {
              mosad: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("مساعد") ||
                    el.RatebLevel?.includes("صانع ممتاز")) &&
                  el.RatebCategory?.includes("صف")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب أول" ||
                    el.RatebLevel === "رقيب اول" ||
                    el.RatebLevel?.includes("صانع دقيق")) &&
                  el.RatebCategory?.includes("صف")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب" ||
                    el.RatebLevel?.includes("صانع ماهر")) &&
                  el.RatebCategory?.includes("صف")
              ).length,
              aref: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("عريف") ||
                    el.RatebLevel == "صانع") &&
                  el.RatebCategory?.includes("صف")
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  (el.SoldierLevel?.includes("عريف") ||
                    el.SoldierLevel == "صانع") &&
                  el.SoldierCategory?.includes("صف")
              ).length,
              gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("جندي") &&
                  el.SoldierCategory?.includes("صف")
              ).length
            },
            kateb: {
              mosad: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("مساعد") ||
                    el.RatebLevel?.includes("صانع ممتاز")) &&
                  el.RatebCategory?.includes("كاتب")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب أول" ||
                    el.RatebLevel === "رقيب اول" ||
                    el.RatebLevel?.includes("صانع دقيق")) &&
                  el.RatebCategory?.includes("كاتب")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب" ||
                    el.RatebLevel?.includes("صانع ماهر")) &&
                  el.RatebCategory?.includes("كاتب")
              ).length,
              aref: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("عريف") ||
                    el.RatebLevel == "صانع") &&
                  el.RatebCategory?.includes("كاتب")
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  (el.SoldierLevel?.includes("عريف") ||
                    el.SoldierLevel == "صانع") &&
                  el.SoldierCategory?.includes("كاتب")
              ).length,
              gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("جندي") &&
                  el.SoldierCategory?.includes("كاتب")
              ).length
            },
            mehany: {
              mosad: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("مساعد") ||
                    el.RatebLevel?.includes("صانع ممتاز")) &&
                  el.RatebCategory?.includes("مهنى")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب أول" ||
                    el.RatebLevel === "رقيب اول" ||
                    el.RatebLevel?.includes("صانع دقيق")) &&
                  el.RatebCategory?.includes("مهنى")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب" ||
                    el.RatebLevel?.includes("صانع ماهر")) &&
                  el.RatebCategory?.includes("مهنى")
              ).length,
              aref: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("عريف") ||
                    el.RatebLevel == "صانع") &&
                  el.RatebCategory?.includes("مهنى")
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  (el.SoldierLevel?.includes("عريف") ||
                    el.SoldierLevel == "صانع") &&
                  el.SoldierCategory?.includes("مهنى")
              ).length,
              gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("جندي") &&
                  el.SoldierCategory?.includes("مهنى")
              ).length
            },
            herafy: {
              mosad: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("مساعد") ||
                    el.RatebLevel?.includes("صانع ممتاز")) &&
                  el.RatebCategory?.includes("حرفى")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب أول" ||
                    el.RatebLevel === "رقيب اول" ||
                    el.RatebLevel?.includes("صانع دقيق")) &&
                  el.RatebCategory?.includes("حرفى")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب" ||
                    el.RatebLevel?.includes("صانع ماهر")) &&
                  el.RatebCategory?.includes("حرفى")
              ).length,
              aref: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("عريف") ||
                    el.RatebLevel == "صانع") &&
                  el.RatebCategory?.includes("حرفى")
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  (el.SoldierLevel?.includes("عريف") ||
                    el.SoldierLevel == "صانع") &&
                  el.SoldierCategory?.includes("حرفى")
              ).length,
              gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("جندي") &&
                  el.SoldierCategory?.includes("حرفى")
              ).length
            },
            saeq: {
              mosad: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("مساعد") ||
                    el.RatebLevel?.includes("صانع ممتاز")) &&
                  el.RatebCategory?.includes("سائق")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب أول" ||
                    el.RatebLevel === "رقيب اول" ||
                    el.RatebLevel?.includes("صانع دقيق")) &&
                  el.RatebCategory?.includes("سائق")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  (el.RatebLevel === "رقيب" ||
                    el.RatebLevel?.includes("صانع ماهر")) &&
                  el.RatebCategory?.includes("سائق")
              ).length,
              aref: rateb.data.filter(
                el =>
                  (el.RatebLevel?.includes("عريف") ||
                    el.RatebLevel == "صانع") &&
                  el.RatebCategory?.includes("سائق")
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  (el.SoldierLevel?.includes("عريف") ||
                    el.SoldierLevel == "صانع") &&
                  el.SoldierCategory?.includes("سائق")
              ).length,
              gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("جندي") &&
                  el.SoldierCategory?.includes("سائق")
              ).length
            },
            total: {
              mosad: rateb.data.filter(
                el =>
                  el.RatebLevel?.includes("مساعد") ||
                  el.RatebLevel?.includes("صانع ممتاز")
              ).length,
              rakeb_awl: rateb.data.filter(
                el =>
                  el.RatebLevel === "رقيب أول" ||
                  el.RatebLevel === "رقيب اول" ||
                  el.RatebLevel?.includes("صانع دقيق")
              ).length,
              rakeb: rateb.data.filter(
                el =>
                  el.RatebLevel === "رقيب" ||
                  el.RatebLevel?.includes("صانع ماهر")
              ).length,
              aref: rateb.data.filter(
                el => el.RatebLevel?.includes("عريف") || el.RatebLevel == "صانع"
              ).length,
              aref_gondy: soliders.data.filter(
                el =>
                  el.SoldierLevel?.includes("عريف") || el.SoldierLevel == "صانع"
              ).length,
              gondy: soliders.data.filter(el =>
                el.SoldierLevel?.includes("جندي")
              ).length
            }
          });

          // console.log('mortab', mortab);
          // console.log('actual', actual);
          // console.log('finalItem', finalItem);
          // items.push(finalItem);
        }

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        });
        this.$set(this, "searchLoading", false);

        console.log("here I log", items);
      } catch (e) {
        this.handleError(e);
        this.$set(this, "searchLoading", false);
      }
      // try {
      //   const result = await this.api(
      //     "sections/tasgeel/reports/360_normal_dailes",
      //     {
      //       ...this.search
      //     }
      //   );
      //   this.$set(this.mainTable, "items", result.data);
      //   this.$set(this.mainTable, "printer", {
      //     data: this.mainTable.items,
      //     excelKey: "data",
      //     excelHeaders: this.mainTable.headers.filter(f => f.inTable),
      //     hasParent: true
      //   });
      // } catch (e) {
      //   this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      // }
      this.$set(this, "searchLoading", false);
    }
  }
};
</script>
