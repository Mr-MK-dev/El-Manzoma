<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في أجهزة إشارة الوحدات"
      addBtnTitle="إضافة أجهزة إشارة جديدة"
    />
    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'أجهزة إشارة الوحدات'"
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
      :title="'إضافة أجهزة إشارة جديدة'"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="unitSignal"
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
  name: "UnitsSignals",
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
    unitSignal: {},
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
          text: "نوع الجهاز",
          value: "SignalWeaponType.Name",
          searchValue: "SignalWeaponTypeID",
          sortable: true,
          type: "select",
          inTable: true,
          inSearch: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اسم الجهاز",
          value: "SignalWeapon.Name",
          searchValue: "SignalWeaponID",
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
          text: "عدد الأجهزة",
          value: "TotalSignalWeapons",
          searchValue: "TotalSignalWeapons",
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
    selects: {
      UnitID: {
        table: "Unit",
        value: "UnitID",
        text: "Unit"
      },
      SignalWeaponTypeID: {
        table: "SignalWeaponTypes",
        value: "ID_KEY",
        text: "Name"
      },
      SignalWeaponID: {
        data: [],
        value: "ID_KEY",
        text: "Name"
      }
    }
  }),

  watch: {
    "unitSignal.SignalWeaponTypeID"(newValue) {
      this.findOne(newValue);
    }
  },
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
        table: "UnitSignals",
        where: where,
        include: [
          {
            model: "Unit"
          },
          {
            model: "SignalWeapons"
          },
          {
            model: "SignalWeaponTypes"
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

      saveItem = await this.api(
        `global/${this.unitSignal.isEdit ? "update_one" : "create_one"}`,
        {
          table: "UnitSignals",
          where: !this.unitSignal.isEdit
            ? this.unitSignal
            : {
                ID_KEY: this.unitSignal.ID_KEY
              },
          update: this.unitSignal
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

    findOne(id) {
      this.api("global/get_all", {
        table: "SignalWeapons",
        where: { TypeID: id }
      })
        .then(x => {
          this.selects.SignalWeaponID.data = x.data;
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    actionAdd() {
      this.$set(this, "unitSignal", {});

      this.$set(this, "unitSignal", { isEdit: false });

      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "unitSignal", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "UnitSignals",
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
