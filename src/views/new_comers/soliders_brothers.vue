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
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card-title class="transparent">
      <v-btn large outlined @click="Internals.model = true" color="primary">
        بحث عن تشابه الأسماء
      </v-btn>
    </v-card-title>

    <search-bulider
      :fields="headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الأشقاء"
      addBtnTitle="إضافة شقيق"
    />
    <table-bulider
      :headers="headers"
      :printer="printer"
      :items="items"
      :title="'الأشقاء'"
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
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <!-- <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn> -->
          <v-btn
            v-if="hasDeleteAccess()"
            icon
            @click="actionDelete(item)"
            color="error"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="headers"
      :selects="selects"
      :data="brother"
      @on-submit="saveItem()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "solider_brothers",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
  },

  components: {
    unitInternals: () => import("@/views/new_comers/SoldiersBrotherSearch.vue")
  },

  mounted() {
    // this.initDates();
    this.init();
  },
  filters: {
    filterStrLimit(str, limit) {
      return `${str.length <= limit ? str : str.substr(0, limit) + ".."}`;
    }
  },
  watch: {
    "brother.ID"(v) {
      this.findSolider();
    }
  },
  data: () => ({
    Internals: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    groupedValue: [],
    subjectLimit: 10,
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    textDialog: {
      model: false,
      fullscreen: false,
      title: "",
      text: ""
    },
    search: {
      WeaponID: types.harsHododId
    },
    searchLoading: false,
    headers: [
      {
        text: "",
        value: "actionsStart",
        searchValue: "",
        sortable: true,
        inSearch: false,
        inModel: false,
        inTable: true,
        sort: 5
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
        value: "Soldier.Name",
        searchValue: "Name",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: false,
        readonly: true,
        sort: 1
      },
      {
        text: "الوحدة",
        value: "Soldier.Unit.Unit",
        searchValue: "UnitID",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
        inModel: false,
        sort: 1
      },
      {
        text: "المرحلة",
        value: "Soldier.RecuStage",
        searchValue: "RecuStage",
        sortable: true,
        type: "select",
        inSearch: true,
        inTable: true,
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
        text: "ملاحظات",
        value: "BNotes",
        searchValue: "BNotes",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 3
      }
    ],
    brother: {},
    items: [],
    tableFilters: {},
    componentName: "createdObject",
    selects: {
      SituationID: {
        table: "EffectSituationStates",
        value: "SituationID",
        text: "Situation"
      },
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      },
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      }
    },
    printer: {}
  }),
  methods: {
    // async getInternals(item) {
    //   if (this.$refs.internals) {
    //     this.$refs.internals.headers.forEach(function(obj) {});
    //     // this.$refs.internals.gradeDetails.SoliderID = item.SoliderID;
    //     // this.$set(
    //     //     this.$refs.internals.gradeDetails,
    //     //     "SoliderID",
    //     //     item.SoliderID
    //     // );
    //
    //     // await this.$refs.internals.findItems({ SoliderID: [item.SoliderID] });
    //   } else {
    //     window.setTimeout(async () => {
    //       await this.getInternals(item);
    //     }, 1000);
    //   }
    // },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "Brothers",
              where: {
                ID_KEY: item.ID_KEY
              }
            });
            this.findItems({});
          }
        })
        .catch(err => {
          this.handleError(err);
        });
    },

    async findOne(id) {
      if (id.length > 10) {
        let x;

        try {
          x = await this.api("global/get_one", {
            table: "Rateb",
            where: { ID: id }
          });
          this.$set(this.travel, "Name", x.data.Name);
        } catch (error) {
          this.handleError(error);
        }
      }
    },
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/create_one`, {
          table: "Brothers",
          where: this.brother
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          await this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.handleError(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters,
          RecuStage: null,
          UnitID: null,
          WeaponID: null
        },
        likes = ["ID"],
        multi = [];
      Object.keys(where).forEach(key => {
        let val = where[key];
        if (!val && val !== false && val !== 0) {
          delete where[key];
          return;
        }
        if (likes.includes(key)) {
          where[key] = {
            $like: `%${val}%`
          };
        } else if (multi.includes(key)) {
          where[key] = {
            $in: val
          };
        }
      });
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "Brothers",
          include: [
            {
              model: "Soldier",
              where: this.cleanObject({
                UnitID: filters.UnitID,
                RecuStage: filters.RecuStage,
                WeaponID: filters.WeaponID
              }),
              include: [
                {
                  model: "Unit"
                }
              ]
            }
          ],
          where
        });
        let data = x.data,
          printer = {
            cons: [...data],
            excelKey: "cons",
            excelHeaders: this.headers.filter(f => f.inTable)
          };

        this.$set(this, "items", data);
        this.$set(this, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    findSolider() {
      console.log("xx");
      let search = this.search;
      this.api("global/get_one", {
        table: "Soldier",
        search: { ID: this.brother.ID }
      })
        .then(x => {
          this.$set(this.brother, "Name", x.data.Name);
        })
        .catch(error => {
          this.handleError(error);
        })
        .finally(() => {});
    },
    init(specificTable = "") {
      // Get selects
      Object.keys(this.selects).forEach(key => {
        let { table, localTable, text, value } = this.selects[key];
        if (table) {
          let obj = {
            table
          };
          // obj.attrs = [text, value];
          this.$set(this.selects[key], "loading", true);
          this.api("global/get_all", obj)
            .then(x => {
              this.$set(this.selects[key], "data", x.data);
            })
            .catch(error => {
              console.log(error);
              this.$set(
                this.selects[key],
                "error",
                "حدث خطأ أثناء استدعاء الداتا من قاعدة البيانات"
              );
            })
            .finally(() => {
              this.$set(this.selects[key], "loading", false);
            });
        }
      });
    },
    initDates() {
      let dates = this.headers
        .filter(h => h.type == "date")
        .map(h => h.searchValue);
      dates.forEach(d => {
        this.$set(this.search, d, []);
      });
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  }
};
</script>
