<template>
  <div>
    <v-card-title class="transparent">
      <v-btn large outlined @click="actionSearch()" color="primary">
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
      <template v-slot:item.="{ item }">
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
        v-slot:item.actionsStart="{ item }"
      >
        <v-chip color="transparent">
          <!-- <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn> -->
          <v-btn
            v-if="isAdmin()"
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
const constants = require("../../../Constant").default;
const lodash = require("lodash");
const types = require("../../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "Brothers",
  props: {
    parentFilters: {
      type: Boolean,
      default: () => {}
    }
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
      this.findSolider(v);
    },
    "brother.BrotherMilitaryID"(v) {
      this.findBrother(v);
    }
  },
  data: () => ({
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
        required: true,
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
        required: true,
        sort: 2
      },
      {
        text: "ملاحظات",
        value: "BNotes",
        searchValue: "BNotes",
        sortable: true,
        type: "textarea",
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
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    },
    printer: {}
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "Brothers",
            where: {
              ID_KEY: item.ID_KEY
            }
          });
          this.findItems({});
        }
      });
    },

    findOne(id) {
      if (id.length > 10) {
        this.api("global/get_one", {
          table: "Rateb",
          where: { ID: id }
        })
          .then(x => {
            console.log(x);
            this.$set(this.travel, "Name", x.data.Name);
          })
          .catch(error => {})
          .finally(() => {});
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
          this.findItems({});
          this.createdObject, "model", false;
        } else {
          this.showError("تعذر حفظ  في قاعدة البيانات");
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        console.log(error);
        this.showError("تعذر حفظ  في قاعدة البيانات");
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    //2015105203473
    findItems(filters) {
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
      this.api("global/get_all", {
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
      })
        .then(x => {
          let data = x.data,
            printer = {
              cons: [...data],
              excelKey: "cons",
              excelHeaders: this.headers.filter(f => f.inTable)
            };

          this.$set(this, "items", data);
          this.$set(this, "printer", printer);
        })
        .catch(error => {
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    findSolider(id) {
      console.log("xx");
      let search = this.search;
      this.api("global/get_one", {
        table: "Soldier",
        where: { ID: id }
      })
        .then(x => {
          this.$set(this.brother, "Name", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
      this.api("global/get_one", {
        table: "Rateb",
        where: { ID: id }
      })
        .then(x => {
          this.$set(this.brother, "Name", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
    },
    findBrother(id) {
      console.log("yyyyy");
      let search = this.search;
      this.api("global/get_one", {
        table: "Soldier",
        where: { ID: id }
      })
        .then(x => {
          this.$set(this.brother, "Brothers", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
      this.api("global/get_one", {
        table: "Rateb",
        where: { ID: id }
      })
        .then(x => {
          this.$set(this.brother, "Brothers", x.data.Name);
        })
        .catch(error => {})
        .finally(() => {});
    },

    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionSearch() {
      this.$router.push(`/SearchBrothers`);
    }
  }
};
</script>
