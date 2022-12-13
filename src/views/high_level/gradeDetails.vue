<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      :selects="selects"
      large
      outlined
      color="primary"
    >
      إضافة كفاءة
    </v-btn>

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
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
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
      :data="gradeDetails"
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
  name: "gradeDetails",
  props: {},
  mounted() {
    this.init();
    // this.findItems({});
  },
  data: () => ({
    gradeDetails: {},
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
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "السنة",
          value: "Year",
          searchValue: "Year",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
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
          inTable: true,
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
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "من",
          value: "From_Date",
          searchValue: "From_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الي",
          value: "To_Date",
          searchValue: "To_Date",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },

        {
          text: "ملاحظات",
          value: "Note",
          searchValue: "Note",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
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
        table: "Grade",
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
