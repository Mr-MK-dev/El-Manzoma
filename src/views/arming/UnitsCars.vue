<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في مركبات الوحدات"
      addBtnTitle="إضافة مركبة جديدة"
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
      :title="'مركبات الوحدات'"
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
      :title="'إضافة مركبة جديدة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="unitCar"
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
  name: "UnitsCars",
  mounted() {
    this.init();
  },
  data: () => ({
    groupedItems: [],
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
    unitCar: {},
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
          text: "رقم العربة",
          value: "CarNumber",
          searchValue: "CarNumber",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "رقم الشاسيه",
          value: "ChassetNumber",
          searchValue: "ChassetNumber",
          sortable: true,
          type: "text",
          inTable: true,
          inSearch: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الصرف",
          value: "ReleaseDate",
          searchValue: "ReleaseDate",
          type: "date",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,
          inModel: true
        },

        {
          text: "الوحدة",
          value: "Unit.Unit",
          searchValue: "UnitID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "اللون",
          value: "CarColor.Name",
          searchValue: "CarColorID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "التجهيزة",
          value: "CarPreparation.Name",
          searchValue: "CarPreparationID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "النوع",
          value: "CarType.Name",
          searchValue: "CarTypeID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          required: true,

          inModel: true,
          sort: 1
        },
        {
          text: "الحمولة",
          value: "CarCargo.Name",
          searchValue: "CarCargoID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "نوع الاستخدام",
          value: "CarUsage.Name",
          searchValue: "CarUsageID",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: true,
          inModel: true,
          required: true,

          sort: 1
        },
        {
          text: "الحالة",
          value: "Status",
          searchValue: "Status",
          type: "select",
          sortable: true,
          inTable: true,
          inSearch: true,
          required: true,

          inModel: true
        },
        {
          text: "الملاحظات",
          value: "Notes",
          searchValue: "Notes",
          type: "textarea",
          sortable: true,
          inTable: true,
          inSearch: false,
          inModel: true
        }
      ],
      items: [],
      printer: []
    },
    selects: {
      Status: {
        text: "text",
        value: "text",
        data: [
          {
            text: "بالخدمة"
          },
          {
            text: "خارج الخدمة"
          }
        ]
      },

      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      CarColorID: {
        table: "CarColor",
        value: "ID_KEY",
        text: "Name"
      },
      CarTypeID: {
        table: "CarType",
        value: "ID_KEY",
        text: "Name"
      },
      CarUsageID: {
        table: "CarUsage",
        value: "ID_KEY",
        text: "Name"
      },
      CarPreparationID: {
        table: "CarPreparation",
        value: "ID_KEY",
        text: "Name"
      },
      CarCargoID: {
        table: "CarCargo",
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
        date = ["ReleaseDate"];

      where = this.mapToQuery(where, likes, multi, date);
      this.api("global/get_all", {
        table: "UnitsCars",
        where: where,
        include: [
          {
            model: "Unit"
          },
          {
            model: "CarColor"
          },
          {
            model: "CarType"
          },
          {
            model: "CarUsage"
          },
          {
            model: "CarPreparation"
          },
          {
            model: "CarCargo"
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
          let totals = Object.values(
            lodash.groupBy(data, ele => ele.CarType.ID_KEY)
          ).map(ele => ({
            type: ele[0].CarType.Name,
            number: ele.length
          }));
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
      if (this.unitCar.TakenAction) {
        this.$set(this.unitCar, "Continuity", false);
      }

      saveItem = await this.api(
        `global/${this.unitCar.isEdit ? "update_one" : "create_one"}`,
        {
          table: "UnitsCars",
          where: !this.unitCar.isEdit
            ? this.unitCar
            : {
                ID_KEY: this.unitCar.ID_KEY
              },
          update: this.unitCar
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
      this.$set(this, "unitCar", {});

      this.$set(this, "unitCar", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "unitCar", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "UnitsCars",
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
