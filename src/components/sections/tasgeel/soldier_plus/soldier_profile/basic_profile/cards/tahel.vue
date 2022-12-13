<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة تأهيل جديد
    </v-btn>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'التأهيلات'">
      </table-bulider>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="addedTahel"
      :selects="selects"
      @on-submit="saveNewTahel()"
      @on-close="createdObject.model = false"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
const constants = require("@/Constant").default;

export default {
  name: "basic-profile-fugitives",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    conscripte: {
      type: Object,
      default: () => ({})
    }
  },
  async mounted() {
    this.init();
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "tahel",
        include: [{ model: "Rateb" }, { model: "TahelCourses" }],
        where: {
          id: this.conscripte.ID
        }
      });
      this.items = result.data;
    },
    async saveNewTahel(edirableFromTableItem) {
      if (
        this.items.find(
          ele =>
            ele.leavel === this.addedTahel.leavel &&
            ele.id === this.conscripte.ID
        )
      ) {
        this.showError("هذه الفرقة مضافة بالفعل لنفس الشخص");
      } else if (
        this.items.find(
          ele =>
            ele.degree === this.addedTahel.degree &&
            ele.id === this.conscripte.ID
        )
      ) {
        this.showError("هذه الدرجة موجودة بالفعل لنفس الشخص");
      } else {
        this.$set(this.createdObject, "loading", true);
        this.addedTahel.id = this.conscripte.ID;

        let saveItem;

        try {
          saveItem = await this.api(
            `global/${this.addedTahel.isEdit ? "update_one" : "create_one"}`,
            {
              table: "tahel",
              where: !this.addedTahel.isEdit
                ? this.addedTahel
                : {
                    con: this.addedTahel.con
                  },
              update: this.addedTahel
            }
          );

          if (saveItem && saveItem.data && saveItem.ok) {
            this.showSuccess("تم حفظ ");
            this.findItems();
            this.createdObject, "model", false;
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
      }
    },

    actionAdd() {
      this.$set(this, "addedTahel", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    addedTahel: {},

    headers: [
      {
        text: "الفرقة",
        value: "TahelCourse.Name",
        searchValue: "TahelCourseID",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "التقدير",
        value: "degree",
        searchValue: "degree",
        sortable: true,
        type: "select",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "من تاريخ",
        value: "date_from",
        searchValue: "date_from",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الى تاريخ",
        value: "date_to",
        searchValue: "date_to",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      }
    ],
    search: "",
    createdObject: {
      model: false,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },

    selects: {
      degree: {
        data: constants.degrees.data
      },
      TahelCourseID: {
        table: "TahelCourses",
        value: "ID_KEY",
        text: "Name"
      }
    }
  })
};
</script>
