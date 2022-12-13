<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'تواريخ الخطة'"
    >
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'تعديل تاريخ النسريج'"
      :open="createdObject.model"
      :fields="mainTable.headers"
      :data="packagePlanDate"
      :selects="selects"
      @on-close="createdObject.model = false"
      @on-submit="savePackagePlanDate()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "PackagePlanDates",
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  async mounted() {
    this.selects.DateValues.data = await this.fetchAvailableServiceEndDates();
    await this.findItems();
  },
  data: () => ({
    selects: {
      DateValues: {
        text: "text",
        value: "value",
        data: []
      }
    },

    packagePlanDate: {},
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    loading: false,
    mainTable: {
      headers: [
        {
          text: "تعديل",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },

        {
          text: "اسم التاريخ",
          value: "DateName",
          searchValue: "DateName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readOnly: false,
          sort: 1
        },
        {
          text: "تواريخ التسريح",
          value: "DateValues",
          searchValue: "DateValues",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          multiple: true,
          readOnly: false,
          sort: 1
        }
      ]
    }
  }),
  methods: {
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);

      let returnedItems = [];
      let data = await this.api("global/get_one", {
        table: "PackagePlanDates",
        where: {
          PackagePlanID: this.$route.params.id
        },
        include: [{ model: "PackagePlan" }]
      });

      let d = await this.fetchAllServiceEndDates();

      console.log("d", d);

      this.selects.DateValues.data = d.filter(
        ele =>
          this.formatDate(ele) >=
            this.formatDate(data.data.PackagePlan.recuEndDateFrom) &&
          this.formatDate(ele) <=
            this.formatDate(data.data.PackagePlan.recuEndDateTo)
      );

      console.log("DADAA", data);

      returnedItems.push({
        DateName: data.data.FirstDateName,
        DateValues: data.data.FirstDateValues?.split(","),
        index: 1
      });
      returnedItems.push({
        DateName: data.data.SecondDateName,
        DateValues: data.data.SecondDateValues?.split(","),
        index: 2
      });
      returnedItems.push({
        DateName: data.data.ThirdDateName,
        DateValues: data.data.ThirdDateValues?.split(","),
        index: 3
      });
      returnedItems.push({
        DateName: data.data.FourthDateName,
        DateValues: data.data.FourthDateValues?.split(","),
        index: 4
      });
      returnedItems.push({
        DateName: data.data.FifthDateName,
        DateValues: data.data.FifthDateValues?.split(","),
        index: 5
      });
      returnedItems.push({
        DateName: data.data.SixthDateName,
        DateValues: data.data.SixthDateValues?.split(","),
        index: 6
      });
      returnedItems.push({
        DateName: data.data.SeventhDateName,
        DateValues: data.data.SeventhDateValues?.split(","),
        index: 7
      });
      returnedItems.push({
        DateName: data.data.EighthDateName,
        DateValues: data.data.EighthDateValues?.split(","),
        index: 8
      });
      returnedItems.push({
        DateName: data.data.NinthDateName,
        DateValues: data.data.NinthDateValues?.split(","),
        index: 9
      });

      console.log("REturned Itsms", returnedItems);
      this.$set(this.mainTable, "items", returnedItems);
    },

    actionEdit(item) {
      this.$set(this, "packagePlanDate", {
        ...item,
        isEdit: true
      });
      this.$set(this.createdObject, "model", true);
    },

    async savePackagePlanDate() {
      console.log("ITEME", "asdasdasdasdasd");
      console.log("ITEME", "ASDASDSAD");
      console.log("ITEME", this.packagePlanDate.DateValues);

      let updateName = "";
      let updateValues = "";
      switch (this.packagePlanDate.index) {
        case 1:
          {
            updateName = "FirstDateName";
            updateValues = "FirstDateValues";
          }
          break;
        case 2:
          {
            updateName = "SecondDateName";
            updateValues = "SecondDateValues";
          }
          break;
        case 3:
          {
            updateName = "ThirdDateName";
            updateValues = "ThirdDateValues";
          }
          break;
        case 4:
          {
            updateName = "FourthDateName";
            updateValues = "FourthDateValues";
          }
          break;
        case 5:
          {
            updateName = "FifthDateName";
            updateValues = "FifthDateValues";
          }
          break;
        case 6:
          {
            updateName = "SixthDateName";
            updateValues = "SixthDateValues";
          }
          break;
        case 7:
          {
            updateName = "SeventhDateName";
            updateValues = "SeventhDateValues";
          }
          break;
        case 8:
          {
            updateName = "EighthDateName";
            updateValues = "EighthDateValues";
          }
          break;
        case 9:
          {
            updateName = "NinthDateName";
            updateValues = "NinthDateValues";
          }
          break;
      }

      console.log("asdasdas", this.packagePlanDate);
      let saveDate = await this.api("global/update_one", {
        table: "PackagePlanDates",
        where: {
          PackagePlanID: this.$route.params.id
        },
        update: {
          [updateName]: this.packagePlanDate.DateName,
          [updateValues]: this.packagePlanDate.DateValues?.join(",")
        }
      });

      if (saveDate) {
        this.$set(this.createdObject, "model", false);
        this.showSuccess("تم التعديل بنجاح");
      }
      await this.findItems({});
    }
  }
};
</script>
