<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :loading="searchLoading"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم "
      :addButton="false"
    />

    <v-card>
      <v-card-title>
        <v-btn
          color="primary"
          outlined
          large
          class="px-6"
          v-if="mainTable.items.length > 0"
          @click="endSoldiersService()"
          v-text="'نقل المجندين الي قوة الاحتياط'"
        />
      </v-card-title>
    </v-card>
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
  name: "EndSoldiersService",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },
  mounted() {
    // this.initDates();
    this.init();
    this.getRecuEndDateOptions();
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
          text: "حالة الفرد",
          value: "Status",
          searchValue: "Status",
          sortable: true,
          type: "select",
          inSearch: false,
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
          inSearch: false,
          inTable: true,
          inModel: false,
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
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          multiple: true,
          sort: 3
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
        value: "WeaponID",
        text: "Weapon"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
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
      if (!filters.RecuEndDate) {
        this.showError("برجاء إختيار تاريخ التسريح");
        return;
      }
      try {
        this.search = filters;
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = {
            ...this.search,
            Status: "بالخدمة",
            ...filters
          },
          likes = ["ID"],
          multi = [];
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
          where
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

    async endSoldiersService() {
      for (const el of this.mainTable.items) {
        await this.api("global/update_one", {
          table: "Soldier",
          where: {
            ID: el.ID
          },
          update: {
            Status: "منتهى خدمته",
            SoldierStatus: "نقل على الإحتياط"
          }
        });

        await this.api("global/create_one", {
          table: "UnitEffecs",
          where: {
            UnitID: el.UnitID,
            ID: el.ID,
            increment: false,
            date: new Date(),
            type: "Soldier",
            descrption: `تم شطب الجندي من الحدة بسبب انتهاء خدمته بسبب (نقله على الاحتياط)`
          }
        });
      }

      this.showSuccess("تم تحديث الافراد بنجاح");
      await this.findItems(this.search);
    },
    async getRecuEndDateOptions() {
      const result = await this.api("global/queryRunners", {
        query: `   select count (ID) count ,  RecuEndDate  from Soldier GROUP  By RecuEndDate`
      });
      this.selects.RecuEndDate.data = result.data.map(ele => ({
        value: `${ele.RecuEndDate}`,
        text: ele.RecuEndDate
      }));
      this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);
      this.allUnites = [...this.selects.unitIds.data];
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
