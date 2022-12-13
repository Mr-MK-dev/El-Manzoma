<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="يومية ملاحق المرحلة"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية الملاحق'"
      :wordFile="'/enrollers/enrollers_recu_dailies_by_workplace'"
      :isExcel="true"
    >
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "enrollersRecuDialies",
  props: {},
  async mounted() {
    await this.init();
    this.selects.RecuEndDate.data = await this.fetchAvailableServiceEndDates();
  },
  data: () => ({
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
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "تاريخ التسريح",
          value: "RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          multiple: false,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 5
        },
        {
          text: "مكان العمل",
          value: "workplace",
          searchValue: "workplace",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الموجود",
          value: "current",
          searchValue: "current",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المسرح",
          value: "leavers",
          searchValue: "leavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الموجود بعد المسرح",
          value: "remainders",
          searchValue: "remainders",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "العدد المصدق عليه",
          value: "certifiedNumber",
          searchValue: "certifiedNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التفيذ عليا",
          value: "highExcuted",
          searchValue: "highExcuted",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التفيذ متوسطة",
          value: "averageExcuted",
          searchValue: "averageExcuted",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التفيذ فوق المتوسطة",
          value: "aboveAverageExcuted",
          searchValue: "aboveAverageExcuted",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التفيذ عادة",
          value: "normiesExcuted",
          searchValue: "normiesExcuted",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "إجمالي المؤهلات",
          value: "totalExcuted",
          searchValue: "totalExcuted",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الموجود الفعلي",
          value: "totalAfterLeavers",
          searchValue: "totalAfterLeavers",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "المتبقي",
          value: "remainingAfterCertified",
          searchValue: "remainingAfterCertified",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      }
    },
    printer: {}
  }),
  watch: {},
  methods: {
    //   this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);

    async findItems(filters) {
      if (!filters.RecuStage) {
        return this.showError("يرجى اختيار المرحلة");
      }
      console.log(filters.RecuEndDate);
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      let planData = await this.api("global/get_one", {
        table: "enrollersPlanList",
        where: {
          RecuStage: filters.RecuStage
        },
        include: [{ model: "enrollersPlanDetails" }]
      });

      let suggested = await this.api("global/get_all", {
        table: "Followers",
        where: {
          RecuStage: filters.RecuStage,
          Acceptance : true
        },
        include: [
          {
            model: "Soldier"
          }
        ]
      });
      if (!planData.data) {
        return this.showError("هذه المرحلة ليس لها مخطط الحاق");
      }

      let dateAfterTwoMonth = new Date(filters.RecuEndDate);
      dateAfterTwoMonth.setMonth(dateAfterTwoMonth.getMonth() + 2);

      this.api("global/get_all", {
        table: "followersolider",
        where: {
          isEnrolled: 1
        },
        include: [
          {
            model: "followerwork"
          },
          {
            model: "Soldier",
            where: this.cleanObject({
              Status: "بالخدمة"
            })
          }
        ]
      })
        .then(x => {
          let groupedData = lodash.groupBy(x.data, ele => ele.workplace);
          let items = [];
          Object.keys(groupedData).forEach(key => {
            items.push({
              workplace: groupedData[key][0].followerwork.workplace,
              current: groupedData[key].length,
              leavers: groupedData[key].filter(
                ele =>
                  ele.Soldier.RecuEndDate == filters.RecuEndDate ||
                  ele.Soldier.RecuEndDate == this.formatDate(dateAfterTwoMonth)
              ).length,
              remainders:
                groupedData[key].length -
                groupedData[key].filter(
                  ele =>
                    ele.Soldier.RecuEndDate == filters.RecuEndDate ||
                    ele.Soldier.RecuEndDate ==
                      this.formatDate(dateAfterTwoMonth)
                ).length,
              certifiedNumber:
                planData.data.enrollersPlanDetails.find(
                  ele => ele.WorkPlaceID == key
                ).CertfiedNumber ?? 0,
              highExcuted: suggested.data.filter(
                ele =>
                  ele.WorkPlaceID == key && ele.Soldier.KnowledgeLevel == "عليا"
              ).length,
              averageExcuted: suggested.data.filter(
                ele =>
                  ele.WorkPlaceID == key &&
                  ele.Soldier.KnowledgeLevel == "متوسطه"
              ).length,
              aboveAverageExcuted: suggested.data.filter(
                ele =>
                  ele.WorkPlaceID == key &&
                  ele.Soldier.KnowledgeLevel == "فوق متوسطة"
              ).length,
              normiesExcuted: suggested.data.filter(
                ele =>
                  ele.WorkPlaceID == key && ele.Soldier.KnowledgeLevel == "عادة"
              ).length
            });
          });
          console.log("items", items);
          items = items.map(ele => ({
            ...ele,
            totalExcuted:
              ele.highExcuted +
              ele.averageExcuted +
              ele.aboveAverageExcuted +
              ele.normiesExcuted
          }));
          items = items.map(ele => ({
            ...ele,
            totalAfterLeavers: ele.totalExcuted + ele.remainders,
            remainingAfterCertified: ele.certifiedNumber - ele.totalExcuted
          }));
          console.log("items", items);

          items.push({
            workplace: "الاجمالي",
            current: lodash.sumBy(items, ele => ele.current),
            leavers: lodash.sumBy(items, ele => ele.leavers),
            remainders: lodash.sumBy(items, ele => ele.remainders),
            certifiedNumber: lodash.sumBy(items, ele => ele.certifiedNumber),
            highExcuted: lodash.sumBy(items, ele => ele.highExcuted),
            averageExcuted: lodash.sumBy(items, ele => ele.averageExcuted),
            aboveAverageExcuted: lodash.sumBy(
              items,
              ele => ele.aboveAverageExcuted
            ),
            normiesExcuted: lodash.sumBy(items, ele => ele.normiesExcuted),
            totalExcuted: lodash.sumBy(items, ele => ele.totalExcuted),
            totalAfterLeavers: lodash.sumBy(
              items,
              ele => ele.totalAfterLeavers
            ),
            remainingAfterCertified: lodash.sumBy(
              items,
              ele => ele.remainingAfterCertified
            )
          });

          console.log(groupedData);

          this.$set(this.mainTable, "items", items);
          this.$set(this.mainTable, "printer", {
            data: items,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });

          // this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log("ERROR", error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
