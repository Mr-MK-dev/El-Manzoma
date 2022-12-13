<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'تقرير نجاح الخطة'"
      :isExcel="true"
    >
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "JobReport",

  components: {},

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
  },

  mounted() {
    this.initWithoutChecking();
    this.findItems({});
  },

  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    listType: "all",
    searchLoading: false,
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "PackagedUnitName",
          searchValue: "PackagedUnitName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "كود التعبئة",
          value: "PackagedUnitPackageCode",
          searchValue: "PackagedUnitPackageCode",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "محطة الوصول",
          value: "PackagedUnitArrivalPoint",
          searchValue: "PackagedUnitArrivalPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "منطقة الوصول",
          value: "PackagedUnitCenteringPoint",
          searchValue: "PackagedUnitCenteringPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مرتب حرب المجند",
          value: "moratab",
          searchValue: "moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الموجود الفعلي للمجند",
          value: "SoldierNumber",
          searchValue: "SoldierNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "مرتب التعبئة",
          value: "moratabPackaging",
          searchValue: "moratabPackaging",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "نسبة التخلفات",
          value: "BehindPrecentage",
          searchValue: "BehindPrecentage",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "إجمالي المطلوب",
          value: "TotalMatlob",
          searchValue: "TotalMatlob",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "المعين بالخطة",
          value: "Available",
          searchValue: "Available",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      let CompletePlan = await this.api("global/get_all", {
        table: "CompletePlanUnit",
        where: {
          PackagePlanID: this.$route.params.id
        }
      });
      CompletePlan = CompletePlan.data;
      this.api("global/get_all", {
        table: "JobPackagingDaily",
        include: [
          {
            model: "Unit"
          }
        ],
        where: this.cleanObject({
          PackagePlanID: this.$route.params.id,
          DailyType: this.$route.params.DailyType
        })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let SoldierGroupedByPackagedUnit = lodash.groupBy(
            data,
            ele => ele.UnitID
          );
          let d = Object.keys(SoldierGroupedByPackagedUnit).map(key => ({
            PackagedUnitID: key,
            PackagedUnitName: SoldierGroupedByPackagedUnit[key][0].Unit.Unit,
            PackagedUnitPackageCode: CompletePlan.find(
              ele =>
                ele.UnitID == SoldierGroupedByPackagedUnit[key][0].Unit.UnitID
            ).PackageCode,
            PackagedUnitArrivalPoint: CompletePlan.find(
              ele =>
                ele.UnitID == SoldierGroupedByPackagedUnit[key][0].Unit.UnitID
            ).ArrivalPoint,
            PackagedUnitCenteringPoint: CompletePlan.find(
              ele =>
                ele.UnitID == SoldierGroupedByPackagedUnit[key][0].Unit.UnitID
            ).CenteringPoint,
            moratab: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.moratab
            ),
            SoldierNumber: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.SoldierNumber
            ),
            moratabPackaging: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.moratabPackaging
            ),
            BehindPrecentage: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.BehindPrecentage
            ),
            TotalMatlob: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.TotalMatlob
            ),
            Available: lodash.sumBy(
              SoldierGroupedByPackagedUnit[key],
              ele => ele.Available
            ),
            PackageID: SoldierGroupedByPackagedUnit[key][0].PackageID
          }));

          d.push({
            PackagedUnitCenteringPoint: "الأجمالي",
            moratab: lodash.sumBy(d, ele => ele.moratab),
            SoldierNumber: lodash.sumBy(d, ele => ele.SoldierNumber),
            moratabPackaging: lodash.sumBy(d, ele => ele.moratabPackaging),
            BehindPrecentage: lodash.sumBy(d, ele => ele.BehindPrecentage),
            TotalMatlob: lodash.sumBy(d, ele => ele.TotalMatlob),
            Available: lodash.sumBy(d, ele => ele.Available)
          });
          console.log("sgdp", SoldierGroupedByPackagedUnit);

          this.$set(this.mainTable, "items", d);
          this.$set(this.mainTable, "printer", {
            cons: [...d],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
