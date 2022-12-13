<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      v-if="!id"
      :clearOption="true"
      title="بحث متقدم في التناسق"
      addBtnTitle="إضافة الي التناسق"
    />
    <editor-dialog-bulider
      title="بيانات التناسق"
      :open="showAddDialog"
      @on-close="showAddDialog = false"
      :loading="loading"
      :fields="headers"
      :data="Fitting"
      @on-submit="saveItem()"
    />
    <editor-dialog-bulider />

    <v-card-title v-if="id">
      <v-spacer />

      <v-btn @click="actionAdd()" large outlined color="primary">
        اضافة التناسق
      </v-btn>
    </v-card-title>

    <v-card-title>
      <v-btn large outlined color="primary">
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
      <template v-slot:item.editor="{ item }">
        <v-chip color="transparent" v-if="hasDeleteAccess()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
      <template v-slot:item.weights="{ item }">
        <v-chip color="transparent">
          <v-btn icon @click="actionToDetails(item)" color="red">
            <v-icon>mdi-eye</v-icon>
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
    <v-dialog
      persistent
      v-model="details.model"
      scrollable
      width="1200"
      style="background: rgba(0,0,0,0.5)"
    >
      <v-card>
        <v-card-text>
          <v-btn @click="details.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <fitDetails ref="fittingdetails" :parentFilters="true"></fitDetails>
        </v-card-text>
      </v-card>
    </v-dialog>

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
import fitDetails from "@/components/sections/tasgeel/soldier_plus/soldier_profile/basic_profile/cards/fitting.vue";
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "Fittings",
  components: {
    fitDetails
  },
  props: {
    id: {
      type: String,
      default: () => ""
    }
  },
  mounted() {
    this.init();
  },
  data: () => ({
    Fitting: {},

    details: {
      model: false,
      loading: false
    },
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
        data: constants.ratebLevels
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
          text: "الاوزان",
          value: "weights",
          searchValue: "weights",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الرقم العسكري",
          value: "RATEB_ID",
          searchValue: "RATEB_ID",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الاسم",
          value: "Rateb.Name",
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
          text: "السن",
          value: "Age",
          searchValue: "Age",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true,
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
          inModel: false,
          readonly: true,
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
          inModel: false,
          sort: 1
        },
        {
          text: "الفئة",
          value: "Rateb.RatebCategory",
          searchValue: "RatebCategory",
          sortable: true,
          type: "select",
          inSearch: true,
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
          required: true,
          sort: 1
        },
        {
          text: "الوزن",
          value: "Weight",
          searchValue: "Weight",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "الوزنة الاولى",
          value: "first_weight.Weight",
          searchValue: "first_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوزنة الثانية",
          value: "second_weight.Weight",
          searchValue: "second_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوزنة الثالثة",
          value: "third_weight.Weight",
          searchValue: "third_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوزنة الرابعة",
          value: "fourth_weight.Weight",
          searchValue: "fourth_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوزنة الخامسة",
          value: "fifth_weight.Weight",
          searchValue: "fifth_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
          inModel: false,
          sort: 1
        },
        {
          text: "الوزنة السادسة",
          value: "sixth_weight.Weight",
          searchValue: "sixth_weight.Weight",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: true,
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
        // {
        //   text: "الفرق",
        //   value: "Difference",
        //   searchValue: "Difference",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: false,
        //   sort: 1
        // },
        // {
        //   text: "متناسق",
        //   value: "Fit",
        //   searchValue: "Fit",
        //   sortable: true,
        //   type: "select",
        //   inSearch: true,
        //   inTable: true,
        //   inModel: true,
        //   sort: 1
        // },
        // {
        //   text: "التاريخ الأضافة",
        //   value: "DateAdded",
        //   searchValue: "DateAdded",
        //   sortable: true,
        //   type: "date",
        //   inSearch: false,
        //   inTable: false,
        //   inModel: false,
        //   sort: 1
        // },
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
    async actionToDetails(item) {
      this.$set(this.details, "model", true);
      this.$set(this.$refs.fittingdetails, "RATEB_ID", item.RATEB_ID);
      await this.$refs.fittingdetails.findItems({ RATEB_ID: item.RATEB_ID });
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
          this.findItems({});
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

          let returnedItems = [];

          Object.keys(groupedDateById).forEach(key => {
            if (groupedDateById[key].length >= 6) {
              returnedItems.push({
                ...groupedDateById[key][0],
                first_weight:
                  groupedDateById[key][groupedDateById[key].length - 6],
                second_weight:
                  groupedDateById[key][groupedDateById[key].length - 5],
                third_weight:
                  groupedDateById[key][groupedDateById[key].length - 4],
                fourth_weight:
                  groupedDateById[key][groupedDateById[key].length - 3],
                fifth_weight:
                  groupedDateById[key][groupedDateById[key].length - 2],
                sixth_weight:
                  groupedDateById[key][groupedDateById[key].length - 1]
              });
            } else {
              returnedItems.push({
                ...groupedDateById[key][0],
                first_weight: groupedDateById[key][0],
                second_weight: groupedDateById[key][1] ?? null,
                third_weight: groupedDateById[key][2] ?? null,
                fourth_weight: groupedDateById[key][3] ?? null,
                fifth_weight: groupedDateById[key][4] ?? null,
                sixth_weight: null
              });
            }

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

          console.log("Returned Data", returnedItems[0]);
          this.$set(this.mainTable, "items", returnedItems);
          let printer = {
            data: printedObject.items,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };

          // this.$set(this.mainTable, "items", data);
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
        RATEB_ID: this.id
      });
      if (this.id) {
        await this.findOne(this.id);
      }
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
