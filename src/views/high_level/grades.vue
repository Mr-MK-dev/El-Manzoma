<template>
  <div>
    <v-dialog
      persistent
      v-model="Internals.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="Internals.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <unitInternals ref="internals" :parentFilters="true"></unitInternals>
        </v-card-text>
      </v-card>
    </v-dialog>

    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="true"
      @on-search="findItems"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في الكفاءات الراتب العالي"
      addBtnTitle="إضافة كفاءة الى راتب العالي"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الكفاءات'"
    >
      <template v-slot:item.SoliderID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoliderID}`"
          @click.right="copyText(item.SoliderID)"
        >
          {{ item.SoliderID }}
        </v-chip>
      </template>
      <template v-slot:item.UnitInternals="{ item }">
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="grade"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
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
  name: "Grade",
  components: {
    unitInternals: () => import("@/views/high_level/gradeDetails.vue")
  },
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    grade: {},
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

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
          text: "الكفاءات",
          value: "UnitInternals",
          searchValue: "UnitInternals",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoliderID",
          searchValue: "SoliderID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "السنة",
          value: "Year",
          searchValue: "Year",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "التقدير",
          value: "Grade_Text",
          searchValue: "Grade_Text",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "النسبة",
          value: "Nesba_Number",
          searchValue: "Nesba_Number",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "من",
          value: "From_Date",
          searchValue: "From_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الي",
          value: "To_Date",
          searchValue: "To_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          required: true,
          inModel: true,
          sort: 1
        },

        {
          text: "ملاحظات",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "gradeUp",
    selects: {
      Grade_Text: {
        data: constants.grads
      },
      grade: {
        data: constants.ratebgrades
      }
    }
  }),
  watch: {
    "grade.SoliderID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    actionAdd() {
      this.$set(this, "grade", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async saveItem(edirableFromTableItem) {
      if (!this.grade.SoliderID) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.grade.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Grade",
            where: !this.grade.isEdit
              ? this.grade
              : {
                  ID: this.grade.ID
                },
            update: this.grade
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.headers.forEach(function(obj) {});
        this.$refs.internals.gradeDetails.SoliderID = item.SoliderID;
        this.$set(
          this.$refs.internals.gradeDetails,
          "SoliderID",
          item.SoliderID
        );

        await this.$refs.internals.findItems({ SoliderID: [item.SoliderID] });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 1000);
      }
    },
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.grade, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id"],
        multi = [],
        dates = ["From_Date", "To_Date"];

      this.api("global/get_all", {
        table: "Grade",
        include: [{ model: "Rateb" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(async x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          let group = await lodash.groupBy(data, ele => ele.SoliderID);
          console.log(group);
          this.$set(
            this.mainTable,
            "items",
            Object.values(group).map(ele => ele[0])
          );

          this.$set(this.mainTable, "printer", printer);
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
