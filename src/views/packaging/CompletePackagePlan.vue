<template>
  <div>
    <v-card-title>
      <v-btn
        @click="
          toCompletePlanDetails({
            PackagePlanID: $route.params.id,
            UnitID: 0
          })
        "
        large
        color="primary"
      >
        عرض الخطة كاملة
      </v-btn>
    </v-card-title>
    <v-card-title>
      <v-btn @click="toCompleteCategoryDaily()" large color="primary">
        عرض يومية التخصصات
      </v-btn>
      <v-btn @click="toCompleteCityDaily()" large color="primary">
        عرض يومية المحافظات
      </v-btn>
      <v-btn @click="toCompleteRecuRegionDaily()" large color="primary">
        عرض يومية بمنطاق التجنيد
      </v-btn>
      <v-btn @click="toCompleteRecuEndDatesDaily()" large color="primary">
        عرض يومية بدفعات الرديف
      </v-btn>
      <v-btn @click="toJobReport()" large color="primary">
        عرض تقرير الوظائف للوحدات
      </v-btn>
      <v-btn @click="toPackagePlanReports()" large color="primary">
        عرض تقرير نجاح خطة الإستكمال
      </v-btn>
      <v-btn @click="toAllJobsReport()" large color="primary">
        عرض يومية عددية لكل الوظائف
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطط الاستكمال'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.details="{ item }">
        <v-chip color="primary" @click="toCompletePlanDetails(item)">
          {{ "التفاصيل" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'تعديل الخطة الخاصة وحدة'"
      :open="createdObject.model"
      :fields="mainTable.headers"
      :data="completePlanUnit"
      @on-close="createdObject.model = false"
      @on-submit="saveEditedUnit()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "CompletePackagePlan",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.findItems();
  },
  data: () => ({
    completePlanUnit: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "كود التعبئة",
          value: "PackageCode",
          searchValue: "PackageCode",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "محطة الوصول",
          value: "ArrivalPoint",
          searchValue: "ArrivalPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "منطقة التمركز",
          value: "CenteringPoint",
          searchValue: "CenteringPoint",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مرتب الحرب للجنود",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الموجود الفعلي للجنود",
          value: "Mawgod",
          searchValue: "Mawgod",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مرتب التعبئة",
          value: "PackagingMoratab",
          searchValue: "PackagingMoratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نسبة التخلفات",
          value: "AbsenetPercentage",
          searchValue: "AbsenetPercentage",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "اجمالي المطلوب",
          value: "TotalRequired",
          searchValue: "TotalRequired",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "المعين بالخطة",
          value: "AssignedPerPlan",
          searchValue: "AssignedPerPlan",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التفاصيل",
          value: "details",
          searchValue: "details",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };
      let data = await this.api("global/get_all", {
        table: "CompletePlanUnit",
        where: {
          PackagePlanID: this.$route.params.id
        },
        include: [{ model: "Unit" }]
      });

      let printer = {
        cons: [...data.data],
        excelKey: "cons",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
      this.$set(this.mainTable, "printer", printer);
      this.$set(this.mainTable, "items", data.data);
    },

    async saveEditedUnit() {
      console.log("Unit", this.completePlanUnit);
      let saveitem = await this.api("global/update_one", {
        table: "CompletePlanUnit",
        where: {
          ID_KEY: this.completePlanUnit.ID_KEY
        },
        update: this.completePlanUnit
      });

      if (saveitem) {
        this.showSuccess("تم بنجاح");
        this.$set(this.createdObject, "model", false);
        this.findItems({});
      }
    },

    actionEdit(item) {
      this.$set(this, "completePlanUnit", {
        ...item,
        isEdit: true,
        UnitName: item.Unit.Unit
      });
      this.$set(this.createdObject, "model", true);
    },
    toCompletePlanDetails(item) {
      this.$router.push(
        `/CompletePlanDetails/${item.PackagePlanID}/${item.UnitID}`
      );
    },
    toCompleteCategoryDaily() {
      this.$router.push(
        `/PlanCategoryDaily/${this.$route.params.id}/"complete"`
      );
    },
    toCompleteCityDaily() {
      this.$router.push(`/CityDaily/${this.$route.params.id}/"complete"`);
    },
    toCompleteRecuRegionDaily() {
      this.$router.push(`/RecuRegionDaily/${this.$route.params.id}/"complete"`);
    },
    toCompleteRecuEndDatesDaily() {
      this.$router.push(
        `/RecuEndDatesDaily/${this.$route.params.id}/"complete"`
      );
    },
    toJobReport() {
      this.$router.push(`/JobReport/${this.$route.params.id}/"complete"`);
    },
    toPackagePlanReports() {
      this.$router.push(
        `/PackagingPlanReports/${this.$route.params.id}/"complete"`
      );
    },
    toAllJobsReport() {
      this.$router.push(`/AllJobsReport/${this.$route.params.id}/"complete"`);
    }
  }
};
</script>
