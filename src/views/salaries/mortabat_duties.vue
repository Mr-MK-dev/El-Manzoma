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
      title="بحث متقدم في مرتبات الوظائف للوحدات"
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
        <v-col cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            مرتب : {{ totals.Moratab }}
          </v-card>
        </v-col>
        <v-col :key="n" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            سياسة : {{ totals.Siasa }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
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
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: true,
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
          inSearch: true,
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
          inSearch: true,
          parent: "",

          inModel: false
        },
        {
          text: "التشكيل",
          value: "Unit.Directionforunit",
          searchValue: "Directionforunit",
          sortable: true,
          multiple: false,
          readOnly: false,
          type: "select",
          inSearch: true,
          inTable: true,
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
          inTable: true,
          inSearch: true,
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
          inSearch: true,
          parent: "",

          inModel: true
        },
        {
          text: "نوع الخدمه",
          value: "ServiceType",
          multiple: true,
          searchValue: "ServiceType",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          parent: "",

          inModel: true
        },
        {
          text: "بيان الشكل",
          value: "ShapeType",
          multiple: false,
          searchValue: "ShapeType",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: true
        },
        {
          text: "المرتب",
          value: "Moratab",
          searchValue: "Moratab",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        },
        {
          text: "السياسة",
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
          text: " مجند /  نسبة الإستكمال",
          value: "Unit.SoldiersCompletenessPercentage",
          searchValue: "SoldiersCompletenessPercentage",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },
        {
          text: "رع /  نسبة الإستكمال",
          value: "Unit.RatebsCompletenessPercentage",
          searchValue: "RatebsCompletenessPercentage",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "نسبة الإستكمال",
          inModel: false,
          readOnly: true
        }
      ],
      items: [],
      printer: []
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
          multiple: true,
          inTable: true,
          inModel: true,
          parent: ""
        },

        {
          text: "المرتب",
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
          text: "السياسة",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          parent: ""
        },
        {
          text: "مجند",
          value: "SoldiersCompletenessPercentage",
          searchValue: "SoldiersCompletenessPercentage",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true,
          readonly: true,
          parent: "نسبة الإستكمال"
        },
        {
          text: "رع",
          value: "RatebsCompletenessPercentage",
          searchValue: "RatebsCompletenessPercentage",
          type: "text",
          sortable: true,
          inTable: true,
          readonly: true,
          parent: "نسبة الإستكمال",
          inModel: false
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
      ShapeType: {
        text: "text",
        value: "text",
        data: constants.ShapeTypes.data
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
      Siasa: 0
    }
  }),
  watch: {
    async "moratabat.WeaponID"(newValue) {
      this.$set(this.createdObject, "loading", true);
      this.selects.DutyID.data = this.selects.allDuties.data.filter(
        ele => ele.WeaponID == newValue
      );
      this.$set(this.createdObject, "loading", false);
      this.$set(this.mainTable.headers[2], "inModel", true);
    },
    async "search.WeaponID"(newValue) {
      this.$set(this.createdObject, "loading", true);
      this.selects.DutyID.data = this.selects.allDuties.data.filter(
        ele => newValue.indexOf(ele.WeaponID) > -1
      );
      this.$set(this.createdObject, "loading", false);
      this.$set(this.mainTable.headers[2], "inSearch", true);
    },
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
    findItems(filters) {
      if (filters) this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      this.moratabat = {
        ...this.moratabat,
        UnitID: filters.UnitID ? filters.UnitID[0] : null
      };
      let where = {
          ...filters
        },
        likes = [],
        multi = [
          "UnitID",
          "WeaponID",
          "DutyID",
          "Category",
          "Level",
          "ServiceType"
        ];
      where = this.mapToQuery(where, likes, multi);

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
              Directionforunit: where.Directionforunit,
              ShapeType: where.ShapeType
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
                  ...ele,
                  RatebsCompletenessPercentage:
                    ele.Unit.RatebsCompletenessPercentage,
                  SoldiersCompletenessPercentage:
                    ele.Unit.SoldiersCompletenessPercentage
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              ),
              hasParent: true
            };

          this.$set(this, "totals", {
            Moratab: data.reduce((prev, ele) => prev + ele.Moratab, 0),
            Siasa: data.reduce((prev, ele) => prev + ele.Siasa, 0)
          });
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
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
