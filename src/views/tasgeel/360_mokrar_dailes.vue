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
        :wordFile="'/tasgeel/360_mokrr'"
        :isExcel="true"
      >
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

<style scoped>
tbody tr td:nth-child(2) {
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
    text: "الاتجاه",
    value: "Direction",
    searchValue: "directions",
    sortable: true,
    type: "select",
    parent: " ",

    inSearch: false,
    inTable: false,
    inModel: false,
    multiple: true,
    sort: 1
  },
  {
    text: "",
    value: "type",
    searchValue: "type",
    parent: " ",
    sortable: true,
    type: "select",
    inTable: true,
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
  },
  {
    text: "الاسلحة",
    value: "weapons",
    searchValue: "weapons",
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
  }
];

export default {
  name: "_360MokrarDailes",
  props: {},
  async mounted() {
    await this.getRecuEndDateOptions();
    await this.init();
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
            text: "كاتب",
            value: "hodod.kateb",
            sortable: true,
            type: "select",
            parent: "حرس الحدود",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "hodod.saf",
            sortable: true,
            type: "select",
            parent: "حرس الحدود",
            inTable: true,
            sort: 1
          },
          {
            text: "سائق",
            value: "hodod.saeq",
            sortable: true,
            type: "select",
            parent: "حرس الحدود",
            inTable: true,
            sort: 1
          },
          {
            text: "سائق موتو",
            value: "hodod.saeq_moto",
            sortable: true,
            type: "select",
            parent: "حرس الحدود",
            inTable: true,
            sort: 1
          },
          {
            text: "جملة",
            value: "hodod.total",
            sortable: true,
            type: "select",
            parent: "حرس الحدود",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "moshah.saf",
            sortable: true,
            type: "select",
            parent: "المشاة",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "doc.saf",
            sortable: true,
            type: "select",
            parent: "خ طب",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "vet.saf",
            sortable: true,
            type: "select",
            parent: "خ بيطري",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "chem.saf",
            sortable: true,
            type: "select",
            parent: "حرب كيما",
            inTable: true,
            sort: 1
          },

          {
            text: "كاتب",
            value: "madfa3ia.kateb",
            sortable: true,
            type: "select",
            parent: "مدفعية",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "madfa3ia.saf",
            sortable: true,
            type: "select",
            parent: "مدفعية",
            inTable: true,
            sort: 1
          },
          {
            text: "سائق",
            value: "madfa3ia.saeq",
            sortable: true,
            type: "select",
            parent: "مدفعية",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "madfa3ia.mehany",
            sortable: true,
            type: "select",
            parent: "مدفعية",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "nozom.saf",
            sortable: true,
            type: "select",
            parent: "أ.نظم",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "nozom.mehany",
            sortable: true,
            type: "select",
            parent: "أ.نظم",
            inTable: true,
            sort: 1
          },

          {
            text: "كاتب",
            value: "sh2on.kateb",
            sortable: true,
            type: "select",
            parent: "شئون معنوية",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "sh2on.saf",
            sortable: true,
            type: "select",
            parent: "شئون معنوية",
            inTable: true,
            sort: 1
          },

          {
            text: "حرفى",
            value: "ash8al.herafy",
            sortable: true,
            type: "select",
            parent: "ادارة الاشغال",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "ash8al.mehany",
            sortable: true,
            type: "select",
            parent: "ادارة الاشغال",
            inTable: true,
            sort: 1
          },

          {
            text: "كاتب",
            value: "markbat.kateb",
            sortable: true,
            type: "select",
            parent: "ادارة المركبات",
            inTable: true,
            sort: 1
          },
          {
            text: "سائق",
            value: "markbat.saeq",
            sortable: true,
            type: "select",
            parent: "ادارة المركبات",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "markbat.saf",
            sortable: true,
            type: "select",
            parent: "ادارة المركبات",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "markbat.mehany",
            sortable: true,
            type: "select",
            parent: "ادارة المركبات",
            inTable: true,
            sort: 1
          },
          {
            text: "حرفى",
            value: "markbat.herafy",
            sortable: true,
            type: "select",
            parent: "ادارة المركبات",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "eshara.saf",
            sortable: true,
            type: "select",
            parent: "الاشارة",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "eshara.mehany",
            sortable: true,
            type: "select",
            parent: "الاشارة",
            inTable: true,
            sort: 1
          },

          {
            text: "مهنى",
            value: "ad.mehany",
            sortable: true,
            type: "select",
            parent: "أد",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "mesa7a.saf",
            sortable: true,
            type: "select",
            parent: "مساحة",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "mesa7a.mehany",
            sortable: true,
            type: "select",
            parent: "مساحة",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "mohmat.saf",
            sortable: true,
            type: "select",
            parent: "ادارة المهمات",
            inTable: true,
            sort: 1
          },
          {
            text: "حرفى",
            value: "mohmat.herafy",
            sortable: true,
            type: "select",
            parent: "ادارة المهمات",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "mohandsen.saf",
            sortable: true,
            type: "select",
            parent: "ادارة المهندسين",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "mohandsen.mehany",
            sortable: true,
            type: "select",
            parent: "ادارة المهندسين",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "waqod.saf",
            sortable: true,
            type: "select",
            parent: "الوقود",
            inTable: true,
            sort: 1
          },

          {
            text: "صف",
            value: "ta3ienat.saf",
            sortable: true,
            type: "select",
            parent: "التعيينات",
            inTable: true,
            sort: 1
          },
          {
            text: "حرفى",
            value: "ta3ienat.herafy",
            sortable: true,
            type: "select",
            parent: "التعيينات",
            inTable: true,
            sort: 1
          },
          {
            text: "كاتب",
            value: "ba7aria.kateb",
            sortable: true,
            type: "select",
            parent: "البحرية",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "ba7aria.saf",
            sortable: true,
            type: "select",
            parent: "البحرية",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "ba7aria.mehany",
            sortable: true,
            type: "select",
            parent: "البحرية",
            inTable: true,
            sort: 1
          },
          {
            text: "كاتب",
            value: "malia.kateb",
            sortable: true,
            type: "select",
            parent: "ش مالية",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "nakl.saf",
            sortable: true,
            type: "select",
            parent: "النقل",
            inTable: true,
            sort: 1
          },

          {
            text: "كاتب",
            value: "total.kateb",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          },
          {
            text: "صف",
            value: "total.saf",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          },
          {
            text: "سائق",
            value: "total.saeq",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          },
          {
            text: "مهنى",
            value: "total.mehany",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          },
          {
            text: "حرفى",
            value: "total.herafy",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          },
          {
            text: "جملة",
            value: "total.total",
            sortable: true,
            type: "select",
            parent: "اجمالي عام الوحدة",
            inTable: true,
            sort: 1
          }
        ]
      ],
      items: [],
      printer: {}
    },

    componentName: "_30MokrarDailes",
    selects: {
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      directions: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      SoldierCategories: {
        text: "text",
        value: "text",
        data: constants.dailesSoliderCategories.map(text => ({
          text
        }))
      },
      weapons: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
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
      this.search = {
        SoldierCategories: this.search.SoldierCategories,
        weapons: this.search.weapons,
        Type: newValue
      };
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

      if (newValue == displayTypes.unites)
        this.mainTable.headers[unitFeildIndex].inSearch = true;

      if (newValue == displayTypes.directions)
        this.mainTable.headers[directionFeildIndex].inSearch = true;
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
    async findItems() {
      if (!this.search.RecuEndDate) {
        return this.showError("يرجى إختيار تاريخ تسريح اولا");
      }
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
          // console.log(        mortabs.data.filter(el => el.WeaponID === 52 && el.Category.includes('صف'))
          // );
          items.push({
            ...Unit,
            type: "مرتب رع",
            hodod: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq_moto: 0,
              total: lodash.sumBy(
                mortabs.data.filter(
                  el => el.WeaponID == 52 && el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            moshah: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 10 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            doc: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 27 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            vet: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 28 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            chem: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 15 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            madfa3ia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            nozom: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            sh2on: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ash8al: {
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            markbat: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            eshara: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mesa7a: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ad: {
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 19 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mohmat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mohandsen: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            waqod: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 25 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ta3ienat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ba7aria: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            malia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 50 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            nakl: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 23 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            total: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              total: lodash.sumBy(
                mortabs.data.filter(el => el.ServiceType === "راتب عالى"),
                el => el.Moratab
              )
            }
          });

          items.push({
            ...Unit,
            type: "سياسة رع",
            hodod: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq_moto: 0,
              total: lodash.sumBy(
                mortabs.data.filter(
                  el => el.WeaponID == 52 && el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            moshah: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 10 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            doc: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 27 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            vet: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 28 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            chem: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 15 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            madfa3ia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            nozom: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            sh2on: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ash8al: {
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            markbat: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            eshara: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mesa7a: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            ad: {
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 19 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mohmat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mohandsen: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            waqod: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 25 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },

            ta3ienat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            ba7aria: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            malia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 50 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            nakl: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 23 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            total: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("كاتب") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("صف") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("سائق") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("مهنى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("حرفى") &&
                    el.ServiceType === "راتب عالى"
                ),
                el => el.Siasa
              ),
              total: lodash.sumBy(
                mortabs.data.filter(el => el.ServiceType === "راتب عالى"),
                el => el.Siasa
              )
            }
          });

          items.push({
            ...Unit,
            type: "مرتب جنود",
            hodod: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq_moto: 0,
              total: lodash.sumBy(
                mortabs.data.filter(
                  el => el.WeaponID == 52 && el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            moshah: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 10 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            doc: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 27 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            vet: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 28 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            chem: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 15 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },

            madfa3ia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            nozom: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            sh2on: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ash8al: {
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            markbat: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            eshara: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mesa7a: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ad: {
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 19 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mohmat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            mohandsen: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            waqod: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 25 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ta3ienat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ba7aria: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            malia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 50 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            nakl: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 23 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              )
            },
            total: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              total: lodash.sumBy(
                mortabs.data.filter(el => el.ServiceType !== "راتب عالى"),
                el => el.Moratab
              )
            }
          });

          items.push({
            ...Unit,
            type: "سياسة جنود",
            hodod: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 52 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq_moto: 0,
              total: lodash.sumBy(
                mortabs.data.filter(
                  el => el.WeaponID == 52 && el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            moshah: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 10 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            doc: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 27 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            vet: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 28 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            chem: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 15 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            madfa3ia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 12 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            nozom: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 40 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            sh2on: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Moratab
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 21 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Moratab
              )
            },
            ash8al: {
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 29 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            markbat: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            eshara: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 16 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mesa7a: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 20 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            ad: {
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 19 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mohmat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 26 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            mohandsen: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 14 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            waqod: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 25 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },

            ta3ienat: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 24 &&
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            ba7aria: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 49 &&
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                ele => ele.Siasa
              )
            },
            malia: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 50 &&
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            nakl: {
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.WeaponID == 23 &&
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              )
            },
            total: {
              kateb: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("كاتب") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saf: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("صف") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              saeq: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("سائق") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              mehany: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("مهنى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              herafy: lodash.sumBy(
                mortabs.data.filter(
                  el =>
                    el.Category?.includes("حرفى") &&
                    el.ServiceType !== "راتب عالى"
                ),
                el => el.Siasa
              ),
              total: lodash.sumBy(
                mortabs.data.filter(el => el.ServiceType !== "راتب عالى"),
                el => el.Siasa
              )
            }
          });

          items.push({
            ...Unit,
            type: "رع",
            hodod: {
              kateb:
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("سائق")
                ).length ?? 0,
              saeq_moto: 0,
              total: rateb.data.filter(el => el.WeaponID == 52).length ?? 0
            },
            moshah: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 10 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            doc: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 27 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            vet: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 28 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            chem: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 15 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            madfa3ia: {
              kateb:
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("سائق")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            nozom: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 40 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 40 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            sh2on: {
              kateb:
                rateb.data.filter(
                  el => el.WeaponID == 21 && el.RatebCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 21 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            ash8al: {
              herafy:
                rateb.data.filter(
                  el => el.WeaponID == 29 && el.RatebCategory?.includes("حرفى")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 29 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },

            markbat: {
              kateb:
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("سائق")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("مهنى")
                ).length ?? 0,
              herafy:
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("حرفى")
                ).length ?? 0
            },
            eshara: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 16 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 16 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            mesa7a: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 20 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 20 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            ad: {
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 19 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            mohmat: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 26 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              herafy:
                rateb.data.filter(
                  el => el.WeaponID == 26 && el.RatebCategory?.includes("حرفى")
                ).length ?? 0
            },
            mohandsen: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 14 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 14 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            waqod: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 25 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            ta3ienat: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 24 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              herafy:
                rateb.data.filter(
                  el => el.WeaponID == 24 && el.RatebCategory.includes("حرفى")
                ).length ?? 0
            },
            ba7aria: {
              kateb:
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("مهنى")
                ).length ?? 0
            },
            malia: {
              kateb:
                rateb.data.filter(
                  el => el.WeaponID == 50 && el.RatebCategory?.includes("كاتب")
                ).length ?? 0
            },
            nakl: {
              saf:
                rateb.data.filter(
                  el => el.WeaponID == 23 && el.RatebCategory?.includes("صف")
                ).length ?? 0
            },
            total: {
              kateb: rateb.data.filter(el => el.RatebCategory?.includes("كاتب"))
                .length,
              saf: rateb.data.filter(el => el.RatebCategory?.includes("صف"))
                .length,
              saeq: rateb.data.filter(el => el.RatebCategory?.includes("سائق"))
                .length,
              mehany: rateb.data.filter(el =>
                el.RatebCategory?.includes("مهنى")
              ).length,
              herafy: rateb.data.filter(el =>
                el.RatebCategory?.includes("حرفى")
              ).length,
              total: rateb.data.length
            }
          });

          items.push({
            ...Unit,
            type: "مجند",
            hodod: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 52 && el.SoldierCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 52 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 52 && el.SoldierCategory?.includes("سائق")
                ).length ?? 0,
              saeq_moto: 0,
              total: soliders.data.filter(el => el.WeaponID == 52).length ?? 0
            },
            moshah: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 10 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            doc: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 27 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            vet: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 28 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            chem: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 15 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            madfa3ia: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 12 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("سائق")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            nozom: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 40 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 40 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            sh2on: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 21 && el.SoldierCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 21 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            ash8al: {
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 29 && el.SoldierCategory?.includes("حرفى")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 29 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            markbat: {
              kateb:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              saeq:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("سائق")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("مهنى")
                ).length ?? 0,
              herafy:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("حرفى")
                ).length ?? 0
            },
            eshara: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 16 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 16 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            mesa7a: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 20 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 20 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            ad: {
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 19 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            mohmat: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 26 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 26 && el.SoldierCategory?.includes("حرفى")
                ).length ?? 0
            },
            mohandsen: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 14 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 14 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            waqod: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 25 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },

            ta3ienat: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 24 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 24 && el.SoldierCategory?.includes("حرفى")
                ).length ?? 0
            },
            ba7aria: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 49 && el.SoldierCategory?.includes("كاتب")
                ).length ?? 0,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 49 && el.SoldierCategory?.includes("صف")
                ).length ?? 0,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 49 && el.SoldierCategory?.includes("مهنى")
                ).length ?? 0
            },
            malia: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 50 && el.SoldierCategory?.includes("كاتب")
                ).length ?? 0
            },
            nakl: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 23 && el.SoldierCategory?.includes("صف")
                ).length ?? 0
            },
            total: {
              kateb: soliders.data.filter(el =>
                el.SoldierCategory?.includes("كاتب")
              ).length,
              saf: soliders.data.filter(el =>
                el.SoldierCategory?.includes("صف")
              ).length,
              saeq: soliders.data.filter(el =>
                el.SoldierCategory?.includes("سائق")
              ).length,
              mehany: soliders.data.filter(el =>
                el.SoldierCategory?.includes("مهنى")
              ).length,
              herafy: soliders.data.filter(el =>
                el.SoldierCategory?.includes("حرفى")
              ).length,
              total: soliders.data.length
            }
          });

          items.push({
            ...Unit,
            type: "جملة الموجودات",
            hodod: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 52 && el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("كاتب")
                ).length,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 52 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("صف")
                ).length,
              saeq:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 52 && el.SoldierCategory?.includes("سائق")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 52 && el.RatebCategory?.includes("سائق")
                ).length,
              saeq_moto: 0,
              total:
                soliders.data.filter(el => el.WeaponID == 52).length +
                rateb.data.filter(el => el.WeaponID == 52).length
            },
            moshah: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 10 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 10 && el.RatebCategory?.includes("صف")
                ).length
            },
            doc: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 27 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 27 && el.RatebCategory?.includes("صف")
                ).length
            },
            vet: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 28 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 28 && el.RatebCategory?.includes("صف")
                ).length
            },
            chem: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 15 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 15 && el.RatebCategory?.includes("صف")
                ).length
            },

            madfa3ia: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("كاتب")
                ).length,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 12 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("صف")
                ).length,
              saeq:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("سائق")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("سائق")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 12 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 12 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            nozom: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 40 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 40 && el.RatebCategory?.includes("صف")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 40 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 40 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            sh2on: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 21 && el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 21 && el.RatebCategory?.includes("كاتب")
                ).length,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 21 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 21 && el.RatebCategory?.includes("صف")
                ).length
            },
            ash8al: {
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 29 && el.SoldierCategory?.includes("حرفى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 29 && el.RatebCategory?.includes("حرفى")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 29 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 29 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            markbat: {
              kateb:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("كاتب")
                ).length,
              saf:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("صف")
                ).length,
              saeq:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("سائق")
                ).length +
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("سائق")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("مهنى")
                ).length,
              herafy:
                soliders.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.SoldierCategory?.includes("حرفى")
                ).length +
                rateb.data.filter(
                  el =>
                    (el.WeaponID == 18 || el.WeaponID == 66) &&
                    el.RatebCategory?.includes("حرفى")
                ).length
            },
            eshara: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 16 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 16 && el.RatebCategory?.includes("صف")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 16 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 16 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            mesa7a: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 20 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 20 && el.RatebCategory?.includes("صف")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 20 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 20 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            ad: {
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 19 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 19 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            mohmat: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 26 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 26 && el.RatebCategory?.includes("صف")
                ).length,
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 26 && el.SoldierCategory?.includes("حرفى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 26 && el.RatebCategory?.includes("حرفى")
                ).length
            },
            mohandsen: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 14 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 14 && el.RatebCategory?.includes("صف")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 14 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 14 && el.RatebCategory?.includes("مهنى")
                ).length
            },

            waqod: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 25 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 25 && el.RatebCategory?.includes("صف")
                ).length
            },

            ta3ienat: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 24 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 24 && el.RatebCategory?.includes("صف")
                ).length,
              herafy:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 24 && el.SoldierCategory?.includes("حرفى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 24 && el.RatebCategory?.includes("حرفى")
                ).length
            },
            ba7aria: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 49 && el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("كاتب")
                ).length,
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 49 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("صف")
                ).length,
              mehany:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 49 && el.SoldierCategory?.includes("مهنى")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 49 && el.RatebCategory?.includes("مهنى")
                ).length
            },
            malia: {
              kateb:
                soliders.data.filter(
                  el =>
                    el.WeaponID == 50 && el.SoldierCategory?.includes("كاتب")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 50 && el.RatebCategory?.includes("كاتب")
                ).length
            },
            nakl: {
              saf:
                soliders.data.filter(
                  el => el.WeaponID == 23 && el.SoldierCategory?.includes("صف")
                ).length +
                rateb.data.filter(
                  el => el.WeaponID == 24 && el.RatebCategory?.includes("صف")
                ).length
            },
            total: {
              kateb:
                soliders.data.filter(el => el.SoldierCategory?.includes("كاتب"))
                  .length +
                rateb.data.filter(el => el.RatebCategory?.includes("كاتب"))
                  .length,
              saf:
                soliders.data.filter(el => el.SoldierCategory?.includes("صف"))
                  .length +
                rateb.data.filter(el => el.RatebCategory?.includes("صف"))
                  .length,
              saeq:
                soliders.data.filter(el => el.SoldierCategory?.includes("سائق"))
                  .length +
                rateb.data.filter(el => el.RatebCategory?.includes("سائق"))
                  .length,
              mehany:
                soliders.data.filter(el => el.SoldierCategory?.includes("مهنى"))
                  .length +
                rateb.data.filter(el => el.RatebCategory?.includes("مهنى"))
                  .length,
              herafy:
                soliders.data.filter(el => el.SoldierCategory?.includes("حرفى"))
                  .length +
                rateb.data.filter(el => el.RatebCategory?.includes("حرفى"))
                  .length,
              total: soliders.data.length + rateb.data.length
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
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
      }
      // this.$set(this, "searchLoading", true);
      // this.$set(this.mainTable, "items", []);
      //
      // try {
      //   const result = await this.api(
      //     "sections/tasgeel/reports/360_mokrar_dailes",
      //     {
      //       ...this.search
      //     }
      //   );
      //   const avaibleTypes = await this.api("global/queryRunners", {
      //     query: `
      //     SELECT  Weapon ,  Feaa_Code , COUNT(*)  from SMGeneral s group by Weapon ,  Feaa_Code
      //     `
      //   });
      //   // this.buildHeaders(avaibleTypes.data);
      //
      //   this.$set(this.mainTable, "items", result.data);
      //   this.$set(this.mainTable, "printer", {
      //     data: this.mainTable.items,
      //     excelKey: "data",
      //     excelHeaders: this.mainTable.headers.filter(f => f.inTable),
      //     hasParent: true
      //   });
      // } catch (e) {
      //   console.log(e);
      //   this.showError(
      //     " حدث خطأ أثناء احضار البيانات من قاعدة البيانات الرجاء اختيار السلاح "
      //   );
      // }

      this.$set(this, "searchLoading", false);
    },

    buildHeaders(avaibleTypes) {
      const categories = SoldierCategoryMap.filter(
        ele => this.search.SoldierCategories.indexOf(ele.text) > -1
      );

      let headers = [];
      this.search.weapons
        .filter(ele => ele !== "")
        .forEach(weapon => {
          headers = [
            ...headers,
            ...[
              ...categories.map(category => ({
                text: category.text,
                value: `${weapon}.${category.mappedValue}`,
                sortable: true,
                parent: weapon,
                type: "select",
                inTable: true,
                sort: 1
              }))
            ]
          ]
            .filter(ele => ele)
            .map(ele => ({
              text: ele.text,
              value: ele.value,
              sortable: true,
              type: "select",
              parent: ele.parent,
              inTable: true,
              sort: 1
            }));
        });
      this.$set(this.mainTable, "headers", [
        ...basicHeaders,
        ...headers.filter(ele =>
          avaibleTypes.find(type => {
            return (
              type.Weapon == ele.parent && type.Feaa_Code?.includes(ele.text)
            );
          })
        ),
        ...categories.map(category => ({
          text: `${category.text}`,
          value: `totals.${category.mappedValue}`,
          parent: "اجمالي",
          sortable: true,
          inTable: true,
          sort: 1
        })),
        {
          text: `الجملة`,
          value: `totals.total`,
          sortable: true,
          parent: " ",
          inTable: true,
          sort: 1
        }
      ]);
    }
  }
};
</script>
