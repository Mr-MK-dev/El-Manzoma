<template>
  <div>
    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
      title="بحث في تشابه الاسماء"
      addBtnTitle=" "
    />
    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="'تشابه الاسماء'"
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
      <template v-slot:item.BrotherMilitaryID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.ID}`"
          @click.right="copyText(item.ID)"
        >
          {{ item.ID }}
        </v-chip>
      </template>
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.actionAddToBrother="{ item }"
      >
        <v-chip color="transparent">
          <!-- <v-btn icon @click="actionEdit(item)" color="primary">
          <v-icon>mdi-pencil</v-icon>
        </v-btn> -->
          <v-btn icon @click="actionAddToEachOthers(item)" color="error">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
  </div>
</template>

<script>
export default {
  name: "SearchBrothers",

  mounted() {
    this.init();
  },
  data: () => ({
    searchLoading: false,
    headers: [
      {
        text: "الرقم العسكري",
        value: "ID",
        searchValue: "ID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
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
        readonly: true,
        sort: 1
      },
      {
        text: "الوحدة",
        value: "Unit",
        searchValue: "Unit",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "المرحلة",
        value: "RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: false,
        inModel: false,
        sort: 1
      },
      {
        text: "الرقم العسكري للشقيق",
        value: "BrotherMilitaryID",
        searchValue: "BrotherMilitaryID",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 2
      },
      {
        text: "اسم الشقيق",
        value: "Brothers",
        searchValue: "Brothers",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 2
      },
      {
        text: "وحدة الشقيق",
        value: "BrotherUnit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: false,
        sort: 1
      },

      {
        text: "",
        value: "actionAddToBrother",
        searchValue: "",
        sortable: true,
        inSearch: false,
        inModel: false,
        inTable: true,
        sort: 5
      }
    ],
    items: [],
    componentName: "createdObject",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    },
    printer: {}
  }),

  methods: {
    async findItems(filters) {
      if (!filters.RecuStage) {
        this.showError("يجب إختيار المرحلة");
        return;
      }
      let recuSoldiers = await this.api(`global/get_all`, {
        table: "Soldier",
        where: {
          RecuStage: filters.RecuStage
        },
        include: [{ model: "Unit" }]
      });
      console.log("finish all recu soldiers", recuSoldiers);

      let allSoldiers = await this.api(`global/get_all`, {
        table: "Soldier",
        include: [{ model: "Unit" }]
      });
      console.log("finish all soldiers");
      let allRateb = await this.api(`global/get_all`, {
        table: "Rateb",
        include: [{ model: "Unit" }]
      });
      console.log("finish all rateb");

      let Items = [];

      for (let i = 0; i < recuSoldiers.data.length; i++) {
        let recuSoldier = recuSoldiers.data[i];
        if (recuSoldier.Name) {
          allSoldiers.data
            .filter(
              ele =>
                ele.Name.substring(ele.Name.indexOf(" ") + 1) ===
                  recuSoldier.Name.substring(
                    recuSoldier.Name.indexOf(" ") + 1
                  ) && ele.ID !== recuSoldier.ID
            )
            .map(item => {
              let brother = {
                ID: recuSoldier.ID,
                Name: recuSoldier.Name,
                Unit: recuSoldier.Unit.Unit,
                RecuStage: recuSoldier.RecuStage,
                BrotherMilitaryID: item.ID,
                Brothers: item.Name,
                BrotherUnit: item.Unit.Unit
              };
              Items.push(brother);
            });
          allRateb.data
            .filter(
              ele =>
                ele.Name.substring(ele.Name.indexOf(" ") + 1) ===
                  recuSoldier.Name.substring(
                    recuSoldier.Name.indexOf(" ") + 1
                  ) && ele.ID !== recuSoldier.ID
            )
            .map(item => {
              let brother = {
                ID: recuSoldier.ID,

                Name: recuSoldier.Name,
                Unit: recuSoldier.Unit.Unit,
                RecuStage: recuSoldier.RecuStage,
                BrotherMilitaryID: item.ID,
                Brothers: item.Name,
                BrotherUnit: item.Unit.Unit
              };
              Items.push(brother);
            });
        }

        this.$set(this, "items", Items);
      }
    },

    async actionAddToEachOthers(item) {}
  }
};
</script>

<style scoped></style>
