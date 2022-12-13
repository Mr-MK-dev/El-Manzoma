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
      إضافة عقوبة
    </v-btn>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المحاكم و العقوبات'"
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
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
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

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="punishmentDetails"
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
  name: "CourtsPunshmentDetails",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    punishmentDetails: {},
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
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: false,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "م",
          value: "count",
          searchValue: "count",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "ملخص الجريمة",
          value: "Summryofcrime",
          searchValue: "Summryofcrime",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "نوع الجريمة",
          value: "PunishmentTypes.Type",
          searchValue: "PunishmentTypeID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "عقوبة/محكمة",
          value: "kindofpunshment",
          searchValue: "kindofpunshment",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "العقوبة",
          value: "punshment",
          searchValue: "punshment",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المسئول عن تنفيذ العقاب",
          value: "responsibleofpunshment",
          searchValue: "responsibleofpunshment",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مدة العقوبة باليوم",
          value: "durationofdaypunshment",
          searchValue: "durationofdaypunshment",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مدة العقوبة بالشهر",
          value: "durationofmonthpunshment",
          searchValue: "durationofmonthpunshment",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "مدة العقوبة بالسنة",
          value: "durationofyearpunshment",
          searchValue: "durationofyearpunshment",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "بند الاوامر",
          value: "pand",
          searchValue: "pand",
          sortable: true,
          type: "textarea",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اجمالى المدة الفاقدة للعقوبة باليوم ",
          value: "total_lost_of_punshment_day",
          searchValue: "total_lost_of_punshment_day",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اجمالى المدة الفاقدة للعقوبة بالشهر ",
          value: "total_lost_of_punshment_month",
          searchValue: "total_lost_of_punshment_month",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اجمالى المدة الفاقدة للعقوبة بالسنة ",
          value: "total_lost_of_punshment_year",
          searchValue: "total_lost_of_punshment_year",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الجريمة",
          value: "dateofcrime",
          searchValue: "dateofcrime",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ العقوبة",
          value: "fromdateofpunshment",
          searchValue: "fromdateofpunshment",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التاريخ الفعلي لرفع اثار العقوبة",
          value: "datefa3liathar",
          searchValue: "datefa3liathar",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "التاريخ الفعلى لرد الاعتبار",
          value: "datefa3liradfa3l",
          searchValue: "datefa3liradfa3l",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملاحظات",
          value: "notes",
          searchValue: "notes",
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

    componentName: "createdObject",
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      PunishmentTypeID: {
        table: "PunishmentTypes",
        value: "ID_KEY",
        text: "Type"
      },
      kindofpunshment: {
        text: "text",
        value: "text",
        data: constants.kindofpunshments.data
      },
      punshment: {
        text: "text",
        value: "text",
        data: constants.punshments.data
      },
      Summryofcrime: {
        text: "text",
        value: "text",
        data: constants.summryofcrime.data
      }
    }
  }),
  watch: {
    "punshment.ID"(newValue) {
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
            table: "punshments",
            where: {
              count: item.count
            }
          });
          this.findItems({ ID: this.punishmentDetails.ID });
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.punishmentDetails.ID) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${
            this.punishmentDetails.isEdit ? "update_one" : "create_one"
          }`,
          {
            table: "punshments",
            where: !this.punishmentDetails.isEdit
              ? this.punishmentDetails
              : {
                  count: this.punishmentDetails.count
                },
            update: this.punishmentDetails
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ ID: this.punishmentDetails.ID });
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
    findOne(ID) {
      this.api("global/get_one", {
        table: "Rateb",
        where: { ID }
      })
        .then(x => {
          this.$set(this.punishmentDetails, "Name", x.data.Name);
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
        likes = ["ID"],
        multi = [];

      this.api("global/get_all", {
        table: "punshments",
        include: [{ model: "Rateb" }, { model: "PunishmentTypes" }],
        where: this.mapToQuery(where, likes, multi)
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
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionAdd() {
      this.$set(this, "punishmentDetails", {
        ID: this.punishmentDetails.ID,
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "punishmentDetails", {
        ...item,
        isEdit: true
      });
      this.findOne(item.ID);
    }
  }
};
</script>
