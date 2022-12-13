<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="null"
      :clearOption="true"
      title="بحث متقدم في المواقف  للمجندين"
      addBtnTitle=""
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المستجدين بدون مواقف'"
    >
    </table-bulider>
    <table-bulider
      :headers="secondTable.headers"
      :printer="secondTable.printer"
      :items="secondTable.items"
      :title="'المواقف '"
    >
    </table-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  components: {},
  name: "tmam_elthr7el",
  async mounted() {
    this.init();
    this.selects.RecuStage.data = await this.fetchAvailableServiceEndDates();


  },
  filters: {},
  data: () => ({
    Trahel: {},
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
          inModel: false,
          sort: 1
        },
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
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "Unit",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },
    secondTable: {
      headers: [
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
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
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit",
          searchValue: "Unit",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الموقف",
          value: "SituationType",
          searchValue: "SituationType",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات عن الموقف",
          value: "SituationNotes",
          searchValue: "SituationNotes",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: []
    },

    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    },
    printer: {}
  }),
  watch: {},
  methods: {
    log(item) {
      console.log("====================================");
      console.log("item", item);
      console.log("====================================");
    },

    async findItems(filters) {
      console.log(filters);
      try {
        if (!filters.RecuStage) {
          this.showError("يجب اختيار المرحلة ");
          return;
        }

        let security = await this.api("global/get_all", {
          table: "SoldierSecuritySituations",
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                RecuStage: filters.RecuStage
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });
        let medical = await this.api("global/get_all", {
          table: "SoldiersMedicalSituations",
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                RecuStage: filters.RecuStage
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });
        console.log("medical", medical);
        let phsycological = await this.api("global/get_all", {
          table: "SoldiersPhsycoligicalSituations",
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                RecuStage: filters.RecuStage
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });
        let selctions = await this.api("global/get_all", {
          table: "SoldiersSelectionSituations",
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                RecuStage: filters.RecuStage
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ]
        });

        let allSoldiers = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            RecuStage: filters.RecuStage
          }),
          include: [
            {
              model: "Unit"
            }
          ]
        });

        let situationItems = [
          ...security.data.map(ele => {
            return {
              ID: ele.ID,
              Name: ele.Soldier.Name,
              Unit: ele.Soldier.Unit.Unit,
              SituationType: "موقف امني",
              SituationNotes: ele.Notes
            };
          }),
          ...medical.data.map(ele => {
            return {
              ID: ele.ID,
              Name: ele.Soldier.Name,
              Unit: ele.Soldier.Unit.Unit,
              SituationType: "موقف طبي",
              SituationNotes: ele.Notes
            };
          }),
          ...phsycological.data.map(ele => {
            return {
              ID: ele.ID,
              Name: ele.Soldier.Name,
              Unit: ele.Soldier.Unit.Unit,
              SituationType: "موقف نفسي",
              SituationNotes: ele.Notes
            };
          }),
          ...selctions.data.map(ele => {
            return {
              ID: ele.ID,
              Name: ele.Soldier.Name,
              Unit: ele.Soldier.Unit.Unit,
              SituationType: "انتقاء",
              SituationNotes: ele.Notes
            };
          })
        ];

        this.$set(this.secondTable, "items", situationItems);
        let withoutData = allSoldiers.data
          .filter(ele => {
            return !situationItems.find(item => item.ID == ele.ID);
          })
          .map(ele => {
            return {
              ID: ele.ID,
              Name: ele.Name,
              Unit: ele.Unit.Unit
            };
          });
        this.$set(this.mainTable, "items", withoutData);
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
    }
  }
};
</script>
