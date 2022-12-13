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
      title="بيانات التناسق الخ"
      :open="createdObject.model"
      @on-close="createdObject.model = false"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
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
        <v-chip color="transparent" v-if="isAdmin()">
          <v-btn icon @click="actionDelete(item)" color="red">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
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
const constants = require("../../Constant").default;
const lodash = require("lodash");

export default {
  name: "AdminFittings",

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
          text: "تاريخ الوزن",
          value: "WeightedAt",
          searchValue: "WeightedAt",
          sortable: true,
          type: "date",
          inSearch: false,
          inTable: true,
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

          this.$set(this.mainTable, "items", data);
          let printer = {
            data: data,
            excelKey: "data",
            excelHeaders: this.mainTable.headers.filter(f => f.inTable)
          };
          //
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
