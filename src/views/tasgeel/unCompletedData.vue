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
        <v-chip icon :color="item.DutyID ? 'transparent' : 'warning'">
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

      <template v-slot:item.KnowledgeLevel="{ item }">
        <v-chip icon :color="item.KnowledgeLevel ? 'transparent' : 'warning'">
          {{ item.KnowledgeLevel || "?" }}
        </v-chip>
      </template>
      <template v-slot:item.SoldierCategory="{ item }">
        <v-chip icon :color="item.SoldierCategory ? 'transparent' : 'warning'">
          {{ item.SoldierCategory || "?" }}
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
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
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
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          type: "select",
          sortable: true,
          inTable: true,
          inModel: false,
          inSearch: false,
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
          value: "SoldierCategory",
          searchValue: "SoldierCategory",
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
      this.goThere(`/add_conscripte/${item.ID}/مجند`);
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

      where = this.mapToQuery(where, likes, multi, date);
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Soldier",
          where: this.cleanObject({
            Status: "بالخدمة",
            $or: [
              {
                SoldierCategory: null
              },
              {
                KnowledgeLevel: null
              },
              {
                UnitID: [null, 0]
              },
              {
                DutyID: [null, 0]
              },
              {
                WeaponID: null
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
        console.log("data", data);
        this.$set(this.mainTable, "items", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        this.handleError("the error", error);
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
