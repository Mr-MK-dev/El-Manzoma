<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :items="mainTable.items"
      :printer="mainTable.printer"
      :title="'أماكن العمل'"
    >
      <template v-slot:item.ID="{ item }">
        <v-chip color="transparent">
          {{ item.workplace }}
        </v-chip>
      </template>
      <template v-if="isAdmin()" v-slot:item.edit="{ item }">
        <v-btn
          class="mx-auto"
          @click="routeToPlaceMainPower(item)"
          large
          outlined
          color="primary"
        >
          تعديل أفراد مكان العمل
        </v-btn>
      </template>
    </table-bulider>
  </div>
</template>
<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "enrollersWorkPlace",
  mounted() {
    this.findAllWorkPlaces();
    this.init();
  },
  data: () => ({
    rig: {},
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    searchLoading: false,
    selects: {
      wokel7aq: {
        table: "followerwork",
        value: "wokel7aq",
        text: "wokel7aq"
      }
    },
    mainTable: {
      headers: [
        {
          text: "مكان العمل",
          value: "workplace",
          type: "text",
          inTable: true,
          readonly: true,
          inModel: true
        },
        {
          text: "القوة الاساسية راتب عالي",
          value: "highMainPower",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "القوة الاساسية مجندين",
          value: "SoldierMainPower",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "القوة الاساسية اجمالي",
          value: "totalMainPower",
          type: "text",
          inTable: true,
          inModel: true
        },
        {
          text: "",
          value: "edit",
          searchValue: "edit",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        }
      ],
      items: [],
      printer: []
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
  methods: {
    async findAllWorkPlaces() {
      this.$set(this, "searchLoading", true);
      this.$set(this.mainTable, "items", []);

      try {
        const workPlaces = await this.api("global/get_all", {
          table: "followerwork"
        });

        const workPlaceMainPower = await this.api("global/get_all", {
          table: "WorkPlaceMainPower"
        });

        console.log("Woekplace", workPlaces);
        console.log("WoekplaceMainPowe", workPlaceMainPower);

        let returnedItems = [];

        for (const ele of workPlaces.data) {
          returnedItems.push({
            ...ele,
            highMainPower: workPlaceMainPower.data.filter(
              x => x.Type == "راتب عالي" && x.WorkPlaceID == ele.idwork
            ).length,
            SoldierMainPower: workPlaceMainPower.data.filter(
              x => x.Type == "مجند" && x.WorkPlaceID == ele.idwork
            ).length,
            totalMainPower: workPlaceMainPower.data.filter(
              x => x.WorkPlaceID == ele.idwork
            ).length
          });
        }

        returnedItems.push({
          workplace: "الإجمالي",
          highMainPower: lodash.sumBy(returnedItems, ele => ele.highMainPower),
          SoldierMainPower: lodash.sumBy(
            returnedItems,
            ele => ele.SoldierMainPower
          ),
          totalMainPower: lodash.sumBy(
            returnedItems,
            ele => ele.totalMainPower
          ),
          edit: " "
        });

        this.$set(this.mainTable, "items", returnedItems);
        this.$set(this.mainTable, "printer", {
          data: this.mainTable.items,
          excelKey: "data",
          excelHeaders: this.mainTable.headers.filter(f => f.inTable),
          hasParent: true
        });
      } catch (e) {
        this.handleError(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      }
      this.$set(this, "this.searchLoading", false);
    },

    routeToPlaceMainPower(item) {
      console.log("Item", item);
      this.$router.push(`WorkPlacePrimaryPowerConscriptes/${item.idwork}`);
    }
  }
};
</script>
