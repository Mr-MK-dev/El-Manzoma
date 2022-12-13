<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث توصيات ظابط/جندي"
      addBtnTitle="إضافة توصيه "
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التوصيات '"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            color="transparent"
            @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة توصيه'"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="recommendation"
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
  name: "OfficerSoldierRecommendation",
  mounted() {
    this.init();
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    recommendation: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الرقم الثلاثي",
          value: "tripleNo",
          searchValue: "tripleNo",
          sortable: true,
          type: "tribleNum",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الموصي",
          value: "Recommender",
          searchValue: "Recommender",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "التوصية",
          value: "Recommended",
          searchValue: "Recommended",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الحاله",
          value: "Status",
          searchValue: "Status",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
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
      printer: []
    },
    selects: {
      Recommended: {
        text: "text",
        value: "text",
        data: [
          {
            text: "جندي"
          },
          {
            text: "ظابط"
          }
        ]
      },
      Status: {
        text: "text",
        value: "text",
        data: [
          {
            text: "لا يوجد"
          },
          {
            text: "جندي"
          },
          {
            text: "ظابط"
          }
        ]
      }
    },

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    }
  }),
  methods: {
    initDates() {
      let dates = this.mainTable.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["Name"],
        multi = [],
        date = [""];

      where = this.mapToQuery(where, likes, multi, date);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "OfficerSoldierRecommendation",
          where: this.cleanObject({
            ...where
          })
        });
        let data = x.data,
          printer = {
            data: [
              ...data.map(ele => ({
                ...ele
              }))
            ],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(
              f => f.inTable && f.text.length
            )
          };
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.recommendation.isEdit ? "update_one" : "create_one"}`,
          {
            table: "OfficerSoldierRecommendation",
            where: !this.recommendation.isEdit
              ? this.recommendation
              : {
                  RecommendationID: this.recommendation.RecommendationID
                },
            update: this.recommendation
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    actionAdd() {
      this.$set(this, "recommendation", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "recommendation", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "OfficerSoldierRecommendation",
          where: {
            RecommendationID: item.RecommendationID
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        await this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
