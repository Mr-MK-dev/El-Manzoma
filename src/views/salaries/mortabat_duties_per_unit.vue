<template>
  <div>
    <search-bulider
      v-if="!parentFilters"
      :fields="mainTable.headers"
      :selects="selects"
      :search="search"
      :searchLoading="searchLoading"
      @on-search="findItems"
      @on-add="actionAdd()"
      :addButton="false"
      :clearOption="true"
      title="بحث متقدم في مرتبات الوظائف للوحدة"
      addBtnTitle="إضافة مرتب وظيفة للوحده "
    />

    <v-card>
      <v-progress-circular
        v-if="searchLoading"
        indeterminate
        color="success"
      ></v-progress-circular>
      <v-card-title>
        <v-btn color="praimary" @click="openUnitsStats()">
          بيان عددي بمرتبات بالوحدات
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="hasEditAccess() && parentFilters"
          @click="actionAdd()"
          large
          outlined
          color="primary"
        >
          إضافة وظيفة
        </v-btn>
      </v-card-title>
    </v-card>

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col :key="n" cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي الوظائف : {{ totals.Jobs }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي المرتب : {{ totals.Moratab }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي السياسة : {{ totals.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col :key="n" cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي الوظائف ضباط : {{ totals_officers.Jobs }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي المرتب ضباط: {{ totals_officers.Moratab }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي السياسة ضباط: {{ totals_officers.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col :key="n" cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي الوظائف راتب عالي : {{ totals_high.Jobs }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي المرتب راتب عالي: {{ totals_high.Moratab }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي السياسة راتب عالي: {{ totals_high.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col :key="n" cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي الوظائف مجند : {{ totals_soldiers.Jobs }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي المرتب مجند: {{ totals_soldiers.Moratab }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي السياسة مجند: {{ totals_soldiers.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col :key="n" cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي الوظائف رع / مجند : {{ totals_mix.Jobs }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي المرتب رع / مجند: {{ totals_mix.Moratab }}
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="pa-2" outlined tile>
            اجمالي السياسة رع / مجند: {{ totals_mix.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <table-bulider
      :headers="subTable.headers"
      :items="subTable.items"
      :printer="mainTable.printer"
      :wordFile="'/salaries/unit_card'"
      :title="'اجمالي المرتب'"
    ></table-bulider>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :wordFile="'/salaries/new_unit_jobs_daily'"
      :title="''"
    >
      <template
        v-if="parentFilters && (isAdmin() || hasEditAccess())"
        v-slot:item.actionsStart="{ item }"
      >
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.SoldiersCompletenessPercentage="{ item }">
        <v-chip color="transparent">
          {{ item.Unit.SoldiersCompletenessPercentage }}%
        </v-chip>
      </template>
      <template v-slot:item.RatebsCompletenessPercentage="{ item }">
        <v-chip color="transparent">
          {{ item.Unit.SoldiersCompletenessPercentage }}%
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog
      persistent
      v-model="UnitsStats.isDisplayed"
      scrollable
      max-width="750"
    >
      <v-card>
        <v-btn @click="UnitsStats.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <table-bulider
          :headers="UnitsStats.headers"
          :printer="UnitsStats.printer"
          :hasSort="true"
          :items="UnitsStats.items"
          :title="'المرتبات'"
        >
          <template v-slot:item.SoldiersCompletenessPercentage="{ item }">
            <v-chip color="transparent">
              {{ item.SoldiersCompletenessPercentage }}%
            </v-chip>
          </template>
          <template v-slot:item.RatebsCompletenessPercentage="{ item }">
            <v-chip color="transparent">
              {{ item.RatebsCompletenessPercentage }}%
            </v-chip>
          </template>
        </table-bulider>
        <v-progress-circular
          v-if="searchLoading"
          indeterminate
          color="success"
        ></v-progress-circular>
      </v-card>
    </v-dialog>

    <editor-dialog-bulider
      :title="'إضافة مرتب وظيفه'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="moratabat"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "mortabatDuties",
  props: {
    parentFilters: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    moratabat: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: false,
          readOnly: false,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          parent: "",

          sort: 1
        },
        {
          text: "جهة الإمداد",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          multiple: true,
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          parent: "",

          sort: 1
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          multiple: true,
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",

          inModel: false
        },
        {
          text: "الفئه",
          value: "Category",
          searchValue: "Category",
          multiple: true,
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },
        {
          text: "الدرجة",
          value: "Level",
          multiple: true,
          searchValue: "Level",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },
        {
          text: "وظيفة الضابط",
          value: "OfficerDuty.OfficerDuty",
          searchValue: "OfficerDutyID",
          multiple: true,
          type: "select",
          sortable: true,
          inTable: false,
          inSearch: false,
          parent: "",

          inModel: false
        },
        {
          text: "فئة الضابط",
          value: "OfficerCategory",
          searchValue: "OfficerCategory",
          multiple: true,
          type: "select",
          sortable: true,
          inTable: false,
          inSearch: false,
          parent: "",
          inModel: false
        },
        {
          text: "درجة الضابط",
          value: "OfficerLevel",
          multiple: true,
          searchValue: "OfficerLevel",
          type: "select",
          sortable: true,
          inTable: false,
          inSearch: false,
          parent: "",
          inModel: false
        },
        {
          text: "نوع الخدمه",
          value: "ServiceType",
          multiple: true,
          searchValue: "ServiceType",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",

          inModel: true
        },
        {
          text: "مرتب الحرب",
          value: "Moratab",
          searchValue: "Moratab",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "مرتب السلم",
          value: "Siasa",
          searchValue: "Siasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: []
    },
    subTable: {
      items: [],
      headers: [
        {
          text: "",
          value: "type",
          searchValue: "type",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "",
          value: "subType",
          searchValue: "subType",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "عامل",
          value: "worker",
          searchValue: "worker",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "ضباط",

          sort: 1
        },
        {
          text: "شرف",
          value: "sharaf",
          searchValue: "sharaf",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "ضباط",
          sort: 1
        },
        {
          text: "فني",
          value: "fany",
          searchValue: "fany",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "ضباط",
          sort: 1
        },
        {
          text: "الاجمالي",
          value: "total",
          searchValue: "total",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "ضباط",
          sort: 1
        },
        {
          text: "كاتب.ع",
          value: "military_writer",
          searchValue: "military_writer",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "كاتب.م",
          value: "financial_writer",
          searchValue: "financial_writer",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "صف",
          value: "saf",
          searchValue: "saf",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "عجل",
          value: "bikes",
          searchValue: "bikes",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "جنزير",
          value: "ganzer",
          searchValue: "ganzer",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "مهني",
          value: "mehany",
          searchValue: "mehany",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },

        {
          text: "حرفي",
          value: "herafy",
          searchValue: "herafy",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "إجمالي درجات أخرى",
          value: "other_totals",
          searchValue: "other_totals",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        },
        {
          text: "إجمالي عام",
          value: "general_totals",
          searchValue: "general_totals",
          sortable: true,
          multiple: false,
          readOnly: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          parent: "درجات أخرى",
          sort: 1
        }
      ]
    },
    UnitsStats: {
      isDisplayed: false,
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: false,
          inTable: true,
          inModel: true,
          parent: ""
        },

        {
          text: "مرتب الحرب",
          value: "Moratab",
          searchValue: "Moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: false,
          parent: ""
        },

        {
          text: "مرتب السلم",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: ""
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      Level: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      Category: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      allDuties: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      OfficerLevel: {
        text: "text",
        value: "text",
        data: constants.OfficerLevels.data
      },
      OfficerCategory: {
        text: "text",
        value: "text",
        data: constants.OfficerCategory.data
      },
      OfficerDutyID: {
        table: "OfficerDuty",
        text: "OfficerDuty",
        value: "OfficerDutyID"
      },
      OfficerallDuties: {
        table: "OfficerDuty",
        text: "OfficerDuty",
        value: "OfficerDutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }, { text: "رع / مجند" }]
      },
      Directionforunit: {
        table: "Unit",
        value: "Directionforunit",
        text: "Directionforunit"
      }
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    totals: {
      Moratab: 0,
      Siasa: 0,
      Jobs: 0
    },
    totals_officers: {
      Moratab: 0,
      Siasa: 0,
      Jobs: 0
    },
    totals_soldiers: {
      Moratab: 0,
      Siasa: 0,
      Jobs: 0
    },
    totals_high: {
      Moratab: 0,
      Siasa: 0,
      Jobs: 0
    },
    totals_mix: {
      Moratab: 0,
      Siasa: 0,
      Jobs: 0
    }
  }),
  watch: {
    "moratabat.Moratab"(newValue) {
      // console.log(item.Unit.SoldiersCompletenessPercentage );
      this.init();
      let unit = this.selects.UnitID.data.filter(
        ele => ele.UnitID == this.moratabat.UnitID
      );
      console.log(unit);

      if (this.moratabat.ServiceType && this.moratabat.UnitID) {
        if (this.moratabat.ServiceType == "راتب عالى") {
          this.$set(
            this.moratabat,
            "Siasa",
            Math.round(newValue * (unit[0].RatebsCompletenessPercentage / 100))
          );
        } else {
          this.$set(
            this.moratabat,
            "Siasa",
            Math.round(
              newValue * (unit[0].SoldiersCompletenessPercentage / 100)
            )
          );
        }
      }
    }
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد  من  مسح الوظيفة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "MortabatDuties",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
        }
      });
      this.findItems(this.search);
    },
    async findItems(filters) {
      if (!filters.UnitID) {
        this.showError("من فضلك قم باختيار وحدة");
        return;
      }
      if (filters) this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      this.moratabat = {
        ...this.moratabat,
        UnitID: filters.UnitID
      };
      let where = {
          ...filters
        },
        likes = [],
        multi = ["WeaponID", "DutyID", "Category", "Level", "ServiceType"];
      where = this.mapToQuery(where, likes, multi);

      let selectedUnit = await this.api("global/get_one", {
        table: "Unit",
        include: [
          {
            model: "Weapon"
          },
          {
            model: "CommandRegions"
          },
          {
            model: "FollowingAreas"
          },
          {
            model: "Pattern"
          },
          {
            model: "Sectors"
          }
        ],
        where: {
          UnitID: where.UnitID
        }
      });

      console.log("Unit is", selectedUnit);

      let officerDuties = await this.api(`global/get_all`, {
        table: "OfficerMortabatDuties",
        where: this.cleanObject({
          Category: where.OfficerCategory,
          Level: where.OfficerLevel,
          Moratab: where.Moratab,
          Siasa: where.Siasa,
          UnitID: where.UnitID,
          WeaponID: where.WeaponID
        }),
        include: [
          {
            model: "Unit",
            where: this.cleanObject({
              Directionforunit: where.Directionforunit
            })
          },
          {
            model: "OfficerDuty"
          },
          {
            model: "Weapon"
          }
        ]
      });

      console.log(officerDuties);

      this.api("global/get_all", {
        table: "MortabatDuties",
        where: this.cleanObject({
          Category: where.Category,
          Level: where.Level,
          Moratab: where.Moratab,
          ServiceType: where.ServiceType,
          Siasa: where.Siasa,
          UnitID: where.UnitID,
          WeaponID: where.WeaponID,
          DutyID: where.DutyID
        }),
        include: [
          {
            model: "Unit",
            where: this.cleanObject({
              Directionforunit: where.Directionforunit
            })
          },
          {
            model: "Duty"
          },
          {
            model: "Weapon"
          }
        ]
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              ),
              hasParent: true
            };

          let groupByCategory = lodash.groupBy(data, el => el.Category);
          let officerGroupByCategory = lodash.groupBy(
            officerDuties.data,
            el => el.Category
          );
          console.log("Group ByLevel", groupByCategory);
          console.log("Group ByLevel", officerGroupByCategory);
          console.log(
            "Group ByLevel",
            !groupByCategory["كاتب عسكرى"] ? "asdasdasd" : "eqweqweqwe"
          );

          let subItems = [];

          subItems.push({
            type: "حرب",
            subType: "حرب",
            worker: !officerGroupByCategory["عامل"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["عامل"], el => el.Moratab),
            sharaf: !officerGroupByCategory["شرف"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Moratab),
            fany: !officerGroupByCategory["فني"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["فني"], el => el.Moratab),
            total:
              (!officerGroupByCategory["عامل"]
                ? 0
                : lodash.sumBy(
                    officerGroupByCategory["عامل"],
                    el => el.Siasa
                  )) +
              (!officerGroupByCategory["شرف"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Siasa)) +
              (!officerGroupByCategory["فني"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["فني"], el => el.Siasa)),
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(groupByCategory["كاتب عسكرى"], el => el.Moratab),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(groupByCategory["كاتب مالى"], el => el.Moratab),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(groupByCategory["صف"], el => el.Moratab),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Moratab),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(groupByCategory["جنزير"], el => el.Moratab),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(groupByCategory["مهنى"], el => el.Moratab),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(groupByCategory["حرفى"], el => el.Moratab),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"],
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"],
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(groupByCategory["صف"], el => el.Moratab)) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Moratab)) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(groupByCategory["جنزير"], el => el.Moratab)) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(groupByCategory["مهنى"], el => el.Moratab)) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(groupByCategory["حرفى"], el => el.Moratab)),
            general_totals:
              (!officerGroupByCategory["عامل"]
                ? 0
                : lodash.sumBy(
                    officerGroupByCategory["عامل"],
                    el => el.Siasa
                  )) +
              (!officerGroupByCategory["شرف"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Siasa)) +
              (!officerGroupByCategory["فني"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["فني"], el => el.Siasa)) +
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"],
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"],
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(groupByCategory["صف"], el => el.Moratab)) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Moratab)) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(groupByCategory["جنزير"], el => el.Moratab)) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(groupByCategory["مهنى"], el => el.Moratab)) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(groupByCategory["حرفى"], el => el.Moratab))
          });
          subItems.push({
            type: "سلم",
            subType: "سلم",
            worker: !officerGroupByCategory["عامل"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["عامل"], el => el.Siasa),
            sharaf: !officerGroupByCategory["شرف"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Siasa),
            fany: !officerGroupByCategory["فني"]
              ? 0
              : lodash.sumBy(officerGroupByCategory["فني"], el => el.Siasa),
            total:
              (!officerGroupByCategory["عامل"]
                ? 0
                : lodash.sumBy(
                    officerGroupByCategory["عامل"],
                    el => el.Siasa
                  )) +
              (!officerGroupByCategory["شرف"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Siasa)) +
              (!officerGroupByCategory["فني"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["فني"], el => el.Siasa)),
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(groupByCategory["كاتب عسكرى"], el => el.Siasa),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(groupByCategory["كاتب مالى"], el => el.Siasa),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(groupByCategory["صف"], el => el.Siasa),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Siasa),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(groupByCategory["جنزير"], el => el.Siasa),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(groupByCategory["مهنى"], el => el.Siasa),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(groupByCategory["حرفى"], el => el.Siasa),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(groupByCategory["كاتب عسكرى"], el => el.Siasa)) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(groupByCategory["كاتب مالى"], el => el.Siasa)) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(groupByCategory["صف"], el => el.Siasa)) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Siasa)) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(groupByCategory["جنزير"], el => el.Siasa)) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(groupByCategory["مهنى"], el => el.Siasa)) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(groupByCategory["حرفى"], el => el.Siasa)),
            general_totals:
              (!officerGroupByCategory["عامل"]
                ? 0
                : lodash.sumBy(
                    officerGroupByCategory["عامل"],
                    el => el.Siasa
                  )) +
              (!officerGroupByCategory["شرف"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["شرف"], el => el.Siasa)) +
              (!officerGroupByCategory["فني"]
                ? 0
                : lodash.sumBy(officerGroupByCategory["فني"], el => el.Siasa)) +
              ((!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(groupByCategory["كاتب عسكرى"], el => el.Siasa)) +
                (!groupByCategory["كاتب مالى"]
                  ? 0
                  : lodash.sumBy(
                      groupByCategory["كاتب مالى"],
                      el => el.Siasa
                    )) +
                (!groupByCategory["صف"]
                  ? 0
                  : lodash.sumBy(groupByCategory["صف"], el => el.Siasa)) +
                (!groupByCategory["سائق عجل"]
                  ? 0
                  : lodash.sumBy(groupByCategory["سائق عجل"], el => el.Siasa)) +
                (!groupByCategory["جنزير"]
                  ? 0
                  : lodash.sumBy(groupByCategory["جنزير"], el => el.Siasa)) +
                (!groupByCategory["مهنى"]
                  ? 0
                  : lodash.sumBy(groupByCategory["مهنى"], el => el.Siasa)) +
                (!groupByCategory["حرفى"]
                  ? 0
                  : lodash.sumBy(groupByCategory["حرفى"], el => el.Siasa)))
          });

          subItems.push({
            type: "راتب عالي",
            subType: "حرب",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Moratab
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Moratab
                  ))
          });
          subItems.push({
            type: "راتب عالي",
            subType: "سلم",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "راتب عالى"
                  ),
                  el => el.Siasa
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "راتب عالى"
                    ),
                    el => el.Siasa
                  ))
          });

          subItems.push({
            type: "مجند",
            subType: "حرب",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Moratab
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Moratab
                  ))
          });
          subItems.push({
            type: "مجند",
            subType: "سلم",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "مجند"
                  ),
                  el => el.Siasa
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "مجند"
                    ),
                    el => el.Siasa
                  ))
          });

          subItems.push({
            type: "رع / مجند",
            subType: "حرب",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Moratab
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Moratab
                  ))
          });
          subItems.push({
            type: "رع / مجند",
            subType: "سلم",
            worker: "",
            sharaf: "",
            fany: "",
            total: "",
            military_writer: !groupByCategory["كاتب عسكرى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب عسكرى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            financial_writer: !groupByCategory["كاتب مالى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["كاتب مالى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            saf: !groupByCategory["صف"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["صف"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            bikes: !groupByCategory["سائق عجل"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["سائق عجل"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            ganzer: !groupByCategory["جنزير"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["جنزير"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            mehany: !groupByCategory["مهنى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["مهنى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            herafy: !groupByCategory["حرفى"]
              ? 0
              : lodash.sumBy(
                  groupByCategory["حرفى"].filter(
                    ele => ele.ServiceType === "رع / مجند"
                  ),
                  el => el.Siasa
                ),
            other_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )),
            general_totals:
              (!groupByCategory["كاتب عسكرى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب عسكرى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["كاتب مالى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["كاتب مالى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["صف"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["صف"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["سائق عجل"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["سائق عجل"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["جنزير"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["جنزير"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["مهنى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["مهنى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  )) +
              (!groupByCategory["حرفى"]
                ? 0
                : lodash.sumBy(
                    groupByCategory["حرفى"].filter(
                      ele => ele.ServiceType === "رع / مجند"
                    ),
                    el => el.Siasa
                  ))
          });

          this.$set(this.subTable, "items", subItems);

          this.$set(this, "totals", {
            // Moratab: data.reduce((prev, ele) => prev + ele.Moratab, 0),
            Moratab: lodash.sumBy(data, ele => ele.Moratab),
            Siasa: lodash.sumBy(data, ele => ele.Siasa),
            Jobs: data.length
          });

          this.$set(this, "totals_officers", {
            Moratab: lodash.sumBy(officerDuties.data, ele => ele.Moratab),
            Siasa: lodash.sumBy(officerDuties.data, ele => ele.Siasa),
            Jobs: officerDuties.data.length
          });
          this.$set(this, "totals_soldiers", {
            Moratab: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "مجند"),
              ele => ele.Moratab
            ),
            Siasa: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "مجند"),
              ele => ele.Siasa
            ),
            Jobs: data.filter(ele => ele.ServiceType === "مجند").length
          });
          this.$set(this, "totals_high", {
            Moratab: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Moratab
            ),
            Siasa: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "راتب عالى"),
              ele => ele.Siasa
            ),
            Jobs: data.filter(ele => ele.ServiceType === "راتب عالى").length
          });
          this.$set(this, "totals_mix", {
            Moratab: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "رع / مجند"),
              ele => ele.Moratab
            ),
            Siasa: lodash.sumBy(
              data.filter(ele => ele.ServiceType === "رع / مجند"),
              ele => ele.Siasa
            ),
            Jobs: data.filter(ele => ele.ServiceType === "رع / مجند").length
          });

          console.log(
            "only rateb",
            data.filter(ele => ele.ServiceType === "راتب عالى").length
          );
          console.log("all data", data);
          let mainItems = [];
          let groupedByDuty = lodash.groupBy(data, ele => ele.DutyID);
          console.log("date grouped", groupedByDuty);

          Object.keys(groupedByDuty).map(key => {
            mainItems.push({
              Unit: selectedUnit.data,
              Weapon: groupedByDuty[key][0].Weapon,
              Duty: groupedByDuty[key][0].Duty,
              Category: groupedByDuty[key][0].Category,
              Level: groupedByDuty[key][0].Level,
              ServiceType: groupedByDuty[key][0].ServiceType,
              Moratab: lodash.sumBy(groupedByDuty[key], ele => ele.Moratab),
              Siasa: lodash.sumBy(groupedByDuty[key], ele => ele.Siasa)
            });
          });

          this.$set(this.mainTable, "items", mainItems);

          this.$set(this.mainTable, "printer", {
            data: mainItems,
            sub: subItems,
            unit: mainItems[0].Unit,
            unitName: mainItems[0].Unit.Unit,
            rateb: mainItems
              .filter(ele => ele.ServiceType === "راتب عالى")
              .map(ele => ({
                ...ele,
                DutyName: ele.Duty.Duty,
                WeaponName: ele.Weapon.Weapon
              })),
            soldier: mainItems
              .filter(ele => ele.ServiceType === "مجند")
              .map(ele => ({
                ...ele,
                DutyName: ele.Duty.Duty,
                WeaponName: ele.Weapon.Weapon
              })),
            mix: mainItems
              .filter(ele => ele.ServiceType === "رع / مجند")
              .map(ele => ({
                ...ele,
                DutyName: ele.Duty.Duty,
                WeaponName: ele.Weapon.Weapon
              })),
            excelKey: "data",
            high_moratab: this.totals_high.Moratab,
            high_siasa: this.totals_high.Siasa,
            high_jobs: this.totals_high.Jobs,
            soldier_moratab: this.totals_soldiers.Moratab,
            soldier_siasa: this.totals_soldiers.Siasa,
            soldier_jobs: this.totals_soldiers.Jobs,
            mix_moratab: this.totals_mix.Moratab,
            mix_siasa: this.totals_mix.Siasa,
            mix_jobs: this.totals_mix.Jobs,
            total_moratab: this.totals.Moratab,
            total_siasa: this.totals.Siasa,
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;

      saveItem = await this.api(
        `global/${this.moratabat.isEdit ? "update_one" : "create_one"}`,
        {
          table: "MortabatDuties",
          where: !this.moratabat.isEdit
            ? this.moratabat
            : {
                ID_KEY: this.moratabat.ID_KEY
              },
          update: this.moratabat
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems(this.search);
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this, "moratabat", {
        UnitID: this.moratabat.UnitID
      });
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "moratabat", {
        UnitID: this.moratabat.UnitID,
        isEdit: false
      });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "moratabat", {
        ...item,
        isEdit: true
      });
    },
    openUnitsStats() {
      const dataGroupByUnit = lodash.groupBy(
        this.mainTable.items,
        ele => ele.Unit.Unit
      );
      this.UnitsStats.isDisplayed = true;
      this.UnitsStats.items = Object.keys(dataGroupByUnit).map(key => ({
        Unit: key,

        SoldiersCompletenessPercentage:
          dataGroupByUnit[key][0]?.Unit?.SoldiersCompletenessPercentage,
        RatebsCompletenessPercentage:
          dataGroupByUnit[key][0]?.Unit?.RatebsCompletenessPercentage,
        Moratab: dataGroupByUnit[key].reduce(
          (prev, ele) => prev + ele.Moratab,
          0
        ),
        Siasa: dataGroupByUnit[key].reduce((prev, ele) => prev + ele.Siasa, 0)
      }));

      this.UnitsStats.items = [
        {
          Unit: "اجمالي",
          Moratab: this.UnitsStats.items.reduce(
            (prev, ele) => prev + ele.Moratab,
            0
          ),
          Siasa: this.UnitsStats.items.reduce(
            (prev, ele) => prev + ele.Siasa,
            0
          )
        },
        ...this.UnitsStats.items
      ];
      this.UnitsStats.printer = {
        data: [...this.UnitsStats.items],
        excelKey: "data",
        excelHeaders: this.UnitsStats.headers.filter(f => f.inTable),
        hasParent: true
      };
    }
  }
};
</script>
