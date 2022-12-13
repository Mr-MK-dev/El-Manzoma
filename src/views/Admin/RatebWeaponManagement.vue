<template>
  <div>
    <search-bulider
        :fields="mainTable.headers"
        :selects="selects"
        @on-search="findItems"
        @on-add="actionAdd()"
        :clearOption="true"
        title="بحث متقدم في الأسلحة"
        addBtnTitle="إضافة الي الأسلحة"
    />

    <table-bulider
        :headers="mainTable.headers"
        :printer="mainTable.printer"
        :items="mainTable.items"
        :title="'الأسلحة'"
    >
      <template v-slot:item.actionsStart="{ item }">
        <v-chip color="transparent">
          <v-btn
              v-if="isAdmin() || hasEditAccess()"
              icon
              @click="actionEdit(item)"
              color="primary"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
              v-if="isAdmin() || hasDeleteAccess()"
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
        :data="weapon"
        @on-close="createdObject.model = false"
        @on-submit="saveItem()"
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
  name: "HighLevelWeaponManagement",
  props: {},
  mounted() {
    this.init();
    this.findItems({});
  },
  data: () => ({
    weapon: {},
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
          text: "رقم السلاح",
          value: "WeaponID",
          searchValue: "WeaponID",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "اسم السلاح",
          value: "Weapon",
          searchValue: "Weapon",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        }
        // {
        //   text: "مركز التدريب",
        //   value: "Markez_Tadreb",
        //   searchValue: "Markez_Tadreb",
        //   sortable: true,
        //   type: "text",
        //   inSearch: false,
        //   inTable: true,
        //   inModel: true,
        //   required: false,
        //   sort: 1
        // }
      ],
      items: [],
      printer: {}
    },
    test: [],
    componentName: "RatebWeaponManagement",
    selects: {}
  }),
  methods: {
    async actionDelete(item) {
      this.$confirm(`هل انت متاكد من تغير الحالة`, {
        title: ``
      })
          .then(async res => {
            if (res) {
              await this.api(`global/delete_all`, {
                table: "HighLevelWeaponManagement",
                where: {
                  WeaponID: item.WeaponID
                }
              });
              await this.findItems({});
            }
          })
          .catch(error => {
            this.handleError(error);
            this.showError("هذا السلاح قد يكون مربوط بمرتب او مجند او راتب عالي");
          });
    },
    async saveItem(edirableFromTableItem) {
      if (
          !!this.test.find(ele => ele.WeaponID == this.weapon.WeaponID) &&
          this.weapon.isEdit == false
      ) {
        return this.showError("رقم السلاح موجود بالفعل");
      }
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;

        saveItem = await this.api(
            `global/${this.weapon.isEdit ? "update_one" : "create_one"}`,
            {
              table: "HighLevelWeaponManagement",
              where: !this.weapon.isEdit
                  ? this.weapon
                  : {
                    WeaponID: this.weapon.WeaponID
                  },
              update: this.weapon
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
        this.handleError(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    },
    async findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
            ...filters,
          },
          likes = ["WeaponID", "Weapon"],
          multi = [],
          dates = [];
      let x;
      try {
        x = await this.api("global/get_all", {
          table: "HighLevelWeaponManagement",
          where: this.mapToQuery(where, likes, multi, dates)
        });

        let data = x.data,
            printer = {
              data: [...data],
              excelKey: "data",
              excelHeaders: this.mainTable.headers.filter(f => f.inTable)
            };

        this.$set(this.mainTable, "items", data);
        this.$set(this, "test", data);
        this.$set(this.mainTable, "printer", printer);
      } catch (error) {
        this.handleError(error);
        this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
      } finally {
        this.$set(this, "searchLoading", false);
      }
    },
    actionAdd() {
      this.$set(this, "weapon", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "weapon", {
        ...item,
        isEdit: true
      });
    }
  }
};
</script>
