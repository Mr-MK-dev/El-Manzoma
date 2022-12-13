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

          <penalities-dtails
            ref="internals"
            :parentFilters="true"
          ></penalities-dtails>
        </v-card-text>
      </v-card>
    </v-dialog>

    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      :addButton="false"
      :clearOption="true"
      title="بحث متقدم في العقوبات"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'العقوبات'"
    >
      <template v-slot:item.id="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.id}`"
          @click.right="copyText(item.id)"
        >
          {{ item.id }}
        </v-chip>
      </template>
      <template
        v-if="isAdmin() || hasEditAccess()"
        v-slot:item.PenalitiesInternals="{ item }"
      >
        <v-chip class="transparent">
          <v-btn
            icon
            @click="
              Internals.model = true;
              getInternals(item);
            "
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="Penalities"
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
  name: "RatebPenalities",
  components: {
    penalitiesDtails: () => import("@/views/high_level/PenalitiesDetails.vue")
  },

  props: {},
  mounted() {
    this.init();
  },
  data: () => ({
    Penalities: {},
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "العقوبات والجرائم",
          value: "PenalitiesInternals",
          searchValue: "PenalitiesInternals",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "ID",
          searchValue: "ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
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
          value: "Rateb.Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          readOnly: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      UnitID: {
        text: "Unit",
        value: "UnitID",
        table: "Unit"
      },
      RatebLevel: {
        text: "text",
        value: "text",
        data: constants.ratebLevels.data
      }
    }
  }),
  methods: {
    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.penalitiesDetails.ID = item.ID;
        this.$set(this.$refs.internals.penalitiesDetails, "ID", item.ID);

        await this.$refs.internals.findItems({ ID: [item.ID] });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 1000);
      }
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);
      let where = {
          ...filters
        },
        multi = [],
        dates = [
          "date",
          "crimeFromDate",
          "crimeToDate",
          "fromDate",
          "toDate",
          "orderDate",
          "courtDate"
        ];
      this.api("global/get_all", {
        table: "RatebPenalities",
        include: [
          {
            model: "Rateb",
            include: [{ model: "Unit" }]
          }
        ],
        where: this.cleanObject(this.mapToQuery(where, multi, dates))
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              withSalaryCut: ele.withSalaryCut ? "نعم" : "لا",
              isCourt: ele.isCourt ? "نعم" : "لا"
            })),
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          let group = lodash.groupBy(data, ele => ele.ID);
          this.$set(
            this.mainTable,
            "items",
            Object.values(group).map(ele => ele[0])
          );
          this.$set(this.mainTable, "printer", printer);
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
