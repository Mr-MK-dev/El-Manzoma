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
          @click="actionUpdateWeapon()"
          v-text="'تعديل سلاح المذكورين'"
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
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="correctingHeaders"
      :selects="selects"
      :data="weapon"
      @on-submit="UpdateWeapon()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "actionChangeID",
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
    weapon: {},
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
    correctingHeaders: [
      {
        text: "السلاح",
        value: "Weapon.Weapon",
        searchValue: "WeaponID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        readonly: true,
        sort: 2
      }
    ],
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
          inModel: false,
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
          inModel: false,
          readonly: true,
          sort: 2
        },
        {
          text: "النوع",
          value: "type",
          searchValue: "type",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 2
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: false,
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
          text: "رقم السلاح في الرقم العسكري",
          value: "Weapon.Weapon",
          searchValue: "WeaponNumber",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: false,
          readonly: true,
          sort: 2
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          inSearch: false,
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
          inSearch: false,
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
      type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مجند"
          },
          {
            text: "راتب عالى"
          }
        ]
      }
    }
  }),
  watch: {},
  methods: {
    async findItems(filters) {
      let SoldierArray = [];
      let RatebArray = [];
      try {
        if (!filters.WeaponNumber || !filters.type) {
          this.showError("يجب البحث بالنوع ورقم السلاح");
          return;
        }
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
        if (filters.type == "مجند") {
          const Soldiers = await this.api("global/get_all", {
            table: "Soldier",
            include: [
              {
                model: "Weapon"
              }
            ],
            where: {
              Status: "بالخدمة"
            }
          });
          SoldierArray = Soldiers.data;
        }
        if (filters.type == "راتب عالى") {
          const Ratebs = await this.api("global/get_all", {
            table: "Rateb",
            include: [
              {
                model: "Weapon"
              }
            ],
            where: {
              Status: "بالخدمة"
            }
          });
          RatebArray = Ratebs.data;
        }

        let conscriptes = [
          ...SoldierArray.map(ele => ({ ...ele, type: "مجند" })),
          ...RatebArray.map(ele => ({ ...ele, type: "راتب عالى" }))
        ];
        console.log("consc", conscriptes);

        let returnedItems = conscriptes.filter(
          ele =>
            ele.ID.substring(6, 8) == where.WeaponNumber && !ele.Weapon.Weapon
        );

        console.log("ri", returnedItems);

        let data = returnedItems,
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
    async actionUpdateWeapon() {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "weapon", {});
    },
    async UpdateWeapon() {
      for (const el of this.mainTable.items) {
        if ((el.type = "مجند")) {
          await this.api("global/update_one", {
            table: "Soldier",
            where: {
              ID: el.ID
            },
            update: {
              WeaponID: this.weapon.WeaponID
            }
          });
        }
        if ((el.type = "راتب عالى")) {
          await this.api("global/update_one", {
            table: "Rateb",
            where: {
              ID: el.ID
            },
            update: {
              WeaponID: this.weapon.WeaponID
            }
          });
        }
      }

      this.showSuccess("تم تحديث الافراد بنجاح");
      this.$set(this.createdObject, "model", true);
      await this.findItems(this.search);
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
