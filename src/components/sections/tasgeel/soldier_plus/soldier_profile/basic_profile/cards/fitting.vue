<template>
  <div>
    <v-card-title>
      <v-spacer />

      <v-btn
        v-if="isAdmin()"
        @click="actionAdd()"
        large
        outlined
        color="primary"
      >
        اضافة تناسق
      </v-btn>
    </v-card-title>

    <v-card-title>
      <v-btn
        @click="actionOrganizeAndPrintData()"
        large
        outlined
        color="primary"
      >
        طباعة التناسق
      </v-btn>
    </v-card-title>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'التناسق'"
      :wordFile="'/rateb/fitings'"
      :isExcel="true"
    >
      <template v-if="isAdmin()" v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="isAdmin()">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.RATEB_ID="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.RATEB_ID}`"
          @click.right="copyText(item.RATEB_ID)"
        >
          {{ item.RATEB_ID }}
        </v-chip>
      </template>
    </table-bulider>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="Fitting"
      :selects="selects"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("@/Constant");
const lodash = require("lodash");

export default {
  name: "Fittings",
  props: {
    parentFilters: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },

  async mounted() {
    if (!this.parentFilters) {
      await this.findItems({ RATEB_ID: this.conscripte.ID });
    }
    this.init();
  },
  data: () => ({
    Fitting: {},

    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    searchLoading: false,
    selects: {
      Fit: {
        text: "title",
        value: "value",
        data: [
          { title: "نعم", value: 1 },
          { title: "لا", value: 0 }
        ]
      },
      RatebLevel: {
        table: "Levels",
        text: "Level",
        value: "Level"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      RatebCategory: constants.SoldierCategory
    },
    mainTable: {
      headers: [
        {
          text: "",
          value: "editor",
          searchValue: "editor",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "السن",
          value: "Age",
          searchValue: "Age",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true,
          sort: 1
        },
        {
          text: "الطول",
          value: "Height",
          searchValue: "Height",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الوزن",
          value: "Weight",
          searchValue: "Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "الفرق",
          value: "Difference",
          searchValue: "Difference",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "متناسق",
          value: "Fit",
          searchValue: "Fit",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "التاريخ الأضافة",
          value: "DateAdded",
          searchValue: "DateAdded",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: false,
          inModel: false,
          sort: 1
        },
        {
          text: "تاريخ الوزن",
          value: "WeightedAt",
          searchValue: "WeightedAt",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "مستثنى",
          value: "Excluded",
          searchValue: "Excluded",
          sortable: true,
          forAdmin: true,
          type: "checkbox",
          inSearch: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "ملحوظة",
          value: "Notes",
          searchValue: "Notes",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          forAdmin: true,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {},
      printedData: {}
    }
  }),
  watch: {
    "Fitting.RATEB_ID"(newValue) {
      this.findOne(newValue);
      this.findFitting();
    },
    "Fitting.Weight"() {
      this.findFitting();
    },
    "Fitting.Height"() {
      this.findFitting();
    }
  },
  methods: {
    async actionEdit(item) {
      this.findOne(item.RATEB_ID);
      this.findFitting();
      this.$set(this, "Fitting", {
        isEdit: true,
        RATEB_ID: item.RATEB_ID,
        ...item,
        Excluded: item.Excluded === "نعم" ? 1 : 0,
        Fit: item.Fit === "نعم" ? 1 : 0
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Fittings",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems();
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.Fitting.RATEB_ID) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      try {
        this.$set(this.createdObject, "loading", true);
        this.Fitting.DateAdded = new Date();
        this.Fitting.Difference =
          this.Fitting.Weight - (this.Fitting.Height - 100.0);
        let saveItem;

        saveItem = await this.api(
          `global/${this.Fitting.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Fittings",
            where: !this.Fitting.isEdit
              ? this.Fitting
              : {
                  ID_KEY: this.Fitting.ID_KEY
                },
            update: this.Fitting
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({ RATEB_ID: this.conscripte.ID });
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

    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { id }
        })
          .then(x => {
            this.$set(this.Fitting, "Name", x.data.Name);
            if (x) {
              this.$set(
                this.Fitting,
                "Age",
                this.calculateAge(this.nationalIdToDate(x.data.IdentityNo))
              );
              console.log(this.Fitting.Age);
            }
          })
          .catch(error => {})
          .finally(() => {});
      }
    },

    findFitting() {
      if (this.Fitting.Age && this.Fitting.Weight && this.Fitting.Height) {
        this.api("global/get_all", {
          table: "FittingRules"
        })
          .then(x => {
            try {
              let difference =
                this.Fitting.Weight - (this.Fitting.Height - 100);
              for (let i = 0; i < x.data.length; i++) {
                if (
                  this.Fitting.Age >= x.data[i].AgeFrom &&
                  this.Fitting.Age <= x.data[i].AgeTo
                ) {
                  if (
                    difference >= x.data[i].DifferenceFrom &&
                    difference <= x.data[i].DifferenceTo
                  ) {
                    this.$set(this.Fitting, "Fit", 1);
                  } else {
                    this.$set(this.Fitting, "Fit", 0);
                  }
                }
              }
            } catch (e) {
              console.log(e);
            }
          })
          .catch(error => {})
          .finally(() => {});
      }
    },
    findItems(filters) {
      console.log("filters", filters);
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["id"],
        multi = [];

      where = this.mapToQuery(where, likes, multi);
      this.api("global/get_all", {
        table: "Fittings",
        include: [
          {
            model: "Rateb",
            where: this.cleanObject({
              RatebLevel: where.RatebLevel,
              Name: where.Name,
              UnitID: where.UnitID
            }),
            include: [
              {
                model: "Unit"
              }
            ]
          }
        ],
        where: this.cleanObject({
          Fit: where.Fit,
          Weight: where.Weight,
          Height: where.Height,
          RATEB_ID: where.RATEB_ID
        })
      })
        .then(x => {
          console.log(x.data);
          let data = x.data.map(ele => ({
            ...ele,
            Age: this.calculateAge(this.nationalIdToDate(ele.Rateb.IdentityNo)),
            Fit: ele.Fit ? "نعم" : "لا",
            Excluded: ele.Excluded ? "نعم" : "لا"
          }));

          let printedData = data.map(ele => {
            let dateString = new Date(ele.WeightedAt)
              .toISOString()
              .split("T")[0]
              .split("-");

            return {
              ...ele,
              date: `${dateString[0]}-${dateString[1]}`
            };
          });

          let groupedDateWithMonth = lodash.groupBy(
            printedData,
            ele => ele.date
          );
          let dates = lodash
            .orderBy(
              Object.keys(groupedDateWithMonth),
              ele => new Date(ele),
              "desc"
            )
            .splice(0, 5);

          let printedObject = {
            items: []
          };
          let groupedDateById = lodash.groupBy(
            printedData,
            ele => ele.RATEB_ID
          );
          Object.keys(groupedDateById).forEach(key => {
            printedObject.items.push({
              ...groupedDateById[key][0],
              first_date: dates[0],
              second_date: dates[1],
              thrid_date: dates[2],
              fourth_date: dates[3],
              fifth_date: dates[4],
              firstDate: {
                weight:
                  groupedDateById[key].find(ele => ele.date == dates[0])
                    ?.Weight || 0,
                difference:
                  groupedDateById[key].find(ele => ele.date == dates[0])
                    ?.Difference || 0
              },
              secondDate: {
                weight:
                  groupedDateById[key].find(ele => ele.date == dates[1])
                    ?.Weight || 0,
                difference:
                  groupedDateById[key].find(ele => ele.date == dates[1])
                    ?.Difference || 0
              },
              thridDate: {
                weight:
                  groupedDateById[key].find(ele => ele.date == dates[2])
                    ?.Weight || 0,
                difference:
                  groupedDateById[key].find(ele => ele.date == dates[2])
                    ?.Difference || 0
              },
              fourthDate: {
                weight:
                  groupedDateById[key].find(ele => ele.date == dates[3])
                    ?.Weight || 0,
                difference:
                  groupedDateById[key].find(ele => ele.date == dates[3])
                    ?.Difference || 0
              },
              fifthDate: {
                weight:
                  groupedDateById[key].find(ele => ele.date == dates[4])
                    ?.Weight || 0,
                difference:
                  groupedDateById[key].find(ele => ele.date == dates[4])
                    ?.Difference || 0
              }
            });
          });
          let printer = {
            data: printedObject.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    async actionAdd() {
      this.$set(this, "Fitting", {
        isEdit: false,
        RATEB_ID: this.conscripte.ID
      });
      if (this.conscripte.ID) {
        await this.findOne({ RATEB_ID: this.conscripte.ID });
      }
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
