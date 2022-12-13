<template>
  <div>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'خطة رئيس الهيئة 1 '"
      :isExcel="true"
    >
      <template v-slot:item.SoldierID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoldierID}`"
          @click.right="copyText(item.SoldierID)"
        >
          {{ item.SoldierID }}
        </v-chip>
      </template>

      <template v-slot:item.delete="{ item }">
        <v-chip icon color="transparent" @click="actionDelete(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
const lodash = require("lodash");
const constants = require("../../Constant").default;

export default {
  name: "organizationPlanDetails",

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
    this.findItems({});
  },

  data: () => ({
    mainTable: {
      headers: [
        {
          text: "شطب",
          value: "delete",
          searchValue: "delete",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "SoldierID",
          searchValue: "SoldierID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Soldier.Name",
          searchValue: "Name",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Soldier.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "وحدة التعبئة",
          value: "Unit.Unit",
          searchValue: "PackagedUnitID",
          sortable: true,
          type: "select",
          multiple: true,
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Soldier.SoldierCategory",
          searchValue: "SoldierCategory",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "تاريخ التسريح",
          value: "Soldier.RecuEndDate",
          searchValue: "RecuEndDate",
          sortable: true,
          type: "select",
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
    }
  }),

  methods: {
    actionDelete(item) {
      this.$confirm(
        "هل أنت متأكد من شطب هذا الجندي من خطة رئيس الهيئة 1 ؟"
      ).then(res => {
        if (res) {
          this.removeFromOrganizationPlan(item);
        }
      });
    },
    async removeFromOrganizationPlan(item) {
      await this.api("global/create_one", {
        table: "RemovedPackageCandidates",
        where: {
          PackageID: item.PackageID,
          SoldierID: item.SoldierID
        }
      });

      await this.api("global/delete_all", {
        table: "OrganizationPlanCandidates",
        where: {
          ID_KEY: item.ID_KEY
        }
      });
      this.findItems({});
    },
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "listType", "all");
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["params.id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "OrganizationPlanCandidates",
        include: [
          {
            model: "Unit"
          },
          {
            model: "Soldier",
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ],
        where:
          this.$route.params.PackagedUnitID != "0"
            ? this.cleanObject({
                PackageID: this.$route.params.id,
                PackagedUnitID: this.$route.params.PackagedUnitID
              })
            : this.cleanObject({
                PackageID: this.$route.params.id
              })
      })
        .then(x => {
          let data = x.data.map(ele => ({
            ...ele
          }));

          this.$set(this.mainTable, "items", data);
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
