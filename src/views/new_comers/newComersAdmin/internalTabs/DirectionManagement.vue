<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      @on-search="findItems"
      @on-add="actionAdd()"
      :clearOption="true"
      title="بحث متقدم في الإتجاه"
      addBtnTitle="إضافة الي الإتجاه"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'الإتجاه'"
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
      :data="direction"
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
  name: "DirectionManagement",
  props: {},
  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    direction: {},
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
          searchValue: "actionsStart",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 5
        },
        {
          text: "المؤهل",
          value: "KnowledgeLevel",
          searchValue: "KnowledgeLevel",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الإتجاه",
          value: "Direction",
          searchValue: "Direction",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المحافظة",
          value: "Cities.City",
          searchValue: "City",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: false,
          sort: 1
        },
        {
          text: "منطقة التجنيد",
          value: "RecuRegion",
          searchValue: "RecuRegion",
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
    componentName: "DirectionManagement",
    selects: {
      City: {
        table: "City",
        value: "CityID",
        text: "City"
      },
      KnowledgeLevel: {
        data: constants.KnowledgeLevel.data
      },
      RecuRegion: {
        ...constants.RecuRegion
      },
      Direction: {
        data: constants.Direction.data
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
              table: "Direction",
              where: {
                Direction_ID: item.Direction_ID
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
        !!this.test.find(
          ele => ele.Direction_ID == this.direction.Direction_ID
        ) &&
        this.direction.isEdit == false
      ) {
        return this.showError("رقم السلاح موجود بالفعل");
      }
      if (!this.direction.isEdit) {
        this.direction.Direction_ID = this.test.length + 50;
      }
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        console.log("xxx", {
          table: "Direction",
          where: !this.direction.isEdit
            ? this.direction
            : {
                Direction_ID: this.direction.Direction_ID
              },
          update: this.direction
        });

        saveItem = await this.api(
          `global/${this.direction.isEdit ? "update_one" : "create_one"}`,
          {
            table: "Direction",
            where: !this.direction.isEdit
              ? this.direction
              : {
                  Direction_ID: this.direction.Direction_ID
                },
            update: this.direction
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
        likes = [],
        multi = [],
        dates = [];

      this.api("global/get_all", {
        table: "Direction",
        include: [{ model: "City" }],
        where: this.mapToQuery(where, likes, multi, dates)
      })
        .then(x => {
          let data = x.data.map(ele => ({
              ...ele,
              RecuRegion: ele.RecuRegion.replaceAll(" ", ""),
              Cities: this.selects.City.data.find(
                city => city.CityID == ele.City
              )
            })),
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };
          console.log(data);
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
      this.$set(this, "direction", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "direction", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
