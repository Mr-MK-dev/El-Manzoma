<template>
  <div>
    <v-card-title>
      <v-btn @click="findItems()" large outlined color="primary">
        إعادة تحميل الصفحة
      </v-btn>
    </v-card-title>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'بيانات غير كاملة'"
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
      <template v-slot:item.actionStart="{ item }">
        <v-chip icon color="transparent" @click="Edit(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-chip>
      </template>

      <template v-slot:item.Duty.Duty="{ item }">
        <v-chip icon :color="item.Duty.DutyID ? 'transparent' : 'warning'">
          {{ item.Duty.Duty || "?" }}
        </v-chip>
      </template>

      <template v-slot:item.Weapon.Weapon="{ item }">
        <v-chip icon :color="item.Weapon.Weapon ? 'transparent' : 'warning'">
          {{ item.Weapon.Weapon || "?" }}
        </v-chip>
      </template>

      <template v-slot:item.Unit.Unit="{ item }">
        <v-chip icon :color="item.UnitID ? 'transparent' : 'warning'">
          {{ item.Unit.Unit || "?" }}
        </v-chip>
      </template>

      <template v-slot:item.RatebCategory="{ item }">
        <v-chip icon :color="item.RatebCategory ? 'transparent' : 'warning'">
          {{ item.RatebCategory || "?" }}
        </v-chip>
      </template>
      <template v-slot:item.SatrtingSarefRateb="{ item }">
        <v-chip
          icon
          :color="
            item.SatrtingSarefRateb == '01/01/1753' ? 'warning' : 'transparent'
          "
        >
          {{ item.SatrtingSarefRateb || "?" }}
        </v-chip>
      </template>
      <template v-slot:item.UnitJoinDate="{ item }">
        <v-chip
          icon
          :color="item.UnitJoinDate == '1753-01-01' ? 'warning' : 'transparent'"
        >
          {{ item.UnitJoinDate || "?" }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
export default {
  name: "unCompletedData",
  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionStart",
          searchValue: "",
          sortable: true,
          inTable: true
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "RatebCategory",
          searchValue: "RatebCategory",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "الواجب المدرب عليه",
          value: "Duty.Duty",
          searchValue: "DutyID",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "تاريخ صرف الراتب العالي",
          value: "SatrtingSarefRateb",
          searchValue: "SatrtingSarefRateb",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "تاريخ الضم للوحدة",
          value: "UnitJoinDate",
          searchValue: "UnitJoinDate",
          type: "date",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
          sort: 1
        },
        {
          text: "حالة الفرد",
          value: "Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: false
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      KnowledgeLevel: {
        text: "text",
        value: "text",
        data: constants.KnowledgeLevel.data
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      Status: {
        text: "text",
        value: "text",
        data: constants.SoldierStatus.data
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
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
  watch: {},
  methods: {
    Edit(item) {
      this.goThere(`/add_conscripte/${item.ID}/راتب عالى`);
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [],
        date = [];

      let duties = await this.api("global/get_all", {
        table: "Duty"
      });
      let dutiesID = duties.data.map(ele => ele.DutyID);
      let invalidRatebs = await this.api("global/get_all", {
        table: "Rateb",
        where: {
          Status: "بالخدمة",
          DutyID: {
            $notIn: dutiesID
          }
        }
      });
      console.log("invalidRatebs", invalidRatebs);
      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "Rateb",
        where: this.cleanObject({
          Status: "بالخدمة",
          $or: [
            {
              RatebCategory: null
            },
            {
              UnitID: [null, 0]
            },
            {
              SatrtingSarefRateb: [
                null,
                "01/01/1753",
                "1753-01-01",
                "4241-05-15"
              ]
            },
            {
              UnitJoinDate: [null, "01/01/1753", "1753-01-01", "22021-10-23"]
            },
            {
              DutyID: [null, 0]
            },
            {
              WeaponID: null
            },
            {
              DutyID: {
                $notIn: dutiesID
              }
            }
          ]
        }),
        include: [
          {
            model: "Unit"
          },
          {
            model: "Duty"
          },
          {
            model: "Weapon"
          }
        ]
      })
        .then(x => {
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
          console.log("data", data);
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
