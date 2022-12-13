<template>
  <div>
    <v-btn @click="actionAdd()" large outlined color="primary">
      إضافة ترقية جديدة
    </v-btn>
    <v-card :loading="loading" :disabled="loading">
      <table-bulider :headers="headers" :items="items" :title="'الترقيات'">
      </table-bulider>
    </v-card>

    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="createdObject.loading"
      :fields="headers"
      :data="levelUp"
      :selects="selects"
      @on-submit="saveNewLevelUp()"
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
    await this.findItems();
  },
  methods: {
    async findItems() {
      const result = await this.api("global/get_all", {
        table: "prevlevelup",
        include: [],
        where: {
          ID: this.conscripte.ID
        }
      });

      this.items = result.data;
    },
    async saveNewLevelUp(edirableFromTableItem) {
      if (
        this.items.find(
          ele =>
            ele.level === this.levelUp.level && ele.id === this.conscripte.ID
        )
      ) {
        this.showError("هذه الترقية مضافة بالفعل لنفس الشخص");
      } else if (
        this.items.find(
          ele =>
            ele.count === this.levelUp.count && ele.id === this.conscripte.ID
        )
      ) {
        this.showError("هذا الرقم المسلسل موجود بالفعل لنفس الشخص");
      } else {
        this.$set(this.createdObject, "loading", true);
        this.levelUp.id = this.conscripte.ID;

        let saveItem;

        try {
          saveItem = await this.api(
            `global/${this.levelUp.isEdit ? "update_one" : "create_one"}`,
            {
              table: "prevlevelup",
              where: !this.levelUp.isEdit
                ? this.levelUp
                : {
                    con: this.levelUp.con
                  },
              update: this.levelUp
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
      this.$set(this, "levelUp", { isEdit: false });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    }
  },
  data: () => ({
    tableFilters: {},
    loading: false,
    levelUp: {},

    headers: [
      {
        text: "المسلسل",
        value: "count",
        searchValue: "count",
        sortable: true,
        type: "text",
        inSearch: false,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "تاريخ اخد الدرجة",
        value: "date_level",
        searchValue: "date_level",
        sortable: true,
        type: "date",
        inSearch: true,
        inTable: true,
        inModel: true,
        sort: 1
      },
      {
        text: "الدرجة",
        value: "level",
        searchValue: "level",
        sortable: true,
        type: "select",
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
      level: {
        data: constants.ratebLevels
      }
    }
  })
};
</script>
