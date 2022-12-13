<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      title="بحث متقدم في تتبع الاستخدام"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التسجيلات'"
    >
      <template v-slot:item.ActivePeriod="{ item }">
        <v-chip>
          {{
            item.SessionEndtDate
              ? `${diff_minutes(
                  new Date(item.SessionStartDate),
                  new Date(item.SessionEndtDate)
                )}`
              : ""
          }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const tableFields = require("../../tableFields").default;

export default {
  name: "SessionTracking",
  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "اسم المستخدم",
          value: "user.realName",
          searchValue: "userId",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "اسم الجهاز",
          value: "Device.Name",
          searchValue: "DeviceName",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "IP",
          value: "IP",
          searchValue: "IP",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "MAC",
          value: "MAC",
          searchValue: "MAC",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ تسجيل الدخول",
          value: "SessionStartDateText",
          searchValue: "SessionStartDate",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ تسجيل الخروج",
          value: "SessionEndtDateText",
          searchValue: "SessionEndtDate",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "دقائق الفعالية",
          value: "ActivePeriod",
          searchValue: "ActivePeriod",
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
    textDialog: {
      model: false,
      text: ""
    },
    changesDialog: {
      model: false,
      text: ""
    },
    beforeChangesDialog: {
      model: false,
      text: ""
    },
    selects: {
      userId: {
        table: "users",
        value: "userId",
        text: "realName"
      }
    }
  }),
  watch: {},
  methods: {
    diff_minutes(dt2, dt1) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60;
      return Math.abs(Math.round(diff));
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id", "message"],
        multi = [],
        dates = ["SessionStartDate", "SessionEndtDate"];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "SessionTracking",
          include: [{ model: "users" }, { model: "Devices" }],
          where: this.mapToQuery(where, likes, multi, dates)
        });

        let data = x.data.map(ele => ({
            ...ele,
            SessionStartDateText: `
              اليوم : ${
                new Date(ele.SessionStartDate).toISOString().split("T")[0]
              }
              الساعة : ${
                new Date(ele.SessionStartDate)
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              }
              `,
            SessionEndtDateText: ele.SessionEndtDate
              ? `
              اليوم : ${
                new Date(ele.SessionEndtDate).toISOString().split("T")[0]
              }
              الساعة : ${
                new Date(ele.SessionEndtDate)
                  .toISOString()
                  .split("T")[1]
                  .split(".")[0]
              }
              `
              : ""
          })),
          printer = {
            data: [...data],
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

        // data.map(ele => ele.changes.replace([tableFields[ele.tableName]]));
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
