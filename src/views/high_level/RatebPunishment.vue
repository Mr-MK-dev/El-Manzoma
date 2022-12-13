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
      :addButton="true"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في العقوبات"
      addBtnTitle="إضافة عقوبة او محكمة الى راتب العالي"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'العقوبات'"
    >
      <template v-slot:item.SoliderID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.SoliderID}`"
          @click.right="copyText(item.SoliderID)"
        >
          {{ item.SoliderID }}
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
  name: "RatebPunishments",
  components: {
    penalitiesDtails: () =>
      import("@/views/high_level/RatebPunishmentDetails.vue")
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
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "الدرجة",
          value: "Rateb.RatebLevel",
          searchValue: "RatebLevel",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readOnly: true,
          sort: 1
        },
        {
          text: "التاريخ",
          value: "date",
          searchValue: "date",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الجريمة",
          value: "crimeText",
          searchValue: "crimeText",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الجريمة من",
          value: "crimeFromDate",
          searchValue: "crimeFromDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الجريمة الى",
          value: "crimeToDate",
          searchValue: "crimeToDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الفترة بالإيام",
          value: "periodInDays",
          searchValue: "periodInDays",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "رقم الأمر",
          value: "orderNumber",
          searchValue: "orderNumber",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الأمر",
          value: "orderDate",
          searchValue: "orderDate",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "النوع",
          value: "kind",
          searchValue: "kind",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "نوع الجريمة",
          value: "type",
          searchValue: "type",
          sortable: true,
          type: "textarea",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "رفع أثار الجريمة",
          value: "isRemoved",
          searchValue: "isRemoved",
          sortable: true,
          type: "checkbox",
          inSearch: false,
          inTable: false,
          inModel: true,
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

  watch: {
    "Penalities.ID"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    actionAdd() {
      this.$set(this, "Penalities", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.Penalities, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    async saveItem(edirableFromTableItem) {
      if (!this.Penalities.ID) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }

      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.Penalities.isEdit ? "update_one" : "create_one"}`,
          {
            table: "RatebPunishments",
            where: !this.Penalities.isEdit
              ? this.Penalities
              : {
                  IDKEY: this.Penalities.IDKEY
                },
            update: this.Penalities
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },

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

    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      console.log(filters);
      let where = {
          ...filters
        },
        multi = [],
        likes = "ID",
        dates = [
          "date",
          "crimeFromDate",
          "crimeToDate",
          "fromDate",
          "toDate",
          "orderDate",
          "courtDate"
        ];
      try {
        let data = await this.api("global/get_all", {
          table: "RatebPunishments",
          include: [
            {
              model: "Rateb",
              include: [{ model: "Unit" }]
            }
          ],
          where: this.cleanObject(this.mapToQuery(where, likes, multi, dates))
        });
        if (data.data.length == 0 && filters.ID && filters.ID.length) {
          let pendata = await this.api("global/get_all", {
            table: "RatebPenalities",
            include: [
              {
                model: "Rateb",
                include: [{ model: "Unit" }]
              }
            ],
            where: this.cleanObject(this.mapToQuery(where, multi, dates))
          });
          let penDataAfterMapping = pendata.data.map(ele => ({ ...ele }));
          for (let i = 0; i < penDataAfterMapping.length; i++) {
            await this.api("global/create_one", {
              table: "RatebPunishments",
              where: penDataAfterMapping[i]
            });
          }
          data = pendata;
        }
        let punishments = data.data.map(ele => ({
            ...ele,
            withSalaryCut: ele.withSalaryCut ? "نعم" : "لا",
            isCourt: ele.isCourt ? "نعم" : "لا"
          })),
          printer = {
            data: [...punishments],
            excelKey: "punishments",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };
        let group = lodash.groupBy(punishments, ele => ele.ID);
        this.$set(
          this.mainTable,
          "items",
          Object.values(group).map(ele => ele[0])
        );
        this.$set(this.mainTable, "printer", printer);
      } catch (e) {
        console.log(e);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    }
  }
};
</script>
