<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      addBtnTitle=""
      title="بحث متقدم في تمام القائد"
    />

    <v-card class="mt-8">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th v-for="item in groupedValue" :key="item.name">
                {{ item.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="item in groupedValue" :key="item.name">
                {{ item.value }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="' تمامات الوصول'"
        :wordFile="'/new_commers/leader_tmam'"
      >
        <template v-slot:item.editor="{ item }">
          <v-chip class="transparent">
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
      </table-bulider>
    </v-card>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "LeaderTmam",
  mounted() {
    // console.log("hasEditAccess", this.hasEditAccess());
    this.init();
  },
  data: () => ({
    groupedValue: [],
    subjectLimit: 10,
    search: {
      Date: new Date()
    },
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 5
        },
        {
          text: "عليا",
          value: "HighArrived",
          searchValue: "HighArrived",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "فوق متوسطة",
          value: "AboveAvgArrived",
          searchValue: "AboveAvgArrived",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: " متوسطة",
          value: "AvgArrived",
          searchValue: "AvgArrived",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "عادة",
          value: "NormalArrived",
          searchValue: "NormalArrived",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "الاجمالي",
          value: "TotalArrived",
          searchValue: "TotalArrived",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 4
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegion",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 4
        }
      ],
      items: [],
      printer: {}
    },

    componentName: "createdObject",
    selects: {
      RecuRegion: {
        text: "text",
        value: "text",
        data: constants.RecuRegion.data
      },
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    },
    printer: {}
  }),
  methods: {
    async findItems(filters) {
      this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };
      if (!where.RecuStage) {
        this.showError("يجب اختيار المرحلة اولا");
        return;
      }
      try {
        const x = await this.api("global/get_all", {
          table: "NewComersArrivals",
          where: {
            RecuStage: filters.RecuStage
          }
        });
        let data = x.data;
        console.log(
          "arrival data",
          lodash.groupBy(data, ele => ele.RecuRegion)
        );
        const groupedValues = {};
        let groupedByRegion = lodash.groupBy(data, ele => ele.RecuRegion);
        let returnedData = [];
        Object.keys(groupedByRegion).map(item => {
          returnedData.push({
            RecuRegion: item,
            HighArrived: lodash.sumBy(
              groupedByRegion[item].filter(ele => ele.KnowledgeLevel == "عليا"),
              el => el.NumberofArrivals
            ),
            AboveAvgArrived: lodash.sumBy(
              groupedByRegion[item].filter(
                ele => ele.KnowledgeLevel == "فوق متوسطة"
              ),
              el => el.NumberofArrivals
            ),
            AvgArrived: lodash.sumBy(
              groupedByRegion[item].filter(
                ele => ele.KnowledgeLevel == "متوسطه"
              ),
              el => el.NumberofArrivals
            ),
            NormalArrived: lodash.sumBy(
              groupedByRegion[item].filter(ele => ele.KnowledgeLevel == "عادة"),
              el => el.NumberofArrivals
            ),
            TotalArrived: lodash.sumBy(
              groupedByRegion[item],
              el => el.NumberofArrivals
            )
          });
        });
        returnedData.push({
          RecuRegion: "الاجمالي",
          HighArrived: lodash.sumBy(
            data.filter(ele => ele.KnowledgeLevel == "عليا"),
            el => el.NumberofArrivals
          ),
          AboveAvgArrived: lodash.sumBy(
            data.filter(ele => ele.KnowledgeLevel == "فوق متوسطة"),
            el => el.NumberofArrivals
          ),
          AvgArrived: lodash.sumBy(
            data.filter(ele => ele.KnowledgeLevel == "متوسطه"),
            el => el.NumberofArrivals
          ),
          NormalArrived: lodash.sumBy(
            data.filter(ele => ele.KnowledgeLevel == "عادة"),
            el => el.NumberofArrivals
          ),
          TotalArrived: lodash.sumBy(data, el => el.NumberofArrivals)
        });

        let plan = await this.api("global/get_one", {
          table: "RegisterationEssurance",
          where: this.cleanObject({
            Stage: filters.RecuStage,
            Dist: "المخطط"
          })
        });

        let arrivalDates = await this.api("global/get_one", {
          table: "ArrivalToTrainingCenterDates",
          where: {
            RecuStage: filters.RecuStage
          }
        });

        console.log("plan", plan);

        if (plan) {
          this.$set(this, "groupedValue", []);
          this.groupedValue.push({
            title: "عليا",
            value: plan.data.High
          });
          this.groupedValue.push({
            title: "فوق متوسطة",
            value: plan.data.AboveAvg
          });
          this.groupedValue.push({
            title: "متوسطة",
            value: plan.data.Avg
          });
          this.groupedValue.push({
            title: "عادة",
            value: plan.data.Normal
          });

          this.groupedValue.push({
            title: "الاجمالي",
            value: plan.data.Sum
          });
        }

        let printer = {
          data: returnedData,
          date: this.formatDatewithSlash(new Date()),
          high: plan.data.High,
          aboveAvg: plan.data.AboveAvg,
          avg: plan.data.Avg,
          normal: plan.data.Normal,
          sum: plan.data.Sum,
          highDate: arrivalDates.data.HighDateArrival,
          aboveAvgDate: arrivalDates.data.AboveAvgDateArrival,
          avgDate: arrivalDates.data.AvgDateArrival,
          normalDate: arrivalDates.data.NormalDateArrival,
          highLeave: arrivalDates.data.HighDateLeave,
          aboveAvgLeave: arrivalDates.data.AboveAvgDateLeave,
          avgLeave: arrivalDates.data.AvgDateLeave,
          normalLeave: arrivalDates.data.NormalDateLeave,
          RecuStage: where.RecuStage.replaceAll("-", " "),
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable)
        };

        this.$set(this.mainTable, "items", returnedData);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
