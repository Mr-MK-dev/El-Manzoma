<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المرتبات"
      addBtnTitle=" إضافة مرتب"
    />

    <v-card>
      <v-card-title>
        <v-btn color="praimary" @click="openUnitsStats()">
          بيان عددي بالوحدات
        </v-btn>
      </v-card-title>
    </v-card>

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :hasSort="true"
      :items="mainTable.items"
      :title="'المرتبات'"
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

      <template v-slot:item.actions="{ item }">
        <v-chip class="transparent">
          <v-btn icon @click="actionEdit(item)" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>

    <v-dialog
      persistent
      v-model="UnitsStats.isDisplayed"
      scrollable
      max-width="750"
    >
      <v-card>
        <v-btn @click="UnitsStats.isDisplayed = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <table-bulider
          :headers="UnitsStats.headers"
          :printer="UnitsStats.printer"
          :hasSort="true"
          :items="UnitsStats.items"
          :title="'المرتبات'"
        >
        </table-bulider>
      </v-card>
    </v-dialog>

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
                  v-model="salary[h.searchValue]"
                  :hide-details="h.hint ? false : true"
                  :persistent-hint="h.hint ? true : false"
                  :readonly="h.readonly"
                  @keypress.enter="findSolider()"
                ></v-text-field>
                <v-autocomplete
                  v-else-if="h.type == 'select'"
                  filled
                  :label="h.text"
                  :readonly="h.readonly"
                  v-model="salary[h.searchValue]"
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
                  v-model="salary[h.searchValue]"
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
                    v-model="salary[h.searchValue]"
                    class="d-block"
                    mandatory
                  >
                    <v-btn
                      height="58"
                      width="50%"
                      :color="
                        salary[h.searchValue] === true
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
                        salary[h.searchValue] === false
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

export default {
  name: "UnitManagment",
  mounted() {
    this.init();
  },
  watch: {
    "salary.UNIT_NAME"(newValue) {
      let unit = this.selects.UNIT_NAME.data.find(ele => ele.Unit === newValue);
      this.salary.GEHA_NAME = unit.General_Direction;
      this.salary.NAMAT_NAME = unit.DirectionforFeaat;
      this.salary.TAMARKZ_NAME = unit.DirectionforFeaat;
    }
  },
  data: () => ({
    salary: {},
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
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "الوحدة",
          value: "UNIT_NAME",
          searchValue: "UNIT_NAME",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true
        },
        {
          text: "الوظيفة",
          value: "Job",
          searchValue: "Job",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true,
          readonly: false
        },
        {
          text: "الدرجة",
          value: "Rotaba_Code",
          searchValue: "Rotaba_Code",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true,
          readonly: false
        },
        {
          text: "نوع الخدمة",
          value: "Khedma_Type",
          searchValue: "Khedma_Type",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true,
          readonly: false
        },
        {
          text: "الادارة",
          value: "Weapon",
          searchValue: "Weapon",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true,
          readonly: false
        },
        {
          text: "الفئة",
          value: "Feaa_Code",
          searchValue: "Feaa_Code",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true
        },
        {
          text: "المرتب",
          value: "El_Moratab",
          searchValue: "El_Moratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true
        },
        {
          text: "السياسة",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: false
        },
        {
          text: "الجهة",
          value: "GEHA_NAME",
          searchValue: "GEHA_NAME",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true
        },
        {
          text: "النمط",
          value: "NAMAT_NAME",
          searchValue: "NAMAT_NAME",
          sortable: true,
          type: "texts",
          inSearch: false,
          inTable: true,
          inModel: false,
          readonly: true
        },
        {
          text: "التمركز",
          value: "TAMARKZ_NAME",
          searchValue: "TAMARKZ_NAME",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: true
        },
        {
          text: "",
          value: "actions",
          searchValue: "actions",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: false
        }
      ],
      items: [],
      printer: {}
    },
    UnitsStats: {
      isDisplayed: false,
      headers: [
        {
          text: "الوحدة",
          value: "unitName",
          searchValue: "unitName",
          sortable: true,
          type: "select",
          inSearch: true,
          multiple: true,
          inTable: true,
          inModel: true
        },

        {
          text: "المرتب",
          value: "elMoratab",
          searchValue: "elMoratab",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: false
        },

        {
          text: "السياسة",
          value: "Siasa",
          searchValue: "Siasa",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          readonly: false
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      UNIT_NAME: {
        table: "Unit",
        value: "Unit",
        text: "Unit"
      },
      Weapon: {
        table: "Weapon",
        value: "Weapon",
        text: "Weapon"
      },
      Rotaba_Code: {
        value: "text",
        text: "text",
        data: constants.SoldierLevel.data
      },
      Feaa_Code: {
        value: "text",
        text: "text",
        data: constants.SoldierCategory.data
      },
      Job: {
        value: "Duty",
        text: "Duty",
        table: "Duty"
      },
      Khedma_Type: {
        text: "text",
        value: "text",
        data: constants.Khedma_Type.data
      }
    }
  }),
  methods: {
    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let result;

      result = await this.api(
        `global/${this.salary.isEdit ? "update_one" : "create_one"}`,
        {
          table: "SMGeneral",
          where: !this.salary.isEdit
            ? this.salary
            : {
                id: this.salary
              },
          update: this.salary
        }
      );

      if (result && result.data && result.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems();
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },
    findItems(filters) {
      if (filters) this.search = filters;
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...this.search
        },
        likes = ["ID"],
        multi = [
          "UNIT_NAME",
          "Weapon",
          "Rotaba_Code",
          "Feaa_Code",
          "Job",
          "Khedma_Type"
        ];

      this.api("global/get_all", {
        table: "SMGeneral",
        where: this.mapToQuery(where, likes, multi)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log(error);
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
      this.$set(this, "salary", {
        ...item,
        isEdit: true
      });
    },
    openUnitsStats() {
      const dataGroupByUnitName = lodash.groupBy(
        this.mainTable.items,
        ele => ele.UNIT_NAME
      );
      this.UnitsStats.isDisplayed = true;

      this.UnitsStats.items = Object.keys(dataGroupByUnitName).map(key => ({
        unitName: key,
        elMoratab: dataGroupByUnitName[key].reduce(
          (prev, ele) => prev + ele.El_Moratab,
          0
        ),
        Siasa: dataGroupByUnitName[key].reduce(
          (prev, ele) => prev + ele.Siasa,
          0
        )
      }));

      this.UnitsStats.items = [
        {
          unitName: "اجمالي",
          elMoratab: this.UnitsStats.items.reduce(
            (prev, ele) => prev + ele.elMoratab,
            0
          ),
          Siasa: this.UnitsStats.items.reduce(
            (prev, ele) => prev + ele.Siasa,
            0
          )
        },
        ...this.UnitsStats.items
      ];
      this.UnitsStats.printer = {
        data: [...this.UnitsStats.items],
        excelKey: "data",
        excelHeaders: this.UnitsStats.headers.filter(f => f.inTable)
      };
    }
  }
};
</script>
