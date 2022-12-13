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
          <table-bulider
            :headers="candidatesTable.headers"
            :printer="candidatesTable.printer"
            :items="candidatesTable.items"
            :title="'المرشحين للنشره'"
          >
          </table-bulider>
        </v-card-text>
      </v-card>
    </v-dialog>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      title="بحث متقدم في نشرات التجديدات"
      :addButton="false"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'نشرة التجديدات'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.candidates="{ item }">
        <v-btn
          icon
          color="primary"
          @click="
            actionShowData(item.date);
            Internals.model = true;
          "
        >
          إظهار المرشحين
        </v-btn>
      </template>
    </table-bulider>
  </div>
</template>

<script>
import lodash from "lodash";

export default {
  name: "RenewFuturePlan",

  mounted() {
    this.init();
  },

  data: () => ({
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    groupedData: {},
    mainTable: {
      headers: [
        {
          text: "نوع التجديد",
          value: "Type",
          searchValue: "Type",
          sortable: false,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "مدة التجديد",
          value: "Period",
          searchValue: "Period",
          sortable: false,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ نشرة التجديد",
          value: "date",
          searchValue: "date",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "عدد المدرجين بالنشرة",
          value: "total",
          searchValue: "total",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "عدد المدرجين بالنشرة",
          value: "candidates",
          searchValue: "candidates",
          sortable: false,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    candidatesTable: {
      headers: [
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الأسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "RatebLevel",
          searchValue: "RatebLevel",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الفئة",
          value: "RatebCategory",
          searchValue: "RatebCategory",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ صرف الراتب العالي",
          value: "SatrtingSarefRateb",
          searchValue: "SatrtingSarefRateb",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },
    selects: {
      Type: {
        text: "text",
        value: "value",
        data: [
          {
            text: "التجديد الأول",
            value: 1
          },
          {
            text: "التجديد الثاني",
            value: 2
          }
        ]
      }
    }
  }),
  methods: {
    async findItems(filters) {
      console.log(filters);
      let ratebs = [];
      let allRatebs = await this.api("global/get_all", {
        table: "Rateb",
        where: {
          Status: "بالخدمة"
        }
      });

      ratebs = allRatebs.data.filter(
        ele =>
          (ele.RatebCategory?.includes("صف") && ele.WeaponID == 52) ||
          ele.RatebCategory?.includes("كاتب عسكرى") ||
          ele.RatebCategory?.includes("سائق عجل")
      );

      if (filters.Type === 1) {
        ratebs = ratebs.filter(ele => !ele.FirstRenewDateTo);
        ratebs = ratebs.map(ele => {
          let renewDate;
          if (
            new Date(
              `${new Date(ele.SatrtingSarefRateb).getFullYear()}-07-01`
            ) -
              new Date(ele.SatrtingSarefRateb) >
            0
          ) {
            renewDate = new Date(
              `${new Date(ele.SatrtingSarefRateb).getFullYear()}-07-01`
            );
          } else {
            renewDate = new Date(
              `${new Date(ele.SatrtingSarefRateb).getFullYear() + 1}-01-01`
            );
          }
          return {
            ...ele,
            renewDate
          };
        });
      }

      if (filters.Type === 2) {
        ratebs = ratebs.filter(
          ele => ele.FirstRenewDateTo && ele.SecondRenewDateTo
        );
        ratebs = ratebs.map(ele => {
          let renewDate;
          if (
            new Date(`${new Date(ele.FirstRenewDateTo).getFullYear()}-07-01`) -
              new Date(ele.FirstRenewDateTo) >
            0
          ) {
            renewDate = new Date(
              `${new Date(ele.FirstRenewDateTo).getFullYear()}-07-01`
            );
          } else {
            renewDate = new Date(
              `${new Date(ele.FirstRenewDateTo).getFullYear() + 1}-01-01`
            );
          }
          return {
            ...ele,
            renewDate
          };
        });
      }
      ratebs = ratebs.map(ele => {
        return {
          ...ele,
          renewDate: new Date(
            ele.renewDate.setFullYear(
              ele.renewDate.getFullYear() + (filters.Period || 5)
            )
          )
        };
      });
      let groupedByRenewDate = lodash.groupBy(
        ratebs,
        ele => ele.renewDate.toISOString().split("T")[0]
      );
      this.groupedData = groupedByRenewDate;
      this.mainTable.items = Object.keys(groupedByRenewDate).map(key => ({
        date: key,
        total: groupedByRenewDate[key].length
      }));
      this.mainTable.printer = {
        data: [...this.mainTable.items],
        excelKey: "data",
        excelHeaders: this.mainTable.headers.filter(f => f.inTable)
      };
    },
    async actionShowData(item) {
      console.log(this.groupedData[item]);
      if (this.candidatesTable.items) {
        this.candidatesTable.items = this.groupedData[item];
        this.$set(this.candidatesTable, "printer", {
          data: this.groupedData[item],
          excelKey: "data",
          excelHeaders: this.candidatesTable.headers.filter(f => f.inTable)
        });
      } else {
        window.setTimeout(async () => {
          await this.actionShowData();
        }, 1000);
      }
    }
  }
};
</script>

<style scoped></style>
