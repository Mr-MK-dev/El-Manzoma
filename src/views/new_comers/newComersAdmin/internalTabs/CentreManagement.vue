<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في المراكز"
      addBtnTitle="إضافة الي المراكز"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'المراكز'"
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
      :fields="mainTable.headers"
      :selects="selects"
      :data="centre"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("@/Constant").default;
const lodash = require("lodash");

export default {
  name: "CentreManagement",
  props: {},
  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    centre: {},
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
          text: "رقم المركز",
          value: "CentreID",
          searchValue: "CentreID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اسم المركز",
          value: "Centre",
          searchValue: "Centre",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "City.City",
          searchValue: "CityID",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    test: [],
    componentName: "CentreManagement",
    selects: {
      CityID: {
        table: "City",
        value: "CityID",
        text: "City"
      }
    }
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
        .then(async res => {
          if (res) {
            await this.api(`global/delete_all`, {
              table: "Centre",
              where: {
                CentreID: item.CentreID
              }
            });
            this.findItems({});
          }
        })
        .catch(error => {
          console.log(error);
          this.showError("تعذر في حذف المركز بسبب ربطه بعسكري");
        });
    },
    async saveItem(edirableFromTableItem) {
      if (
        !!this.test.find(ele => ele.CentreID == this.centre.CentreID) &&
        this.centre.isEdit == false
      ) {
        return this.showError("رقم السلاح موجود بالفعل");
      }
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
          `global/${this.centre.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Centre",
            where: !this.centre.isEdit
              ? this.centre
              : {
                  CentreID: this.centre.CentreID
                },
            update: this.centre
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
          this.$set(this.createdObject, "model", false);
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
    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
          ...filters
        },
        likes = ["CentreID", "Centre", "Markez_Tadreb"],
        multi = [],
        dates = [];

      this.api("global/get_all", {
        table: "Centre",
        include: [{ model: "City" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(x => {
          let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

          this.$set(this.mainTable, "items", data);
          this.$set(this, "test", data);
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
      this.$set(this, "centre", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "centre", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
