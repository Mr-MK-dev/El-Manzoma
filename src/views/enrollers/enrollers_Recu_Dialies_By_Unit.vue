<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="  يومية ملاحق المرحلة بالوحدة"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'يومية ملاحق المرحلة بالوحدة'"
      :wordFile="'/enrollers/enrollers_recu_dailies_by_unit'"
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
  name: "enrollersRecuDialiesByUnit",
  props: {},
  async mounted() {
    await this.init();
    this.selects.RecuEndDate.data =await this.fetchAvailableServiceEndDates();
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
          text: "التجميعات القتالية",
          value: "Collections",
          searchValue: "CollectionID",
          sortable: true,
          type: "select",
          multiple: false,
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "الاتجاه",
          value: "direction",
          searchValue: "direction",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "unit",
          searchValue: "unit",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الملحق منها",
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
          text: "الملحق بعد المسرح",
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
      UnitID: {
        text: "Unit",
        value: "UnitID",
        table: "Unit"
      },
      RecuEndDate: {
        text: "text",
        value: "value",
        data: []
      },
      CollectionID: {
        text: "Name",
        value: "ID_KEY",
        table: "UnitCollections"
      },
    },
    printer: {}
  }),
  watch: {},
  methods: {
    //   this.search.RecuEndDate = result.data.map(ele => ele.RecuEndDate);

    async findItems(filters) {
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
          Acceptance :true
        },
        include: [
          {
            model: "Soldier",
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
      });


      console.log("Suggested" , suggested.data);
      let dateAfterTwoMonth = new Date(filters.RecuEndDate);
      dateAfterTwoMonth.setMonth(dateAfterTwoMonth.getMonth() + 2);

      let unitIDs = this.selects.UnitID.data.map(ele=>ele.UnitID) ;
      if(filters.CollectionID){
        let data = await this.api("global/get_all", {
          table: "UnitCollectionPivot",
          where: {CollectionId: filters.CollectionID}
        });
      unitIDs = data.data.map(ele => ele.UnitID);
      }

      let units = await this.api("global/get_all" , {
        table :"Unit",
        where : {
          statue  :"بالخدمة",
          UnitID :{$in :unitIDs}
        }
      });

      console.log("Units" , units.data)


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
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
      })
        .then(x => {
          console.log(x.data);

           let groupedData = lodash.groupBy(
            x.data,
            ele => ele.Soldier.Unit.UnitID
          );
          let items = [];

          units.data.forEach(unit=>{
            items.push({
              direction: unit.Directionforunit,
              unit: unit.Unit,
              current: groupedData[unit.UnitID] ? groupedData[unit.UnitID].length :0,
              leavers:groupedData[unit.UnitID] ? groupedData[unit.UnitID].filter(
                  ele =>
                      ele.Soldier.RecuEndDate == filters.RecuEndDate ||
                      ele.Soldier.RecuEndDate == this.formatDate(dateAfterTwoMonth)
              ).length:0,
              remainders:groupedData[unit.UnitID] ?
                  groupedData[unit.UnitID].length -
                  groupedData[unit.UnitID].filter(
                      ele =>
                          ele.Soldier.RecuEndDate == filters.RecuEndDate ||
                          ele.Soldier.RecuEndDate ==
                          this.formatDate(dateAfterTwoMonth)
                  ).length:0,
              // certifiedNumber: planData.data.enrollersPlanDetails.filter(
              //   ele => ele.WorkPlaceID == unit.UnitID
              // )[0].CertfiedNumber,
              highExcuted: suggested.data.filter(
                  ele =>
                      ele.Soldier.Unit.UnitID == unit.UnitID &&
                      ele.Soldier.KnowledgeLevel == "عليا"
              ).length,
              averageExcuted: suggested.data.filter(
                  ele =>
                      ele.Soldier.Unit.UnitID == unit.UnitID &&
                      ele.Soldier.KnowledgeLevel == "متوسطه"
              ).length,
              aboveAverageExcuted: suggested.data.filter(
                  ele =>
                      ele.Soldier.Unit.UnitID == unit.UnitID &&
                      ele.Soldier.KnowledgeLevel == "فوق متوسطة"
              ).length,
              normiesExcuted: suggested.data.filter(
                  ele =>
                      ele.Soldier.Unit.UnitID == unit.UnitID &&
                      ele.Soldier.KnowledgeLevel == "عادة"
              ).length
            });

          });

          // Object.unit.UnitIDs(groupedData).forEach(key => {
          //   items.push({
          //     direction: groupedData[key][0].Soldier.Directionforunit,
          //     unit: groupedData[key][0].Soldier.Unit.Unit,
          //     current: groupedData[key].length,
          //     leavers: groupedData[key].filter(
          //       ele =>
          //         ele.Soldier.RecuEndDate == filters.RecuEndDate ||
          //         ele.Soldier.RecuEndDate == this.formatDate(dateAfterTwoMonth)
          //     ).length,
          //     remainders:
          //       groupedData[key].length -
          //       groupedData[key].filter(
          //         ele =>
          //           ele.Soldier.RecuEndDate == filters.RecuEndDate ||
          //           ele.Soldier.RecuEndDate ==
          //             this.formatDate(dateAfterTwoMonth)
          //       ).length,
          //     // certifiedNumber: planData.data.enrollersPlanDetails.filter(
          //     //   ele => ele.WorkPlaceID == key
          //     // )[0].CertfiedNumber,
          //     highExcuted: suggested.data.filter(
          //       ele =>
          //         ele.Soldier.Unit.UnitID == key &&
          //         ele.Soldier.KnowledgeLevel == "عليا"
          //     ).length,
          //     averageExcuted: suggested.data.filter(
          //       ele =>
          //         ele.Soldier.Unit.UnitID == key &&
          //         ele.Soldier.KnowledgeLevel == "متوسطه"
          //     ).length,
          //     aboveAverageExcuted: suggested.data.filter(
          //       ele =>
          //         ele.Soldier.Unit.UnitID == key &&
          //         ele.Soldier.KnowledgeLevel == "فوق متوسطة"
          //     ).length,
          //     normiesExcuted: suggested.data.filter(
          //       ele =>
          //         ele.Soldier.Unit.UnitID == key &&
          //         ele.Soldier.KnowledgeLevel == "عادة"
          //     ).length
          //   });
          // });

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
            totalAfterLeavers: ele.totalExcuted + ele.remainders
          }));
          console.log(groupedData, groupedData);
          items.push({
            direction: "المجموع",
            unit: "اجمالي الوحدات",
            current: lodash.sumBy(items, ele => ele.current),
            leavers: lodash.sumBy(items, ele => ele.leavers),
            remainders: lodash.sumBy(items, ele => ele.remainders),
            // certifiedNumber: planData.data.enrollersPlanDetails.filter(
            //   ele => ele.WorkPlaceID == key
            // )[0].CertfiedNumber,
            highExcuted: lodash.sumBy(items, ele => ele.highExcuted),
            averageExcuted: lodash.sumBy(items, ele => ele.averageExcuted),
            aboveAverageExcuted: lodash.sumBy(
              items,
              ele => ele.aboveAverageExcuted
            ),
            normiesExcuted: lodash.sumBy(items, ele => ele.normiesExcuted),
            totalExcuted: lodash.sumBy(items, ele => ele.totalExcuted),
            totalAfterLeavers: lodash.sumBy(items, ele => ele.totalAfterLeavers)
          });

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
