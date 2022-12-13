<template>
  <div>
    <template v-for="(card, ii) in cards">
      <v-card
        v-show="!isFiltered"
        :key="ii"
        class="mb-6"
        :loading="result.loading"
        :disabled="result.loading"
      >
        <v-card-title class="sidenav white--text">
          {{ card.title }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <template v-for="(option, i) in card.options">
              <v-col cols="6" :lg="option.type == 'date' ? '6' : '3'" :key="i">
                <v-checkbox
                  v-if="option.type == 'checkbox'"
                  :label="option.label"
                  v-model="search[option.model]"
                ></v-checkbox>

                <v-text-field
                  v-if="!option.type || option.type == 'text'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-model="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>
                <v-text-field
                  v-else-if="option.type == 'number'"
                  :persistent-hint="option.hint ? true : false"
                  :hide-details="option.hint ? false : true"
                  :hint="option.hint"
                  filled
                  v-mask="'##########'"
                  v-model.number="search[option.model]"
                  :label="option.label"
                  @keypress.enter="searchConscriptes"
                ></v-text-field>
                <v-autocomplete
                  v-if="option.type == 'select'"
                  :label="option.label"
                  :hint="option.hint"
                  v-model="search[option.model]"
                  :items="selects[option.model].data"
                  :multiple="option.multiple"
                  :item-value="selects[option.model].value"
                  :item-text="selects[option.model].text"
                  filled
                  :error-messages="selects[option.model].error"
                  :append-icon="
                    selects[option.model].error
                      ? 'mdi-refresh'
                      : 'mdi-chevron-down'
                  "
                  @click:append="
                    selects[option.model].error ? init(option.model) : () => {}
                  "
                  :hide-details="option.hint ? false : true"
                  :persistent-hint="option.hint ? true : false"
                  :loading="selects[option.model].loading || option.loading"
                  clearable
                ></v-autocomplete>
                <v-row class="py-0 my-0" v-else-if="option.type == 'date'">
                  <template v-for="x in ['from', 'to']">
                    <v-col
                      v-if="search[option.model]"
                      cols="6"
                      class="py-0 my-0"
                      :key="x"
                    >
                      <v-text-field
                        v-model="search[option.model][x]"
                        :prepend-inner-icon="option.icon"
                        :hint="option.hint"
                        :persistent-hint="option.hint ? true : false"
                        :hide-details="option.hint ? false : true"
                        :label="
                          `${option.label} ( ${x == 'from' ? 'من' : 'الى'} )`
                        "
                        :error-messages="option.error"
                        filled
                        :clearable="
                          option.range
                            ? false
                            : !option.readonly && !option.disabled
                        "
                        type="date"
                      >
                      </v-text-field>
                    </v-col>
                  </template>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <!-- <v-card class="mb-6">
      <v-card-actions class="px-4"> -->

    <v-card>
      <v-card-text>
        <v-btn
          v-show="!isFiltered"
          class="px-4"
          large
          color="primary"
          @click="searchConscriptes"
        >
          <v-icon class="me-3">mdi-magnify</v-icon>
          بحث
        </v-btn>
        <v-btn class="px-4" large color="primary" @click="choosingConscriptes">
          <v-icon class="me-3">mdi-plus</v-icon>
          إختيار
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card class="mb-6">
      <v-card-title class="sidenav white--text">
        النتائج
        <v-spacer></v-spacer>
        <printer-menu
          :disabled="result.items.length == 0"
          :query="`tasgeel/search/conscriptes`"
          :data="result.printer"
          :fab="false"
          dark
        ></printer-menu>
      </v-card-title>
    </v-card>
    <v-divider></v-divider>
    <v-data-table
      :items="result.items"
      :headers="result.headers"
      fixed-header
      :search.sync="result.search"
      v-model="result.selected"
      :single-select="singleSelect"
      show-select
      multi-sort
      hide-default-header
      item-key="ID"
      @current-items="tableUpdated"
      ref="mainTable"
    >
      <template v-slot:header="table">
        <table-header-filters
          :items="result.items"
          :table="table"
          :filters.sync="tableFilters"
        ></table-header-filters>
      </template>
      <template v-slot:footer="table">
        <table-footer-filters
          :filters.sync="tableFilters"
          :table="table"
        ></table-footer-filters>
      </template>
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent" @click.right="copyText(item.ID)">
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.Name="{ item }">
        <v-chip color="transparent" @click.right="copyText(item.Name)">
          {{ item.Name }}
        </v-chip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { external } from "jszip";
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "conscriptes",
  emits: ["on-select"],
  props: {
    singleSelect: {
      type: Boolean,
      default: false
    },
    isFiltered: {
      type: Boolean,
      default: false
    },
    externalFilter: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.fillKeys();
    this.init();
    if (this.isFiltered) {
      this.search.RecuStage.push(this.externalFilter.RecuStage);
      this.search.WeaponID.push(this.externalFilter.WeaponID);
      this.searchConscriptes();
    }
  },
  watch: {},
  data: () => ({
    componentName: "ratebSearch",
    tableFilters: {},
    fullDatas: {},
    result: {
      printer: {},
      selected: [],
      search: "",
      items: [],
      headers: [
        {
          value: "ID",
          text: "الرقم العسكري",
          sortable: true
        },
        {
          value: "Name",
          text: "الإسم",
          sortable: true
        },
        {
          value: "Weapon.Weapon",
          text: "السلاح",
          sortable: true
        },
        {
          value: "Unit.Unit",
          dbvalue: "UnitID",
          text: "الوحدة",
          sortable: true
        },
        {
          value: "Type",
          dbvalue: "Type",
          text: "نوع الفرد",
          sortable: true
        },
        {
          value: "Status",
          dbvalue: "Status",
          text: "حالة الفرد",
          sortable: true
        },
        {
          value: "SoldierCategory",
          dbvalue: "SoldierCategory",
          text: "الفئة",
          sortable: true
        },
        {
          value: "SoldierLevel",
          dbvalue: "SoldierLevel",
          text: "الدرجة",
          sortable: true
        },
        {
          value: "RecuStartDate",
          text: "تاريخ التجنيد / التطوع",
          sortable: true
        }
      ]
    },
    printers: [],
    search: {},
    dialogs: {},
    cards: [
      {
        title: "بيانات تجنيدية",
        options: [
          {
            model: "ID",
            label: "الرقم العسكري",
            type: "text",
            counter: 13,
            forEnhaa: true
          },
          {
            model: "Name",
            label: "الإسم الكامل",
            type: "text",
            forEnhaa: true
          },
          {
            model: "TripleNo",
            label: "الرقم الثلاثي",
            type: "text"
          },
          {
            model: "WeaponID",
            multiple: true,
            label: "السلاح",
            type: "select"
          },
          {
            model: "UnitID",
            multiple: true,
            label: "الوحدة",
            type: "select"
          },
          {
            model: "DutyID",
            multiple: true,
            label: " الواجب المدرب عليه",
            type: "select"
          }
        ]
      },

      {
        title: "بيانات شخصية",
        options: [
          {
            model: "IdentityNo",
            label: "الرقم القومي",
            type: "text",
            counter: 14
          },
          {
            model: "CityID",
            multiple: true,
            label: "المحافظة",
            type: "select"
          },
          {
            model: "CentreID",
            multiple: true,
            label: "المركز",
            type: "select"
          },
          {
            model: "Religion",
            multiple: true,
            label: "الديانة",
            type: "select"
          }
        ]
      }
    ],
    constants: constants,
    selects: {
      SoldierLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Religion: {
        text: "text",
        value: "text",
        data: constants.Religion.data
      },
      DriverLevel: {
        text: "text",
        value: "text",
        data: constants.DriverLevel.data
      },
      RecuTreat: {
        text: "text",
        value: "text",
        data: constants.RecuTreat.data
      },
      SoldierCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      BloodType: {
        text: "text",
        value: "text",
        data: constants.BloodType.data
      },
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Treatment: {
        text: "text",
        value: "text",
        data: constants.Treatment.data
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      College: {
        text: "text",
        value: "text",
        data: constants.College.data
      },
      Direction: {
        text: "text",
        value: "text",
        data: constants.Direction.data
      },
      CityID: {
        table: "City",
        text: "City",
        value: "CityID"
      },
      CentreID: {
        table: "Centre",
        text: "Centre",
        value: "CentreID"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      ServiceType: {
        text: "text",
        value: "text",
        data: constants.serviceTypes
      },
      ServiceStyle: {
        text: "text",
        value: "text",
        data: constants.ServiceStyle
      },
      RatebCategoryFari: {
        text: "text",
        value: "text",
        data: constants.RatebCategoryFari.data
      },
      RatebCategory: {
        text: "text",
        value: "text",
        data: constants.SoldierCategory.data
      },
      RatebLevel: {
        text: "text",
        value: "text",
        data: constants.SoldierLevel.data
      },
      RatebState: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      MartialStatus: {
        text: "text",
        value: "text",
        data: constants.matrialStatus.data
      },
      Type: {
        text: "text",
        value: "text",
        data: [{ text: "راتب عالى" }, { text: "مجند" }]
      }
    }
  }),
  methods: {
    searchConscriptes() {
      this.$set(this.result, "loading", true);
      let search = { ...this.search };
      search.Type = [constants.serviceTypesMap.highLevel];
      console.log("search", search);
      this.api("sections/tasgeel/search/conscriptes", {
        search: { ...search }
      })
        .then(x => {
          console.log("data", x.data);
          let fixedData = x.data.map(ele => ({
              ...ele,
              Type: ele.RecuStage ? "مجند" : "راتب عالي",
              Status: ele.RecuStage ? ele.Status : ele.RatebState,
              SoldierCategory: ele.RecuStage
                ? ele.SoldierCategory
                : ele.RatebCategory,
              SoldierLevel: ele.SoldierLevel
                ? ele.SoldierLevel
                : ele.RatebLevel,
              RecuStartDate: ele.RecuStage
                ? ele.RecuStartDate
                : ele.VolunteeringDate
            })),
            printer = {
              cons: [...fixedData],
              excelKey: "cons",
              excelHeaders: this.result.headers
            };
          this.$set(this.result, "items", fixedData);
          this.$set(this.result, "printer", printer);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.$set(this.result, "loading", false);
        });
    },
    fillKeys() {
      let options_arr = this.cards.map(c => c.options),
        options = [];
      options_arr.forEach(arr => {
        options = [...options, ...arr];
      });
      options.forEach(option => {
        if (option.type == "date") {
          this.$set(this.search, option.model, {});
        } else if (option.multiple) {
          this.$set(this.search, option.model, []);
        } else {
          this.$set(this.search, option.model, "");
        }
      });
    },
    goSearch(search) {
      if (
        !this.$route.fullPath.includes(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        )
      ) {
        this.goThere(
          "/soldiers_plus/advanced_search/conscriptes/" + JSON.stringify(search)
        );
      }
    },
    choosingConscriptes() {
      this.$emit("on-select", this.result.selected);
    }
  },
  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  }
};
</script>
