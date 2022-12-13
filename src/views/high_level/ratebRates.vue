<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :clearOption="true"
      :addButton="false"
      title="تقييمات الراتب العالي"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :hasSort="true"
      :items="mainTable.items"
      :loading="searchLoading"
      :title="''"
    >
      <template v-slot:item.actions="{ item }">
        <v-chip v-if="hasEditAccess()" class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>

      <template v-slot:item.ID="{ item }">
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
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="rateb"
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
  name: "RatebRates",
  mounted() {
    this.init();
  },
  data: () => ({
    search: {},
    rateb: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actions",
          searchValue: "actions",
          sortable: false,
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 0
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Name",
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
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "السلاح",
          value: "Weapon.Weapon",
          searchValue: "WeaponID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "الوظيفة",
          value: "Duty.Duty",
          searchValue: "DutyID",
          type: "select",
          sortable: true,
          inTable: false,
          inSearch: true,
          inModel: false,
          readOnly: false,
          sort: 1
        },
        {
          text: "تقييم قائد الوحدة من 10",
          value: "UnitLeaderRate",
          searchValue: "UnitLeaderRate",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          readOnly: false,
          inModel: true
        },
        {
          text: "تقييم رئيس قسم القاسم الراتب العالي من 10",
          value: "SpecialistRate",
          searchValue: "SpecialistRate",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          readOnly: false,
          inModel: true
        },
        {
          text: "تقييم رئيس فرع الأفراد من 10",
          value: "LeaderRate",
          searchValue: "LeaderRate",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          readOnly: false,
          inModel: true
        },
        {
          text: "متوسط التقييم",
          value: "AverageRate",
          searchValue: "AverageRate",
          type: "text",
          sortable: true,
          inTable: true,
          inModel: true,
          inSearch: false,
          readOnly: true,
          inModel: true
        }
      ],
      items: [],
      printer: []
    },
    hasUnit: false,
    previousUnit: 0,
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      DutyID: {
        table: "Duty",
        text: "Duty",
        value: "DutyID"
      },
      WeaponID: {
        table: "Weapon",
        text: "Weapon",
        value: "WeaponID"
      }
    },
    createdObject: {
      model: false
    }
  }),
  watch: {
    rateb: {
      handler(val) {
        this.$set(
          this.rateb,
          "AverageRate",
          Math.round(
            (+val.UnitLeaderRate + +val.SpecialistRate + +val.LeaderRate) / 3
          )
        );
      },
      deep: true
    }
  },
  methods: {
    async saveItem() {
      if (
        parseInt(this.rateb.SpecialistRate) > 10 ||
        parseInt(this.rateb.LeaderRate) > 10 ||
        parseInt(this.rateb.UnitLeaderRate) > 10
      ) {
        this.showError("لا يجوز تقييم اكثر من 10 ");
        return;
      }
      this.$set(this.createdObject, "loading", true);

      const saveItem = await this.api(`global/update_one`, {
        table: "Rateb",
        where: {
          ID: this.rateb.ID
        },
        update: this.rateb
      });
      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.createdObject, "model", false;
        this.findItems(this.search);
        this.rateb = {};
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);

      this.$set(this.createdObject, "model", false);
    },
    actionEdit(item) {
      this.$set(this, "rateb", { ...item });
      this.createdObject.model = true;
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["ID", "Name"],
        multi = ["UnitID", "WeaponID"],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      this.search = filters;
      this.api("global/get_all", {
        table: "Rateb",
        where: this.cleanObject({
          UnitID: where.UnitID,
          Status: "بالخدمة",
          WeaponID: where.WeaponID
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
              data: [...data],

              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
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
