<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'العقوبات والجرائم'"
    >
      <template v-slot:item.SoliderID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="penalitiesDetails"
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
  name: "PenalitiesDetails",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    penalitiesDetails: {},
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
          text: "التاريخ",
          value: "date",
          searchValue: "date",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الجريمة",
          value: "crimeText",
          searchValue: "crimeText",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "تاريخ الجريمة من",
          value: "crimeFromDate",
          searchValue: "crimeFromDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الجريمة الى",
          value: "crimeToDate",
          searchValue: "crimeToDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الفترة بالإيام",
          value: "periodInDays",
          searchValue: "periodInDays",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم الأمر",
          value: "orderNumber",
          searchValue: "orderNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الأمر",
          value: "orderDate",
          searchValue: "orderDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "النوع",
          value: "kind",
          searchValue: "kind",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الجريمة",
          value: "type",
          searchValue: "type",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {}
  }),
  watch: {
    "gradeDetails.SoliderID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Grade",
            where: {
              ID: item.ID
            }
          });
          this.findItems({ SoliderID: this.gradeDetails.SoliderID });
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.gradeDetails.SoliderID) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.gradeDetails.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Grade",
            where: !this.gradeDetails.isEdit
              ? this.gradeDetails
              : {
                  ID: this.gradeDetails.ID
                },
            update: this.gradeDetails
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ SoliderID: this.gradeDetails.SoliderID });
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
    findOne(id) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { id }
      })
        .then(x => {
          this.$set(this.gradeDetails, "Name", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
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
        table: "RatebPenalities",
        include: [{ model: "Rateb" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionAdd() {
      this.$set(this, "gradeDetails", {
        SoliderID: this.gradeDetails.SoliderID,
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "gradeDetails", {
        ...item,
        isEdit: true
      });
      this.findOne(item.SoliderID);
    }
  }
};
</script>
