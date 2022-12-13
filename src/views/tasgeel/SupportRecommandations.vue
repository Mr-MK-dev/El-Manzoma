<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في إمداد ادارات"
      :addButton="false"
    />

    <v-card>
      <v-card-title>
        <v-btn
          color="primary"
          outlined
          large
          class="px-6"
          @click="calculateReport()"
          v-text="'يومية عددية بالامداد'"
        />
      </v-card-title>
    </v-card>

    <v-dialog
      persistent
      v-model="reportDaily.isDisplayed"
      scrollable
      max-width="1000"
    >
      <v-card>
        <v-btn @click="reportDaily.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="reportDaily.headers"
          :printer="reportDaily.printer"
          :items="reportDaily.items"
          :title="'يومية عددية بالامداد'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>
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
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "SupportRecommandations",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    // this.initDates();
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
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          multiple: true,
          sort: 3
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },

        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 4
        }
      ],
      items: [],
      printer: {}
    },
    reportDaily: {
      isDisplayed: false,
      headers: [
        {
          text: "السلاح",
          value: "Weapon",
          searchValue: "Weapon",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 2
        },
        {
          text: "العدد",
          value: "totalSoliders",
          searchValue: "totalSoliders",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 4
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      SituationID: {
        table: "EffectSituationStates",
        value: "SituationID",
        text: "Situation"
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      DutyID: {
        table: "Duty",
        value: "DutyID",
        text: "Duty"
      },
      Contnuity: {
        text: "text",
        value: "text",
        data: [
          {
            text: "متابع"
          },
          {
            text: "غير متابع"
          }
        ]
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      try {
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = this.cleanObject({
            ...this.search,
            ...filters
          }),
          likes = ["ID"],
          multi = ["RecuStage"];
        where = this.mapToQuery(where, likes, multi);
        const x = await this.api("global/get_all", {
          table: "Soldier",
          include: [
            {
              model: "Duty"
            },
            {
              model: "Unit"
            },
            {
              model: "Weapon"
            }
          ],
          where: this.cleanObject(where)
        });

        let data = x.data,
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        this.$set(this.mainTable, "items", data);
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

      this.reportDaily.items.push({
        Weapon: "الاجمالي",
        totalSoliders: lodash.sum(
          this.reportDaily.items.map(ele => ele.totalSoliders)
        )
      });

      let data = this.reportDaily.items,
        printer = {
          data: [...data],
          excelKey: "data",
          excelHeaders: this.reportDaily.headers.filter(f => f.inTable)
        };
      this.$set(this.reportDaily, "printer", printer);

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
    }
  }
};
</script>
