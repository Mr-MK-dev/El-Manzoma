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
      <!-- <v-card-title>
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
      </v-card-title> -->
    </v-card>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="''"
    >
      <template v-if="parentFilters" v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.Unit="{ item }">
        <v-chip :color="item.color">
          {{ item.Unit }}
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
      :data="moratabatDaily"
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
  name: "MortbatAndMwgodatDaily",
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
    moratabatDaily: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "UnitID",
          sortable: true,
          multiple: true,
          readOnly: false,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
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
          required: true,
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
          inTable: false,
          inSearch: true,
          parent: "",

          inModel: true
        },
        {
          text: "مرتب الراتب العالي",
          value: "MoratabRateb",
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
          text: "مرتب المجند",
          value: "MoratabMogand",
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
          text: "اجمالي المرتب",
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
          text: "سياسة الراتب العالي",
          value: "SiasaRateb",
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
          text: "سياسة المجند",
          value: "SiasaMogand",
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
          text: "اجمالي السياسة",
          value: "Siasa",
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
          text: "الموجود راتب عالي",
          value: "totalRateb",
          searchValue: "totalRateb",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },
        {
          text: "الموجود مجند",
          value: "totalMogand",
          searchValue: "total",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },

        {
          text: "اجمال الموجود ",
          value: "total",
          searchValue: "total",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: true
        },
        {
          text: " النسبة الراتب العالي / المرتب",
          value: "precRatebOnMortab",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },

        {
          text: " النسبة المجند / المرتب",
          value: "precMogandOnMortab",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },
        {
          text: " النسبة / المرتب",
          value: "precOnMortab",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },

        {
          text: " النسبة الراتب العالي / السياسة",
          value: "precRatebOnSiasa",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },

        {
          text: " النسبة المجند / السياسة",
          value: "precMogandOnSiasa",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
        },
        {
          text: " النسبة / السياسة",
          value: "precOnSiasa",
          searchValue: "precOnSiasa",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          parent: "",
          inModel: false,
          readOnly: true
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
          inTable: false,
          inModel: false,
          parent: "",

          sort: 1
        },
        {
          text: "جهة الإمداد",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          multiple: false,
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          parent: "",
          sort: 1
        },
        {
          text: "الشريحة",
          value: "SupplyLayer",
          searchValue: "SupplyLayer",
          multiple: false,
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          parent: "",
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    UnitsStats: {
      isDisplayed: false,
      headers: [],
      items: [],
      printer: {}
    },
    selects: {
      SupplyLayer: {
        data: [
          {
            text: "الشريحة الاولي",
            value: "1"
          },
          {
            text: "الشريحة الثانية",
            value: "2"
          },
          {
            text: "الشريحتين",
            value: "1-2"
          },
          {
            text: "مجموع الشريحتين",
            value: null
          }
        ]
      },
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
  watch: {},
  methods: {
    findItems(filters) {
      if (!filters.WeaponID) {
        this.showError("الرجاء اختيار السلاح ");
        return;
      }

      if (filters) this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);
      this.moratabatDaily = {
        ...this.moratabatDaily,
        UnitID: filters.UnitID ? filters.UnitID[0] : null
      };
      let where = {
          ...filters
        },
        likes = [],
        multi = ["UnitID", "DutyID", "Category", "Level", "ServiceType"];
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
              UnitID: filters.UnitID
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
        .then(async x => {
          let data = x.data.map(ele => ({
            ...ele,
            ServiceType:
              ele.ServiceType == "راتب عالى" ? ele.ServiceType : "مجند"
          }));
          let rateb = await this.api("global/get_all", {
            table: "Rateb",
            where: this.cleanObject({
              WeaponID: filters.WeaponID,
              Status: "بالخدمة",
              UnitID: filters.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          });

          let solider = await this.api("global/get_all", {
            table: "Soldier",
            where: this.cleanObject({
              WeaponID: filters.WeaponID,
              Status: "بالخدمة",
              UnitID: filters.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          });

          let result = [];

          let allMortatabt = await Promise.all(
            Object.values(
              lodash.groupBy(
                data,
                ele => ele.Unit.Unit + ele.Category + ele.ServiceType
              )
            ).map(async ele => {
              let total = 0;
              let Moratab = lodash.sumBy(ele, e => e.Moratab);
              let Siasa = lodash.sumBy(ele, e => e.Siasa);
              return {
                color: "success",
                Unit: ele[0].Unit.Unit,
                UnitID: ele[0].Unit.UnitID,
                UnitObj: ele[0].Unit,
                Category: ele[0].Category,
                ServiceType: ele[0].ServiceType,
                Moratab,
                Siasa,
                total,
                precOnSiasa: Math.round((total / Siasa) * 100) + "%",
                precOnMortab: Math.round((total / Moratab) * 100) + "%"
              };
            })
          );

          let soliderGrouped = lodash.groupBy(
            solider.data,
            ele => ele.UnitID + ele.SoldierCategory
          );

          Object.values(soliderGrouped).forEach(eles => {
            let Moratabs = data.filter(
              ele =>
                ele.UnitID == eles[0].UnitID &&
                eles[0].SoldierCategory == ele.Category &&
                ele.ServiceType == "مجند"
            );

            let Moratab = lodash.sumBy(Moratabs, e => e.Moratab);
            let Siasa = lodash.sumBy(Moratabs, e => e.Siasa);
            let total = eles.length;
            result.push({
              color: Moratab ? "success" : "error",
              Unit: eles[0].Unit.Unit,
              UnitID: eles[0].Unit.UnitID,
              UnitObj: eles[0].Unit,
              Category: eles[0].SoldierCategory,
              ServiceType: "مجند",
              Moratab,
              Siasa,
              total,
              precOnSiasa:
                Siasa > 0 ? Math.round((total / Siasa) * 100) + "%" : "0%",
              precOnMortab:
                Moratab > 0 ? Math.round((total / Moratab) * 100) + "%" : "0%"
            });
          });

          let ratebGrouped = lodash.groupBy(
            rateb.data,
            ele => ele.UnitID + ele.RatebCategory
          );

          Object.values(ratebGrouped).forEach(eles => {
            let Moratabs = data.filter(
              ele =>
                ele.UnitID == eles[0].UnitID &&
                eles[0].RatebCategory == ele.Category &&
                ele.ServiceType == "راتب عالى"
            );

            let Moratab = lodash.sumBy(Moratabs, e => e.Moratab);
            let Siasa = lodash.sumBy(Moratabs, e => e.Siasa);
            let total = eles.length;
            result.push({
              color: Moratab ? "success" : "error",
              Unit: eles[0].Unit.Unit,
              UniObj: eles[0].Unit,
              UnitID: eles[0].Unit.UnitID,
              Category: eles[0].RatebCategory,
              ServiceType: "راتب عالى",
              Moratab,
              Siasa,
              total,
              precOnSiasa:
                Siasa > 0 ? Math.round((total / Siasa) * 100) + "%" : "0%",
              precOnMortab:
                Moratab > 0 ? Math.round((total / Moratab) * 100) + "%" : "0%"
            });
          });

          let missed = allMortatabt.filter(
            ele =>
              !result.find(
                r =>
                  r.Unit == ele.Unit &&
                  r.Category == ele.Category &&
                  r.ServiceType == ele.ServiceType
              )
          );

          result = [...result, ...missed];

          result = Object.values(
            lodash.groupBy(result, ele => ele.Category + ele.Unit)
          ).map(eles => {
            let MoratabMogand =
                eles.find(ele => ele.ServiceType == "مجند")?.Moratab || 0,
              MoratabRateb =
                eles.find(ele => ele.ServiceType == "راتب عالى")?.Moratab || 0,
              Moratab = MoratabMogand + MoratabRateb,
              SiasaMogand =
                eles.find(ele => ele.ServiceType == "مجند")?.Siasa || 0,
              SiasaRateb =
                eles.find(ele => ele.ServiceType == "راتب عالى")?.Siasa || 0,
              Siasa = SiasaMogand + SiasaRateb,
              totalMogand =
                eles.find(ele => ele.ServiceType == "مجند")?.total || 0,
              totalRateb =
                eles.find(ele => ele.ServiceType == "راتب عالى")?.total || 0,
              total = totalRateb + totalMogand,
              precRatebOnMortab =
                MoratabRateb > 0
                  ? Math.round((totalRateb / MoratabRateb) * 100) + "%"
                  : "0%",
              precMogandOnMortab =
                MoratabMogand > 0
                  ? Math.round((MoratabMogand / MoratabMogand) * 100) + "%"
                  : "0%",
              precOnMortab =
                Moratab > 0 ? Math.round((total / Moratab) * 100) + "%" : "0%",
              precRatebOnSiasa =
                SiasaRateb > 0
                  ? Math.round((totalRateb / SiasaRateb) * 100) + "%"
                  : "0%",
              precMogandOnSiasa =
                SiasaMogand > 0
                  ? Math.round((totalMogand / SiasaMogand) * 100) + "%"
                  : "0%",
              precOnSiasa =
                Siasa > 0 ? Math.round((total / Siasa) * 100) + "%" : "0%";
            return {
              color: !eles.find(ele => ele.color == "error")
                ? "success"
                : "error",
              Unit: eles[0].Unit,
              UnitObj: eles[0].UnitObj,

              UnitID: eles[0].UnitID,
              Category: eles[0].Category,
              MoratabMogand,
              MoratabRateb,
              Moratab,
              SiasaMogand,
              SiasaRateb,
              Siasa,
              totalMogand,
              totalRateb,
              total,
              precRatebOnMortab,
              precMogandOnMortab,
              precOnMortab,
              precRatebOnSiasa,
              precMogandOnSiasa,
              precOnSiasa
            };
          });

          // totals
          let MoratabMogand = lodash.sumBy(result, ele => ele.MoratabMogand),
            MoratabRateb = lodash.sumBy(result, ele => ele.MoratabRateb),
            Moratab = MoratabMogand + MoratabRateb,
            SiasaMogand = lodash.sumBy(result, ele => ele.SiasaMogand),
            SiasaRateb = lodash.sumBy(result, ele => ele.SiasaRateb),
            Siasa = SiasaMogand + SiasaRateb,
            totalMogand = lodash.sumBy(result, ele => ele.totalMogand),
            totalRateb = lodash.sumBy(result, ele => ele.totalRateb),
            total = totalRateb + totalMogand,
            precRatebOnMortab =
              MoratabRateb > 0
                ? Math.round((totalRateb / MoratabRateb) * 100) + "%"
                : "0%",
            precMogandOnMortab =
              MoratabMogand > 0
                ? Math.round((totalMogand / MoratabMogand) * 100) + "%"
                : "0%",
            precOnMortab =
              Moratab > 0 ? Math.round((total / Moratab) * 100) + "%" : "0%",
            precRatebOnSiasa =
              SiasaRateb > 0
                ? Math.round((totalRateb / SiasaRateb) * 100) + "%"
                : "0%",
            precMogandOnSiasa =
              SiasaMogand > 0
                ? Math.round((totalMogand / SiasaMogand) * 100) + "%"
                : "0%",
            precOnSiasa =
              Siasa > 0 ? Math.round((total / Siasa) * 100) + "%" : "0%";

          result = [
            {
              Unit: "الاجمالي",
              MoratabMogand,
              MoratabRateb,
              Moratab,
              SiasaMogand,
              SiasaRateb,
              Siasa,
              totalMogand,
              totalRateb,
              total,
              precRatebOnMortab,
              precMogandOnMortab,
              precOnMortab,
              precRatebOnSiasa,
              precMogandOnSiasa,
              precOnSiasa
            },
            ...result
          ];

          this.$set(this, "totals", {
            Moratab: data.reduce((prev, ele) => prev + ele.Moratab, 0),
            Siasa: data.reduce((prev, ele) => prev + ele.Siasa, 0)
          });
          result = result.filter(
            ele =>
              !ele.Unit?.includes("ملغاه") ||
              !ele.Unit?.includes("-") ||
              !ele.Unit?.includes("بدون")
          );
          result = filters.SupplyLayer
            ? result.filter(ele =>
                ele.UnitObj?.SupplyLayer.includes(filters?.SupplyLayer)
              )
            : result;
          console.log(result);
          this.$set(
            this.mainTable,
            "items",
            result.filter(ele => ele.UnitObj?.statue?.includes("بالخدمة"))
          );
          this.$set(this.mainTable, "printer", {
            data: [
              ...result.filter(ele => ele.UnitObj?.statue?.includes("بالخدمة"))
            ],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(
              f => f.inTable && f.text.length
            ),
            hasParent: true
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

    actionAdd() {
      this.$set(this, "moratabat", {
        UnitID: this.moratabatDaily.UnitID,
        isEdit: false
      });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "moratabatDaily", {
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
