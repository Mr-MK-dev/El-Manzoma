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
          @click="createdObject.model = true"
          v-text="'إضافة تكرييم جماعي'"
        />
      </v-card-title>
    </v-card>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
    >
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة بيانات التكريم '"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="honorsTable.headers"
      :selects="selects"
      :data="honors"
      @on-submit="honorAll()"
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
  name: "GroupedHonours",
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
    honors: {},
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
    honorsTable: {
      headers: [
        {
          text: "التكريم",
          value: "Honor",
          searchValue: "Honor",
          type: "text",
          sortable: true,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "مكان التكريم",
          value: "HonorPlace",
          searchValue: "HonorPlace",
          type: "text",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        },
        {
          text: "تاريخ التكريم",
          value: "Date",
          searchValue: "Date",
          type: "date",
          sortable: true,
          inSearch: false,
          inModel: true,
          inTable: true,
          sort: 5
        }
      ],
      items: [],
      printer: []
    },
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
          text: "النوع",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          required: true,
          multiple: true,
          sort: 1
        },
        {
          text: "اسم الحرب",
          value: "WarType",
          searchValue: "WarType",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "قرار السببيه",
          value: "ReasonOrder",
          searchValue: "ReasonOrder",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "نوع المكرم",
          value: "Kind",
          searchValue: "Kind",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Martyr.Name",
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
          text: "تاريخ الحادثة",
          value: "DateOfIncident",
          searchValue: "DateOfIncident",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "createdObject",
    selects: {
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.newData
      },
      Kind: {
        text: "text",
        value: "text",
        data: [{ text: "شهيد" }, { text: "مصاب" }, { text: "وفاه" }]
      },
      ReasonOrder: {
        text: "text",
        value: "text",
        data: [
          {
            text: "شهيد"
          },
          {
            text: "وفاة مادة 31"
          },
          {
            text: "وفاة - أثناء الخدمة وبسببها"
          },
          {
            text: "مصاب - أثناء الخدمة وبسببها"
          },
          {
            text: "وفاة - أثناء الخدمة وليس بسببها"
          },
          {
            text: "مصاب - أثناء الخدمة وليس بسببها"
          },
          {
            text: "وفاة - في غير أثناء الخدمة وليس بسببها"
          },
          {
            text: "مصاب - في غير أثناء الخدمة وليس بسببها"
          },
          {
            text: "وفاة - حروب سابقة"
          },
          {
            text: "مصاب - حروب سابقة"
          }
        ]
      },
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مجند"
          },
          {
            text: "راتب عالي"
          },
          {
            text: "ضابط"
          }
        ]
      },

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
      WeaponID: {
        text: "Weapon",
        value: "WeaponID",
        table: "Weapon"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      WarType: {
        text: "text",
        value: "text",
        data: ["حرب 56", "حرب الاستنزاف"]
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
        this.search = filters;
        this.$set(this, "searchLoading", true);
        this.$set(this, "items", []);
        let where = {
            ...this.search,
            ...filters
          },
          likes = ["ID"],
          date = ["DateOfIncident"],
          multi = ["Type"];
        console.log("where", where);
        where = this.mapToQuery(where, likes, multi, date);
        const x = await this.api("global/get_all", {
          table: "MartyrsAndInjuredAndDeath",
          where
        });
        let items = [];
        for (const ele of x.data) {
          var martyr = await this.fetchDataBaseOnType(
            ele.ID,
            ele.Type == "مجند"
              ? "Soldier"
              : ele.Type == "ضابط"
              ? "Officer"
              : "Rateb",
            "Martyr"
          );
          items.push({
            ...ele,
            ...martyr
          });
        }

        if (filters.UnitID != null && filters.UnitID.length > 0) {
          items = items.filter(ele =>
            filters.UnitID.includes(ele.Martyr.UnitID)
          );
        }

        let printer = {
          data: [...items],
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        };

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
      //
      // await Promise.all(
      //     this.mainTable.items.map(ele => {
      //       return this.api("global/update_one", {
      //         table: "Soldier",
      //         where: {
      //           KnowledgeLevel : {
      //             $in :  ["اعداديه", "راسب اعداديه", "ابتدائيه" , "راسب ابتدائيه" , "امي"]
      //           }
      //         },
      //         update: {
      //           KnowledgeLevel: "عادة",
      //
      //         }
      //       });
      //     })
      // );
    },

    async honorAll() {
      this.$set(this.createdObject, "model", false);

      await Promise.all(
        this.mainTable.items.map(ele => {
          return this.api("global/create_one", {
            table: "Honors",
            where: {
              ...this.honors,
              ID: ele.ID,
              grantee: "الأسرة",
              Kind: ele.Kind,
              MilitaryType: ele.Type
            }
          });
        })
      );
      this.showSuccess("تم تحديث الافراد بنجاح");
      this.findItems(this.search);
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
