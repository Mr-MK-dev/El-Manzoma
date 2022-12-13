<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الملحقين'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.Name}`"
          @click.right="copyText(item.Name)"
        >
          {{ item.Name }}
        </v-chip>
      </template>
      <template v-slot:item.isEnrolled="{ item }">
        <v-chip :color="item.isEnrolled == 1 ? 'success' : 'error'">
          {{ item.isEnrolled ? "نعم" : "لا" }}
        </v-chip>
      </template>
      <template v-slot:item.isTrainingOrder="{ item }">
        <v-chip :color="item.isTrainingOrder == 1 ? 'success' : 'error'">
          {{ item.isTrainingOrder ? "نعم" : "لا" }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "ratebNotifications",
  mounted() {
    this.init();
    this.searchEnrollers({});
  },
  data: () => ({
    enrSold: {},
    search: {},
    startAddProccess: false,
    searchLoading: false,
    mainTable: {
      printer: {},
      selected: [],
      search: "",
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          inModel: true,
          readOnly: false,
          required: true,

          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          required: true,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Rateb.Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },
        {
          text: "سبب الإنهاء",
          value: "Rateb.RatebState",
          searchValue: "RatebState",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          inModel: false
        },

        {
          text: "مستمر إلحاقه",
          value: "isEnrolled",
          searchValue: "isEnrolled",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: true,
          readonly: false,
          sort: 1
        },
        {
          text: "أمر مهمة تدريب",
          value: "isTrainingOrder",
          searchValue: "isTrainingOrder",
          type: "checkbox",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: true,
          readonly: false,
          sort: 1
        }
      ],
      items: []
    },

    selects: {}
  }),
  watch: {},

  methods: {
    searchEnrollers(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      this.api("global/get_all", {
        table: "Followerrateb",
        where: this.cleanObject({
          $or: {
            isEnrolled: true,
            isTrainingOrder: true
          }
        }),
        include: [
          {
            model: "followerwork"
          },
          {
            model: "Rateb",
            where: {
              Status: "منتهى خدمته"
            },
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ]
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele,
                  isEnrolled: ele.isEnrolled ? "نعم" : "لا"
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          console.log("notfications", x.data);
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
