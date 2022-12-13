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

          <pre-unit-internals
            ref="internals"
            :parentFilters="true"
          ></pre-unit-internals>
        </v-card-text>
      </v-card>
    </v-dialog>

    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الواحدات السابقة"
      addBtnTitle="إضافة وحدة السابقة"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الواحدات السابقة'"
    >
      <template v-slot:item.PreUnitInternals="{ item }">
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

      <template v-slot:item.id="{ item }">
        <v-chip
          color="transparent"
          :to="`/soldiers_plus/${item.id}`"
          @click.right="copyText(item.id)"
        >
          {{ item.id }}
        </v-chip>
      </template>

      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
            v-if="hasEditAccess()"
            icon
            @click="actionEdit(item)"
            color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
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

    <v-dialog
      persistent
      v-model="createdObject.model"
      scrollable
      max-width="750"
    >
      <v-card
        :loading="createdObject.loading"
        :disabled="createdObject.loading"
      >
        <v-card-title>
          <v-spacer></v-spacer>
          <v-btn @click="createdObject.model = false" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <template
              v-for="(h, i) in mainTable.headers
                .filter(h => h.inModel)
                .sort((a, b) => a.sort - b.sort)"
            >
              <v-col :cols="h.cols ? h.cols : '6'" :key="i">
                <v-text-field
                  v-if="!h.type || ['text', 'date'].includes(h.type)"
                  filled
                  :type="h.type == 'date' ? 'date' : 'text'"
                  :label="h.text"
                  v-model="previousUnit[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                  @keypress.enter="findOne()"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :multiple="false"
                  :readonly="h.readonly"
                  v-model="previousUnit[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :items="
                    selects[h.searchValue] ? selects[h.searchValue].data : []
                  "
                  :item-value="
                    selects[h.searchValue]
                      ? selects[h.searchValue].value
                      : 'value'
                  "
                  :item-text="
                    selects[h.searchValue]
                      ? selects[h.searchValue].text
                      : 'text'
                  "
                ></v-autocomplete>
                <v-textarea
                  v-else-if="h.type == 'textarea'"
                  filled
                  :label="h.text"
                  v-model="previousUnit[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  auto-grow
                  :readonly="h.readonly"
                  rows="1"
                ></v-textarea>
                <v-card
                  v-else-if="h.type == 'checkbox'"
                  flat
                  tile
                  color="transparent"
                  class="pa-0 ma-0"
                  :disabled="h.readonly"
                >
                  <v-btn-toggle
                    v-model="previousUnit[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        previousUnit[h.searchValue] === true
                          ? 'error white--text'
                          : ''
                      "
                      :value="true"
                      v-text="h.trueValue"
                    ></v-btn>
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        previousUnit[h.searchValue] === false
                          ? 'success white--text'
                          : ''
                      "
                      :value="false"
                      v-text="h.falseValue"
                    ></v-btn>
                  </v-btn-toggle>
                </v-card>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-4">
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            outlined
            large
            class="px-6"
            @click="createdObject.model = false"
            v-text="'رجوع'"
          ></v-btn>
          <v-btn
            color="primary"
            large
            class="px-6"
            @click="saveItem()"
            v-text="'حفظ '"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const constants = require("../../Constant").default;
const lodash = require("lodash");
const types = require("../../server-sequelize/reciever/af/sections/tasgeel/reports/types")
  .default;

export default {
  name: "Preuint",
  components: {
    preUnitInternals: () => import("@/views/high_level/preUnitsDetails.vue")
  },

  props: {},
  mounted() {
    this.init();
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

    previousUnit: {},
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
          text: "الوحدات السابقة",
          value: "PreUnitInternals",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "الرقم العسكري",
          value: "id",
          searchValue: "id",
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
          readonly: true,
          sort: 1
        },
        {
          text: "الوحدة السابقة",
          value: "Unit.Unit",
          searchValue: "uintid",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        },

        {
          text: "تاريخ الضم علي الوحدة",
          value: "todam",
          searchValue: "todam",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الانتقال من الوحدة",
          value: "fromdam",
          searchValue: "fromdam",
          sortable: true,
          type: "date",
          inSearch: true,
          inTable: false,
          inModel: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "Preuint",
    selects: {
      uintid: {
        table: "Unit",
        value: "UnitID",
        text: "Unit",
        ignoreStatus: true
      }
    }
  }),
  watch: {
    "previousUnit.id"(newValue) {
      this.findOne(newValue);
    }
  },
  methods: {
    async getInternals(item) {
      if (this.$refs.internals) {
        this.$refs.internals.mainTable.headers.forEach(function(obj) {});
        this.$refs.internals.preUnitDetails.id = item.id;
        this.$set(this.$refs.internals.preUnitDetails, "id", item.id);

        await this.$refs.internals.findItems({ id: [item.id] });
      } else {
        window.setTimeout(async () => {
          await this.getInternals(item);
        }, 1000);
      }
    },

    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      }).then(async res => {
        if (res) {
          await this.api(`global/delete_all`, {
            table: "preuint",
            where: {
              con: item.con
            }
          });
          this.findItems({});
        }
      });
    },
    async saveItem(edirableFromTableItem) {
      if (!this.previousUnit.Name) {
        return this.showError("هذا الفرد غير مسجل لدينا");
      }
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(
          `global/${this.previousUnit.isEdit ? "update_one" : "create_one"}`,
          {
            table: "preuint",
            where: !this.previousUnit.isEdit
              ? this.previousUnit
              : {
                  con: this.previousUnit.con
                },
            update: this.previousUnit
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.$set(this.createdObject, "model", false);

          this.showSuccess("تم حفظ ");
          this.findItems({});
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
          where: { ID: id }
        })
          .then(x => {
            console.log(x);
            this.$set(this.previousUnit, "Name", x.data.Name);
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
        multi = [],
        dates = ["todam", "fromdam"];

      this.api("global/get_all", {
        table: "preuint",
        include: [{ model: "Rateb" }, { model: "Unit" }],
        where: this.mapToQuery(where, multi, dates)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          let group = lodash.groupBy(data, ele => ele.id);
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
    },
    actionAdd() {
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "previousUnit", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
