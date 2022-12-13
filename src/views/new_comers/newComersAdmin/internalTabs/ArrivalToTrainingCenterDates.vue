<template>
  <div>
    <search-bulider
      :fields="mainTable.headers"
      :selects="selects"
      :addButton="true"
      @on-search="findItems"
      :clearOption="true"
      @on-add="actionAdd()"
      title="بحث متقدم في تواريخ الترحيل لمركز التدريب"
      addBtnTitle="إضافة تاريخ ترحيل"
    />

    <table-bulider
      :headers="mainTable.headers"
      :printer="mainTable.printer"
      :items="mainTable.items"
      :title="'تواريخ الترحيل'"
    >
      <template v-slot:item.actionsEdit="{ item }">
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
      :title="''"
      :open="createdObject.model"
      :loading="searchLoading"
      :fields="mainTable.headers"
      :selects="selects"
      :data="arrivalDate"
      @on-close="createdObject.model = false"
      @on-submit="saveItem()"
    >
    </editor-dialog-bulider>
  </div>
</template>

<script>
export default {
  name: "ArrivalToTrainingCenterDates",
  mounted() {
    this.init();
  },
  data: () => ({
    arrivalDate: {},
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
          text: "تاريخ الترحيل لمركز التدريب (عليا)",
          value: "HighDateArrival",
          searchValue: "HighDateArrival",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل لمركز التدريب (فوق متوسطة)",
          value: "AboveAvgDateArrival",
          searchValue: "AboveAvgDateArrival",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل لمركز التدريب ( متوسطة)",
          value: "AvgDateArrival",
          searchValue: "AvgDateArrival",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل لمركز التدريب (عادة)",
          value: "NormalDateArrival",
          searchValue: "NormalDateArrival",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل للوحدات (عليا)",
          value: "HighDateLeave",
          searchValue: "HighDateLeave",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          required: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل للوحدات (فوق متوسطة)",
          value: "AboveAvgDateLeave",
          searchValue: "AboveAvgDateLeave",
          sortable: true,
          type: "text",
          inSearch: false,
          required: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل للوحدات ( متوسطة)",
          value: "AvgDateLeave",
          searchValue: "AvgDateLeave",
          sortable: true,
          type: "text",
          inSearch: false,
          required: true,
          inTable: true,
          inModel: true,
          sort: 1
        },
        {
          text: "تاريخ الترحيل للوحدات (عادة)",
          value: "NormalDateLeave",
          searchValue: "NormalDateLeave",
          sortable: true,
          type: "text",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "المرحلة",
          value: "RecuStage",
          searchValue: "RecuStage",
          sortable: true,
          type: "select",
          inSearch: false,
          inTable: true,
          inModel: true,
          required: true,
          sort: 1
        },
        {
          text: "",
          value: "actionsEdit",
          searchValue: "",
          sortable: true,
          inSearch: false,
          inModel: false,
          inTable: true,
          sort: 1
        }
      ],
      items: [],
      printer: {}
    },
    componentName: "arrivalDates",
    selects: {
      RecuStage: {
        text: "Name",
        value: "Name",
        table: "RecStages"
      }
    }
  }),

  methods: {
    actionAdd() {
      this.$set(this, "arrivalDate", {
        isEdit: false
      });
      this.$set(this.createdObject, "item", {});
      this.$set(this.createdObject, "model", true);
    },

    async saveItem(edirableFromTableItem) {
      try {
        this.$set(this.createdObject, "loading", true);
        let saveItem;
        saveItem = await this.api(
          `global/${this.arrivalDate.isEdit ? "update_one" : "create_one"}`,
          {
            table: "ArrivalToTrainingCenterDates",
            where: !this.arrivalDate.isEdit
              ? this.arrivalDate
              : {
                  ID_KEY: this.arrivalDate.ID_KEY
                },
            update: this.arrivalDate
          }
        );

        if (saveItem && saveItem.data && saveItem.ok) {
          this.showSuccess("تم حفظ ");
          this.findItems({});
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
    },

    findItems(filters) {
      this.$set(this, "searchLoading", true);
      this.$set(this, "items", []);
      let where = {
        ...filters
      };

      this.api("global/get_all", {
        table: "ArrivalToTrainingCenterDates"
        // where: this.mapToQuery(where, [], [], [])
      })
        .then(async x => {
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
          console.log(error);
          this.showError("حدث خطأ أثناء احضار البيانات من قاعدة البيانات");
        })
        .finally(() => {
          this.$set(this, "searchLoading", false);
        });
    },
    actionEdit(item) {
      this.$set(this.createdObject, "model", true);
      this.$set(this, "arrivalDate", {
        ...item,
        isEdit: true
      });
    },
    async deleteItem(item) {
      this.$set(this.del, "loading", true);
      let { id, type } = this.del,
        delItem = await this.api("global/delete_all", {
          table: "ArrivalToTrainingCenterDates",
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
