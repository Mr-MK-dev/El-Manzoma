<template>
  <div class="Categories_Dailes">
    <v-card>
      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :loading="searchLoading"
        :wordFile="'/rateb/allHighlevelsDaily'"
        :isExcel="true"
        :title="'نتائج اليومية عددية المعاشة للراتب العالي'"
      >
      </table-bulider>
    </v-card>
  </div>
</template>

<style></style>

<script>
const lodash = require("lodash");
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
    text: "السلاح",
    value: "weapon",
    sortable: true,
    inTable: true,
    multiple: true,
    sort: 1
  },

  {
    text: "الفئة",
    value: "ratebCategory",
    searchValue: "ratebCategory",
    sortable: true,
    type: "select",
    inSearch: false,
    inTable: true,
    inModel: false,
    multiple: false,
    sort: 1
  }
];

export default {
  name: "allHighLevelDaily",
  props: {},
  async mounted() {
    await this.init();
    await this.findItems();
  },
  data: () => ({
    searchLoading: false,
    mainTable: {
      headers: [
        ...basicHeaders,
        ...[
          {
            text: "المرتب",
            value: "mortab",
            searchValue: "type",
            sortable: true,
            inSearch: false,
            inTable: true,
            inModel: false,
            multiple: true,
            sort: 1
          },
          {
            text: "السياسة",
            value: "siasa",
            searchValue: "type",
            sortable: true,
            inSearch: false,
            inTable: true,
            inModel: false,
            multiple: true,
            sort: 1
          },
          {
            text: "مساعد أ",
            value: "mos2dA",
            sortable: true,
            inTable: true,
            sort: 1
          },
          {
            text: "مساعد",
            value: "mos2d",
            sortable: true,
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب أ",
            value: "raqebA",
            sortable: true,
            inTable: true,
            sort: 1
          },
          {
            text: "رقيب",
            value: "raqeb",
            sortable: true,
            type: "select",
            inTable: true,
            sort: 1
          },
          {
            text: "عريف",
            value: "aref",
            sortable: true,
            type: "select",
            inTable: true,
            sort: 1
          },
          {
            text: "الأجمالي العام",
            value: "total",
            sortable: true,
            type: "select",
            inTable: true,
            sort: 1
          }
        ]
      ],
      items: [],
      printer: {}
    },
    componentName: "HighLevelDaily",
    selects: {}
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "search", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      let items = [];
      try {
        const rateb = await this.api("global/get_all", {
          table: "Rateb",
          include: [{ model: "Weapon" }],
          where: {
            Status: `بالخدمة`
          }
        });

        let ratebGroup = lodash.groupBy(
          rateb.data,
          ele => ele.Weapon?.Weapon + "_" + ele.RatebCategory
        );
        const mortabs = await this.api("global/get_all", {
          table: "MortabatDuties",
          where: {
            ServiceType: `راتب عالى`
          }
        });

        items = Object.values(ratebGroup).map(ele => {
          return {
            ratebCategory: ele[0].RatebCategory,
            weapon: ele[0].Weapon.Weapon,
            mortab: lodash.sumBy(
              mortabs.data.filter(
                mor =>
                  mor.WeaponID == ele[0].Weapon.WeaponID &&
                  mor.Category == ele[0].RatebCategory
              ),
              sum => sum.Moratab
            ),
            siasa: lodash.sumBy(
              mortabs.data.filter(
                mor =>
                  mor.WeaponID == ele[0].Weapon.WeaponID &&
                  mor.Category == ele[0].RatebCategory
              ),
              sum => sum.Siasa
            ),
            mos2dA: ele.filter(x => x.RatebLevel.includes("مساعد اول")).length,
            total: ele.length,
            mos2d: ele.filter(
              x =>
                x.RatebLevel.includes("مساعد") &&
                !x.RatebLevel.includes("مساعد اول")
            ).length,
            raqebA: ele.filter(x => x.RatebLevel.includes("رقيب اول")).length,
            raqeb: ele.filter(
              x =>
                x.RatebLevel.includes("رقيب") &&
                !x.RatebLevel.includes("رقيب اول")
            ).length,
            aref: ele.filter(x => x.RatebLevel.includes("عريف")).length
          };
        });
        console.log("result", items);

        items.push({
          ratebCategory: "الأجمالي",
          mortab: lodash.sumBy(items, ele => ele.mortab),
          siasa: lodash.sumBy(items, ele => ele.siasa),
          mos2dA: lodash.sumBy(items, ele => ele.mos2dA),
          mos2d: lodash.sumBy(items, ele => ele.mos2d),
          raqebA: lodash.sumBy(items, ele => ele.raqebA),
          raqeb: lodash.sumBy(items, ele => ele.raqeb),
          aref: lodash.sumBy(items, ele => ele.aref),
          total: lodash.sumBy(items, ele => ele.total)
        });

        this.$set(this.mainTable, "items", items);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        console.log(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }

      this.$set(this, "searchLoading", false);
    }
  }
};
</script>
