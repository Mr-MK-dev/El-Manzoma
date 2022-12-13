<template>
  <div>
    <v-btn
      @click="actionAdd()"
      :loading="searchLoading"
      large
      outlined
      color="primary"
    >
      تغيير الرقم العسكري
    </v-btn>
    <editor-dialog-bulider
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :data="changeID"
      :selects="selects"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
export default {
  name: "changeID",
  mounted() {
    this.init();
  },
  data: () => ({
    changeID: {},
    subjectLimit: 10,
    createdObject: {
      model: true,
      fullscreen: false,
      loading: false,
      deleteModel: false,
      viewModel: false,
      item: {}
    },
    search: {},
    searchLoading: false,
    mainTable: {
      headers: [
        {
          text: "نوع المراد تغيير رقمة",
          value: "Type",
          searchValue: "Type",
          sortable: true,
          type: "select",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الرقم العسكري الحالي",
          value: "current",
          searchValue: "current",
          sortable: true,
          type: "text",
          inSearch: true,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "الرقم العسكري الجديد",
          value: "new",
          searchValue: "new",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: false,
          inModel: true,
          required: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    selects: {
      Type: {
        text: "text",
        value: "text",
        data: [
          {
            text: "مجند"
          },
          {
            text: "راتب عالي"
          }
        ]
      }
    }
  }),

  methods: {
    actionAdd() {
      this.$set(this, "changeID", {});
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async saveItem(edirableFromTableItem) {
      this.$set(this.createdObject, "loading", true);
      let saveItem;
      try {
        saveItem = await this.api(`global/update_one`, {
          table: `${this.changeID.Type == "مجند" ? "Soldier" : "Rateb"}`,
          where: { ID: this.changeID.current },

          update: { ID: this.changeID.new }
        });

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم تغيير الرقم العسكري ");
          this.$set(this.createdObject, "model", false);
        } else {
          this.showError(
            "تعذر حفظ  في قاعدة البيانات قد يكون الرقم غير موجود او مرتبط بجداول اخرى"
          );
        }
        this.$set(this.createdObject, "model", false);
      } catch (error) {
        this.showError("تعذر حفظ  في قاعدة البيانات");
        console.log(error);
      } finally {
        this.$set(this.createdObject, "loading", false);
      }
    }
  }
};
</script>

<style scoped></style>
