<template>
  <div>
    <search-bulider
      :fields="newCommersTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      @on-add="actionAdd()"
      addBtnTitle="إضافة تمام جديد"
      title="بحث متقدم في تمام وصول المستجدين"
    />
    <v-btn
      class="px-6"
      @click="calculateRecRegionWithKnowloadage"
      large
      color="primary"
      v-text="'عرض اليومية العددية للافراد المستجدين'"
    ></v-btn>

    <v-dialog
      persistent
      v-model="newCommersStatesTable.isDisplayed"
      scrollable
      max-width="750"
    >
      <v-card>
        <v-btn @click="newCommersStatesTable.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <table-bulider
          :headers="distTable.headers"
          :printer="distTable.printer"
          :items="distTable.items"
          :title="'المخطط الزمني للمرحلة'"
        >
        </table-bulider>

        <table-bulider
          :headers="newCommersStatesTable.headers"
          :printer="newCommersStatesTable.printer"
          :items="newCommersStatesTable.items"
          :title="'اليومية العددية للافراد المستجدين'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>

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
        :headers="newCommersTable.headers"
        :printer="newCommersTable.printer"
        :items="newCommersTable.items"
        :title="' تمامات الوصول'"
      >
        <template v-slot:item.editor="{ item }">
          <v-chip v-if="hasDeleteAccess()" class="transparent">
            <v-btn icon @click="actionDelete(item)" color="error">
              <v-icon>mdi-trash-can</v-icon>
            </v-btn>
          </v-chip>
        </template>
      </table-bulider>
    </v-card>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="newCommersTable.headers"
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

export default {
  name: "new_commers",
  mounted() {
    // console.log("hasEditAccess", this.hasEditAccess());
    this.init();
    this.initDates();
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
    search: {
      Date: new Date()
    },
    searchLoading: false,
    newCommersTable: {
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
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 5
        },
        {
          text: "تاريخ الوصول",
          value: "Date",
          searchValue: "Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 2
        },
        {
          text: "عدد المستجدين",
          value: "NumberofArrivals",
          searchValue: "NumberofArrivals",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 4
        },
        {
          text: "المؤهل العلمي",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 3
        }
      ],
      items: [],
      printer: {}
    },

    newCommersStatesTable: {
      isDisplayed: false,
      headers: [
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegion",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          sort: 4
        },
        ...Object.keys(constants.levelMapping).map(ele => ({
          text: ele,
          value: constants.levelMapping[ele],
          sortable: true,
          inTable: true,
          sort: 1
        }))
      ],
      items: [],
      printer: {}
    },
    distTable: {
      headers: [
        {
          text: "",
          value: "Dist",
          searchValue: "Dist",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          sort: 4
        },
        ...Object.keys(constants.levelMapping).map(ele => ({
          text: ele,
          value: constants.levelMapping[ele],
          sortable: true,
          inTable: true,
          sort: 1
        }))
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
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "NewComersArrivals",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
          }
          await this.findItems({
            RecuStage: item.RecuStage
          });
        })
        .catch(err => {
          this.handleError(err);
        });
    },
    async calculateRecRegionWithKnowloadage() {
      this.$set(this.newCommersStatesTable, "isDisplayed", true);
      const groupdWithRecRegion = _.groupBy(
        this.newCommersTable.items,
        "RecuRegion"
      );
      console.log(groupdWithRecRegion);
      this.$set(
        this.newCommersStatesTable,
        "items",
        Object.keys(groupdWithRecRegion).map(key => ({
          RecuRegion: key,
          High: groupdWithRecRegion[key]
            .filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.High)
            .reduce((prev, ele) => prev + ele.NumberofArrivals, 0),
          AboveAvg: groupdWithRecRegion[key]
            .filter(
              ele => ele.KnowledgeLevel == constants.levelMappingEn.AboveAvg
            )
            .reduce((prev, ele) => prev + ele.NumberofArrivals, 0),
          Avg: groupdWithRecRegion[key]
            .filter(ele => ele.KnowledgeLevel == constants.levelMappingEn.Avg)
            .reduce((prev, ele) => prev + ele.NumberofArrivals, 0),
          Normal: groupdWithRecRegion[key]
            .filter(
              ele => ele.KnowledgeLevel == constants.levelMappingEn.Normal
            )
            .reduce((prev, ele) => prev + ele.NumberofArrivals, 0)
        }))
      );

      const res = await this.api("global/get_one", {
        table: "RegisterationEssurance",
        where: {
          Stage: this.search.RecuStage,
          Dist: "المخطط"
        }
      });
      this.$set(this.distTable, "items", [res.data]);
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);

      try {
        let saveItem = await this.api(`global/create_one`, {
          table: "NewComersArrivals",
          where: this.createdObject.item
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({
            RecuStage: this.createdObject.item.RecuStage
          });
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        dates = ["Date"],
        multi = [];
      if (!where.RecuStage) {
        this.showError("يجب اختيار المرحلة اولا");
        return;
      }
      try {
        const x = await this.api("global/get_all", {
          table: "NewComersArrivals",
          where: this.mapToQuery(where, likes, multi, dates),

          order: [["Date", "desc"]]
        });
        let data = this.fixDates(x.data, ["Date"]),
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.newCommersTable.headers.filter(f => f.inSearch)
          };

        const groupedValues = {};

        data.forEach(ele => {
          groupedValues[ele.KnowledgeLevel] =
            (groupedValues[ele.KnowledgeLevel] || 0) + ele.NumberofArrivals;
        });
        this.groupedValue = Object.keys(groupedValues).map(ele => ({
          title: ele,
          value: groupedValues[ele]
        }));

        this.groupedValue.push({
          title: "الاجمالي",
          value: Object.values(groupedValues).reduce((t, ele) => t + ele, 0)
        });

        this.$set(this.newCommersTable, "items", data);
        this.$set(this.newCommersTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    initDates() {
      let dates = this.newCommersTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.where, d, []);
      });
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
