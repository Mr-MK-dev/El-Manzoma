<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'وحدات التقرير'"
      :isExcel="true"
    >
      <template v-slot:item.editor="{ item }" v-if="listType == `removed`">
        <v-chip icon color="transparent" @click="actionUpdate(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-chip>
      </template>
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>
      <template v-slot:item.unitDetails="{ item }">
        <v-chip color="primary" @click="toUnitDetails(item)">
          {{ "الوظائف" }}
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");

export default {
  name: "JobReport",

  components: {},

  computed: {
    params() {
      let index = this.$store.state.routes.findIndex(
          v => v.name == this.componentName
        ),
        params = {};
      if (index !== -1) {
        params = this.$store.state.routes[index].params;
      }
      return params;
    }
  },

  mounted() {
    this.initWithoutChecking();
    this.findItems({});
  },

  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    listType: "all",
    searchLoading: false,
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "PackagedUnitName",
          searchValue: "PackagedUnitName",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الوظائف",
          value: "unitDetails",
          searchValue: "unitDetails",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    },

    showAddDialog: false,
    addLoading: false,
    addModel: {}
  }),
  methods: {
    async actionDelete(item) {
      this.removedItem = item;
      this.$set(this, "showRemoveDialog", true);
    },
    actionUpdate(item) {
      this.updateRemovedItem = item;
      this.$set(this, "showUpdatDialog", true);
    },
    toUnitDetails(item) {
      this.$router.push(
        `/UnitJobs/${this.$route.params.id}/${item.PackagedUnitID}/${this.$route.params.DailyType}`
      );
    },
    findRemovedItems() {
      this.$router.push(`/removedCandidates/${this.$route.params.id}`);
    },
    findAddedItems() {
      this.$router.push(`/AddedCandidates/${this.$route.params.id}`);
    },

    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      let units = await this.api("global/get_all", {
        table: "Unit",
        where: {
          hasPackaging: 1,
          statue: "بالخدمة"
        }
      });
      this.api("global/get_all", {
        table: "PackageCandidates",
        include: [
          {
            model: "Unit",
            where: this.cleanObject({
              statue: "بالخدمة"
            })
          }
        ],
        where: this.cleanObject({
          PackageID: this.$route.params.id
        })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));
          let SoldierGroupedByPackagedUnit = lodash.groupBy(
            data,
            ele => ele.PackagedUnitID
          );
          let d = units.data.map(key => ({
            PackagedUnitID: key.UnitID,
            PackagedUnitName: key.Unit,
            totalperUnit: SoldierGroupedByPackagedUnit[key.UnitID]?.length || 0,
            PackageID: this.$route.params.id
          }));
          console.log("sgdp", SoldierGroupedByPackagedUnit);

          this.$set(this.mainTable, "items", d);
          this.$set(this.mainTable, "printer", {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          });
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    }
  }
};
</script>
