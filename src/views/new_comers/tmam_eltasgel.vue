<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :search="search"
      :addButton="false"
      title="بحث متقدم في تمام التسجيل"
    />

    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="''"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip class="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <!-- <v-btn icon @click="actionDelete(item)" color="error">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn> -->
        </v-chip>
      </template>
      <template v-slot:item.Sum="{ item }">
        <v-chip>{{
          item.High + item.Normal + item.Avg + item.AboveAvg
        }}</v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="headers"
      :selects="selects"
      :data="createdObject.item"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "new_commers",
  mounted() {
    this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
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
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {},
    searchLoading: false,
    headers: [
      {
        text: "المرحلة",
        value: "Stage",
        searchValue: "Stage",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        sort: 5
      },
      {
        text: "التوزيع",
        value: "Dist",
        searchValue: "Dist",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "عليا",
        value: "High",
        searchValue: "High",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "فوق متوسطة",
        value: "AboveAvg",
        searchValue: "AboveAvg",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "متوسطة",
        value: "Avg",
        searchValue: "Avg",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "عادة",
        value: "Normal",
        searchValue: "Normal",
        sortable: true,
        inSearch: false,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "الاجمالي",
        value: "Sum",
        searchValue: "Sum",
        sortable: true,
        inSearch: false,
        readOnly: true,
        inModel: true,
        inTable: true,
        sort: 5
      },
      {
        text: "",
        value: "actionsStart",
        searchValue: "",
        sortable: true,
        inSearch: false,
        inModel: false,
        inTable: true,
        sort: 5
      }
    ],
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {
      Stage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    },
    printer: {}
  }),

  watch: {
    "createdObject.item": {
      handler(val) {
        this.$set(
          this.createdObject.item,
          "Sum",
          +val.Normal + +val.Avg + +val.AboveAvg + +val.High
        );
      },
      deep: true
    }
  },
  methods: {
    async findItems(filters) {
      this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = { ...filters };

      if (!where.Stage) {
        this.showError("يجب اختيار المرحلة اولا");
        return;
      }
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "RegisterationEssurance",
          where
        });
        let data = x.data,
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inSearch)
          };

        if (data.length === 0) {
          [
            "المخطط",
            "ما تم وصوله للمركز",
            "ما تم تسجيله بفرع الافراد",
            "ما تم تسجيله بالشبكة العسكرية",
            "الموزعين حتي الان"
          ]
            .map(Dist => {
              return {
                Dist,
                High: 0,
                AboveAvg: 0,
                Avg: 0,
                Normal: 0,
                Sum: 0,
                Notes: "",
                Stage: this.search.Stage
              };
            })
            .forEach(ele => {
              this.api("global/create_one", {
                where: ele,
                table: "RegisterationEssurance"
              }).then(x => {});
            });
        }

        const levelMapping = {
          عليا: "High",
          "فوق متوسطة": "AboveAvg",
          متوسطه: "Avg",
          عادة: "Normal"
        };

        constants.KnowledgeLevel.data.map(({ text }, index) => {
          if (!levelMapping[text]) return;
          this.api("global/queryRunners", {
            query: `SELECT  SUM (NumberofArrivals) as Sum FROM NewComersArrivals where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' `
          }).then(data => {
            this.api("global/update_one", {
              where: {
                Dist: "ما تم وصوله للمركز",
                Stage: this.search.Stage
              },
              update: {
                [levelMapping[text]]: data.data[0].Sum
              },
              table: "RegisterationEssurance"
            }).then(x => {});
          });

          this.api("global/queryRunners", {
            query: `SELECT  COUNT(ID) as total FROM Soldier where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' and WeaponID = ${types.harsHododId}`
          }).then(data => {
            this.api("global/update_one", {
              where: {
                Dist: "ما تم تسجيله بفرع الافراد",
                Stage: this.search.Stage
              },
              update: {
                [levelMapping[text]]: data.data[0].total
              },
              table: "RegisterationEssurance"
            }).then(x => {});
          });

          this.api("global/queryRunners", {
            query: `SELECT Count(KnowledgeLevel) As 'Count' FROM Soldier where KnowledgeLevel = N'${text}' and RecuStage = N'${this.search.Stage}' AND UnitID != 0 and WeaponID = ${types.harsHododId}`
          }).then(data => {
            this.api("global/update_one", {
              where: {
                Dist: "الموزعين حتي الان",
                Stage: this.search.Stage
              },
              update: {
                [levelMapping[text]]: data.data[0].Count
              },
              table: "RegisterationEssurance"
            }).then(x => {});
          });
        });
        // this should be refactord to use async and awiat for all creates
        setTimeout(() => {
          this.api("global/get_all", {
            table: "RegisterationEssurance",
            where
          }).then(data => {
            this.$set(this, "searchLoading", false);
            this.$set(
              this,
              "items",
              data.data.map(ele => ({
                ...ele,
                Sum: ele.Sum
              }))
            );

            this.$set(this, "printer", {
              cons: [
                ...data.data.map(ele => ({
                  ...ele,
                  Sum: ele.Sum
                }))
              ],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inTable)
            });
          });
        }, 4000);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      }
    },
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionEdit(item) {
      if (
        ["المخطط", "ما تم تسجيله بالشبكة العسكرية"].indexOf(item.Dist) == -1
      ) {
        this.showError("لا يمكنك تعديل ذلك الصف");
        return null;
      }
      // console.log(item);
      this.$set(this.createdObject, "item", { ...item });
      this.$set(this.createdObject, "model", true);
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    saveItem() {
      this.api("global/update_one", {
        where: {
          Dist: this.createdObject.item.Dist,
          Stage: this.search.Stage
        },
        update: this.createdObject.item,
        table: "RegisterationEssurance"
      }).then(x => {
        // this.items[
        //   this.items.findIndex(ele => ele.Dist == this.createdObject.item.Dist)
        // ] = this.createdObject.item;
        this.$set(this.createdObject, "model", false);
        this.findItems(this.search);
        this.showSuccess("تم الحفظ");
      });
    }
  }
};
</script>
