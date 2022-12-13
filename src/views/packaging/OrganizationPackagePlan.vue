<template>
  <div>
    <v-card-title>
      <v-btn
        @click="
          toOrganizationPlanDetails({
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
      <v-btn @click="toOrganizationCategoryDaily()" large color="primary">
        عرض يومية التخصصات
      </v-btn>
      <v-btn @click="toCompleteCityDaily()" large color="primary">
        عرض يومية المحافظات
      </v-btn>
      <v-btn @click="toRecuRegionDaily()" large color="primary">
        عرض يومية مناطق التجنيد
      </v-btn>
      <v-btn @click="toRecuEndDatesDaily()" large color="primary">
        عرض يومية بدفعات الرديف
      </v-btn>
      <v-btn @click="toJobReport()" large color="primary">
        عرض تقرير الوظائف للوحدات
      </v-btn>
      <v-btn @click="toPackagePlanReports()" large color="primary">
        عرض تقرير نجاح خطة إحتياط رئيس الهيئة
      </v-btn>
      <v-btn @click="toAllJobsReport()" large color="primary">
        عرض يومية عددية لكل الوظائف
      </v-btn>
    </v-card-title>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطة رئيس الهيئة 1 '"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.details="{ item }">
        <v-chip color="primary" @click="toOrganizationPlanDetails(item)">
          {{ "التفاصيل" }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="'تعديل الخطة الخاصة وحدة'"
      :open="createdObject.model"
      :fields="mainTable.headers"
      :data="organizationPlanUnit"
      @on-close="createdObject.model = false"
      @on-submit="saveEditedUnit()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "OrganizationPackagePlan",
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
    organizationPlanUnit: {},
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
        table: "OrganizationPlanUnit",
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
    toOrganizationCategoryDaily() {
      this.$router.push(
        `/PlanCategoryDaily/${this.$route.params.id}/"organization"`
      );
    },
    toOrganizationPlanDetails(item) {
      this.$router.push(
        `/organizationPlanDetails/${item.PackagePlanID}/${item.UnitID}`
      );
    },
    toCompleteCityDaily() {
      this.$router.push(`/CityDaily/${this.$route.params.id}/"organization"`);
    },
    toRecuRegionDaily() {
      this.$router.push(
        `/RecuRegionDaily/${this.$route.params.id}/"organization"`
      );
    },
    toRecuEndDatesDaily() {
      this.$router.push(
        `/RecuEndDatesDaily/${this.$route.params.id}/"organization"`
      );
    },
    toJobReport() {
      this.$router.push(`/JobReport/${this.$route.params.id}/"organization"`);
    },
    toAllJobsReport() {
      this.$router.push(
        `/AllJobsReport/${this.$route.params.id}/"organization"`
      );
    },
    toPackagePlanReports() {
      this.$router.push(
        `/PackagingPlanReports/${this.$route.params.id}/"organization"`
      );
    },
    async saveEditedUnit() {
      console.log("Unit", this.organizationPlanUnit);
      let saveitem = await this.api("global/update_one", {
        table: "OrganizationPlanUnit",
        where: {
          ID_KEY: this.organizationPlanUnit.ID_KEY
        },
        update: this.organizationPlanUnit
      });

      if (saveitem) {
        this.showSuccess("تم بنجاح");
        this.$set(this.createdObject, "model", false);
        this.findItems({});
      }
    },

    actionEdit(item) {
      this.$set(this, "organizationPlanUnit", {
        ...item,
        isEdit: true,
        UnitName: item.Unit.Unit
      });
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
