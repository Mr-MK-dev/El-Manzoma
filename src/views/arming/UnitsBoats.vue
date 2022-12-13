<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في لنش الوحدات"
      addBtnTitle="إضافة لنش جديدة"
    />

    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col v-for="item in groupedItems" :key="item" cols="12" sm="6">
          <v-card class="pa-2" outlined tile>
            {{ item.type }} : {{ item.number }}
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'لنش الوحدات'"
    >
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
            color="transparent"
            @click="deleteItem(item)"
          >
            <v-icon color="error">mdi-delete</v-icon>
          </v-btn>
        </v-chip>
      </template>
    </table-bulider>
    <editor-dialog-bulider
      :title="'إضافة لنش جديدة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="unitBoat"
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
  name: "UnitsBoats",
  mounted() {
    this.init();
  },
  data: () => ({
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    del: {
      loading: false,
      model: false,
      id: null,
      type: false
    },
    unitBoat: {},
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "",
          value: "actionsStart",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 1
        },
        {
          text: "نوع اللنش",
          value: "Boat.Name",
          searchValue: "BoatID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "عدد اللنشات",
          value: "TotalBoats",
          searchValue: "TotalBoats",
          type: "text",
          sortable: true,
          inTable: true,
          inSearch: false,
          required: true,
          inModel: true
        }
      ],
      items: [],
      printer: []
    },
    groupedItems: [],

    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      BoatID: {
        table: "Boats",
        value: "ID_KEY",
        text: "Name"
      }
    }
  }),

  methods: {
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = [],
        multi = [],
        date = [];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "UnitBoats",
        where: where,
        include: [
          {
            model: "Unit"
          },
          {
            model: "Boats"
          }
        ]
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [
                ...data.map(ele => ({
                  ...ele
                }))
              ],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(
                f => f.inTable && f.text.length
              )
            };
          console.log(data);
          let totals = Object.values(
            lodash.groupBy(data, ele => ele.Boat.ID_KEY)
          ).map(ele => ({
            type: ele[0].Boat.Name,
            number: lodash.sumBy(ele, ele => ele.TotalBoats)
          }));
          console.log(totals);
          totals.push({
            type: "الإجمالي",
            number: lodash.sumBy(totals, ele => ele.number)
          });
          this.$set(this, "groupedItems", totals);
          this.$set(this.mainTable, "items", data);
          this.$set(this.mainTable, "printer", printer);
        })
        .catch(error => {
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
          console.log("the error", error);
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      if (this.unitBoat.TakenAction) {
        this.$set(this.unitBoat, "Continuity", false);
      }

      saveItem = await this.api(
        `global/${this.unitBoat.isEdit ? "update_one" : "create_one"}`,
        {
          table: "UnitBoats",
          where: !this.unitBoat.isEdit
            ? this.unitBoat
            : {
                ID_KEY: this.unitBoat.ID_KEY
              },
          update: this.unitBoat
        }
      );

      if (saveItem && saveItem.data && saveItem.ok) {
        this.showSuccess("تم حفظ ");
        this.findItems({});
        this.createdObject, "model", false;
      } else {
        this.showError("تعذر حفظ  في قاعدة البيانات");
      }
      this.$set(this.createdObject, "loading", false);
      this.$set(this.createdObject, "model", false);
    },

    actionAdd() {
      this.$set(this, "unitBoat", {});

      this.$set(this, "unitBoat", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "unitBoat", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "UnitBoats",
          where: {
            ID_KEY: item.ID_KEY
          }
        });
      if (delItem && delItem.ok && delItem.data) {
        this.showSuccess(`تم ${type ? "استعادة" : "حذف"} المطلوب`);
        this.$set(this.del, "model", false);
        this.$set(this.del, "id", "");
        this.$set(this.del, "type", false);
        this.findItems({});
      } else {
        this.showError(`تعذر ${isVisible ? "استعادة" : "حذف"} المطلوب.`);
      }
      this.$set(this.del, "loading", false);
    }
  }
};
</script>
